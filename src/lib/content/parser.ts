import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import matter from "gray-matter";
import type { ContentDocument, WikiLink } from "./types";

// Regex patterns
const WIKILINK_PATTERN = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const TIER_PATTERN = /^##\s+(At a Glance|Common Knowledge|Secret Knowledge)\s*$/im;
const SECTION_PATTERN = /^##\s+(.+?)\s*$/gm;
const METADATA_TABLE_PATTERN = /^\|\s*\|\s*\|\s*\n\|---\|---\|\s*\n((?:\|[^|]+\|[^|]+\|\s*\n)+)/m;
const EPIGRAPH_PATTERN = /^>\s*\*"([^"]+)"\*\s*$/m;
const MERMAID_PATTERN = /```mermaid\n([\s\S]*?)```/;

/**
 * Parse WikiLinks and return them as objects
 */
export function parseWikiLinks(content: string): WikiLink[] {
  const links: WikiLink[] = [];
  let match;

  while ((match = WIKILINK_PATTERN.exec(content)) !== null) {
    const [, target, display] = match;
    const [pageName, anchor] = target.split("#");
    links.push({
      display: display || pageName,
      target: pageName,
      anchor: anchor || undefined,
    });
  }

  return links;
}

/**
 * Convert WikiLinks to HTML links
 * @param content - Markdown content with WikiLinks
 * @param linkResolver - Function to resolve WikiLink targets to URLs
 */
export function convertWikiLinks(
  content: string,
  linkResolver: (target: string) => string | null
): string {
  return content.replace(WIKILINK_PATTERN, (_, target, display) => {
    const [pageName, anchor] = target.split("#");
    const url = linkResolver(pageName);
    const displayText = display || pageName;

    if (!url) {
      // Broken link - return as styled span
      return `<span class="broken-link" title="Page not found: ${pageName}">${displayText}</span>`;
    }

    const fullUrl = anchor ? `${url}#${anchor}` : url;
    return `[${displayText}](${fullUrl})`;
  });
}

/**
 * Parse metadata from the table format used in Obsidian
 */
export function parseMetadataTable(content: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  const match = content.match(METADATA_TABLE_PATTERN);

  if (match) {
    const rows = match[1].trim().split("\n");
    for (const row of rows) {
      const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 2) {
        const key = cells[0].replace(/\*\*/g, "").trim();
        const value = cells[1].trim();
        if (key) {
          metadata[key] = value;
        }
      }
    }
  }

  return metadata;
}

/**
 * Extract epigraph (opening quote) from content
 */
export function extractEpigraph(content: string): string | undefined {
  const match = content.match(EPIGRAPH_PATTERN);
  return match ? match[1] : undefined;
}

/**
 * Extract section content between headers
 */
export function extractSection(
  content: string,
  sectionName: string
): string | null {
  const sectionStart = new RegExp(
    `^##\\s+${sectionName}\\s*$\\n(?:>.*?\\n)?`,
    "im"
  );
  const startMatch = content.match(sectionStart);

  if (!startMatch || startMatch.index === undefined) {
    return null;
  }

  const startIndex = startMatch.index + startMatch[0].length;

  // Find the next ## header or end of content
  const remainingContent = content.slice(startIndex);
  const nextSectionMatch = remainingContent.match(/^##\s+/m);

  const endIndex = nextSectionMatch?.index
    ? startIndex + nextSectionMatch.index
    : content.length;

  const sectionContent = content.slice(startIndex, endIndex).trim();

  // Remove the description line if present ("> **What anyone...**")
  return sectionContent.replace(/^>\s*\*\*.+?\*\*\s*\n+/, "").trim();
}

/**
 * Extract See Also links
 */
export function extractSeeAlso(content: string): string[] {
  const section = extractSection(content, "See Also");
  if (!section) return [];

  const links: string[] = [];
  const linkMatches = section.matchAll(WIKILINK_PATTERN);

  for (const match of linkMatches) {
    links.push(match[1].split("#")[0]); // Remove anchors
  }

  return links;
}

/**
 * Extract Mermaid diagram from Connections section
 */
export function extractConnections(content: string): string | undefined {
  const section = extractSection(content, "Connections");
  if (!section) return undefined;

  const match = section.match(MERMAID_PATTERN);
  return match ? match[1].trim() : undefined;
}

/**
 * Convert markdown to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return String(result);
}

/**
 * Parse a full Obsidian document into structured content
 */
export function parseObsidianDocument(
  content: string,
  sourcePath: string
): Omit<ContentDocument, "slug" | "category"> {
  // Check for YAML frontmatter
  const { data: yamlMeta, content: bodyContent } = matter(content);

  // Extract title from first H1
  const titleMatch = bodyContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled";

  // Parse metadata from table format
  const tableMeta = parseMetadataTable(bodyContent);
  const metadata = { ...tableMeta, ...yamlMeta };

  // Extract epigraph
  const epigraph = extractEpigraph(bodyContent);

  // Extract tier content
  const atAGlance = extractSection(bodyContent, "At a Glance") || "";
  const commonKnowledge = extractSection(bodyContent, "Common Knowledge") || "";
  const secretKnowledge = extractSection(bodyContent, "Secret Knowledge") || "";

  // Extract additional sections
  const connections = extractConnections(bodyContent);
  const seeAlso = extractSeeAlso(bodyContent);

  return {
    title,
    metadata,
    epigraph,
    atAGlance,
    commonKnowledge,
    secretKnowledge,
    connections,
    seeAlso,
    rawContent: bodyContent,
    sourcePath,
  };
}

/**
 * Generate a URL-friendly slug from a title
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove consecutive hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Map Obsidian folder to category
 */
export function pathToCategory(sourcePath: string): string {
  const parts = sourcePath.split("/");

  // Look for known category folders
  const categoryMappings: Record<string, string> = {
    "01-World": "world",
    "02-Geography": "geography",
    "03-History": "history",
    "04-Factions": "factions",
    "05-Peoples": "peoples",
    "06-NPCs": "npcs",
  };

  for (const part of parts) {
    if (categoryMappings[part]) {
      return categoryMappings[part];
    }
  }

  return "misc";
}
