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
 * Escape special regex characters in a string
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Header aliases for content tiers
const AT_A_GLANCE_HEADERS = ["At a Glance", "Overview", "Summary"];
const COMMON_KNOWLEDGE_HEADERS = [
  "Common Knowledge",
  "Key Facts",
  "Personality & Approach",
];
const SECRET_KNOWLEDGE_HEADERS = [
  "Secret Knowledge",
  "Secret (DM Only)",
  "DM Notes",
  "Secrets",
];

// Sections that are not tier content (excluded from fallback)
const META_SECTIONS = new Set([
  "Connections",
  "Connections Map",
  "See Also",
  "Notes",
  "Quick Reference",
  "Combat Statistics",
]);

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
    `^##\\s+${escapeRegExp(sectionName)}\\s*$\\n(?:>.*?\\n)?`,
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
 * Try extracting a section using a list of header names.
 * Returns content from the first matching header.
 */
function extractFirstMatch(content: string, headers: string[]): string {
  for (const header of headers) {
    const section = extractSection(content, header);
    if (section) return section;
  }
  return "";
}

/**
 * Extract and combine content from all matching headers.
 */
function extractAllMatches(content: string, headers: string[]): string {
  const parts: string[] = [];
  for (const header of headers) {
    const section = extractSection(content, header);
    if (section) parts.push(section);
  }
  return parts.join("\n\n");
}

/**
 * Get all H2 sections from content as name/content pairs.
 * Used as fallback for documents without recognized tier headers.
 */
function getAllSections(
  content: string
): Array<{ name: string; body: string }> {
  const sections: Array<{ name: string; body: string }> = [];
  const headerRegex = /^##\s+(.+?)\s*$/gm;
  const matches = [...content.matchAll(headerRegex)];

  for (let i = 0; i < matches.length; i++) {
    const name = matches[i][1];
    const startIndex = matches[i].index! + matches[i][0].length;
    const endIndex =
      i + 1 < matches.length ? matches[i + 1].index! : content.length;
    const body = content.slice(startIndex, endIndex).trim();
    if (body) {
      sections.push({ name, body });
    }
  }

  return sections;
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

  // Extract tier content using header aliases
  let atAGlance = extractFirstMatch(bodyContent, AT_A_GLANCE_HEADERS);
  let commonKnowledge = extractAllMatches(bodyContent, COMMON_KNOWLEDGE_HEADERS);
  let secretKnowledge = extractAllMatches(bodyContent, SECRET_KNOWLEDGE_HEADERS);

  // Fallback: if no player-visible content found, split raw sections intelligently
  if (!atAGlance && !commonKnowledge) {
    const allSections = getAllSections(bodyContent);
    // Exclude meta sections and sections already captured by tier aliases
    const aliasCaptured = new Set([
      ...AT_A_GLANCE_HEADERS,
      ...COMMON_KNOWLEDGE_HEADERS,
      ...SECRET_KNOWLEDGE_HEADERS,
    ]);
    const contentSections = allSections.filter(
      (s) => !META_SECTIONS.has(s.name) && !aliasCaptured.has(s.name)
    );

    if (contentSections.length > 0) {
      // First content section → atAGlance
      atAGlance = contentSections[0].body;

      // Split remaining by DM relevance
      const dmPattern = /\bDM\b|^Secret/i;
      const remaining = contentSections.slice(1);
      const playerSections = remaining.filter((s) => !dmPattern.test(s.name));
      const dmSections = remaining.filter((s) => dmPattern.test(s.name));

      if (playerSections.length > 0) {
        commonKnowledge = playerSections
          .map((s) => `### ${s.name}\n\n${s.body}`)
          .join("\n\n");
      }

      if (dmSections.length > 0) {
        const dmContent = dmSections.map((s) => s.body).join("\n\n");
        secretKnowledge = secretKnowledge
          ? secretKnowledge + "\n\n" + dmContent
          : dmContent;
      }
    }
  }

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
