#!/usr/bin/env npx tsx

/**
 * Content Build Script
 *
 * Processes Obsidian markdown files and generates:
 * 1. JSON content files for each document
 * 2. A content manifest with all documents and links
 * 3. A search index for client-side search
 *
 * Usage: npx tsx scripts/build-content.ts
 */

import * as fs from "fs";
import * as path from "path";
import {
  parseObsidianDocument,
  slugify,
  pathToCategory,
  convertWikiLinks,
  markdownToHtml,
} from "../src/lib/content/parser";
import type {
  ContentDocument,
  ContentManifest,
  SearchIndexEntry,
  Category,
} from "../src/lib/content/types";

// Configuration
const VAULT_PATH =
  process.env.OBSIDIAN_VAULT_PATH ||
  "/home/ekarus/Documents/Exilium/Ekarus Obsidian/Exilium";
const OUTPUT_DIR = path.join(process.cwd(), "src/content");
const CONTENT_DIR = path.join(OUTPUT_DIR, "documents");
const PUBLIC_CONTENT_DIR = path.join(process.cwd(), "public/content");

// Skip content build if vault isn't available (e.g. on Vercel) and pre-built content exists
if (!fs.existsSync(VAULT_PATH) && fs.existsSync(path.join(OUTPUT_DIR, "manifest.json"))) {
  console.log(`Vault not found at ${VAULT_PATH}, using pre-built content. Skipping build.`);
  process.exit(0);
}

// Category definitions
const CATEGORIES: Category[] = [
  {
    slug: "geography",
    name: "Geography",
    description: "The lands, cities, and regions of Exilium",
    path: "02-Geography",
  },
  {
    slug: "factions",
    name: "Factions",
    description: "The major powers and organizations",
    path: "04-Factions",
  },
  {
    slug: "peoples",
    name: "Peoples",
    description: "Cultures, races, and societies",
    path: "05-Peoples",
  },
  {
    slug: "history",
    name: "History",
    description: "The events that shaped the world",
    path: "03-History",
  },
  {
    slug: "npcs",
    name: "NPCs",
    description: "Notable characters and their secrets",
    path: "06-NPCs",
  },
  {
    slug: "world",
    name: "World",
    description: "World systems and mechanics",
    path: "01-World",
  },
];

// Files/folders to exclude
const EXCLUDED_PATTERNS = [
  /^00-/, // Templates, dashboard
  /^99-/, // Templates
  /Template/i,
  /\.obsidian/,
];

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Check exclusions
    if (EXCLUDED_PATTERNS.some((pattern) => pattern.test(entry.name))) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Build a registry of titles to slugs for WikiLink resolution
 */
function buildLinkRegistry(
  documents: ContentDocument[]
): Record<string, string> {
  const registry: Record<string, string> = {};

  for (const doc of documents) {
    // Map title to URL path
    registry[doc.title] = `/${doc.category}/${doc.slug}`;

    // Also map filename without extension
    const filename = path.basename(doc.sourcePath, ".md");
    if (filename !== doc.title) {
      registry[filename] = `/${doc.category}/${doc.slug}`;
    }
  }

  return registry;
}

/**
 * Create search index entry
 */
function createSearchEntry(
  doc: ContentDocument,
  tier: "player" | "dm"
): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = [];

  // Player content (At a Glance + Common Knowledge)
  if (tier === "player") {
    const content = [doc.atAGlance, doc.commonKnowledge]
      .filter(Boolean)
      .join(" ");

    if (content) {
      entries.push({
        slug: doc.slug,
        category: doc.category,
        title: doc.title,
        content: content.replace(/[#*_\[\]]/g, " ").slice(0, 1000),
        tier: "common-knowledge",
      });
    }
  }

  // DM content (all tiers including secrets)
  if (tier === "dm") {
    const content = [doc.atAGlance, doc.commonKnowledge, doc.secretKnowledge]
      .filter(Boolean)
      .join(" ");

    if (content) {
      entries.push({
        slug: doc.slug,
        category: doc.category,
        title: doc.title,
        content: content.replace(/[#*_\[\]]/g, " ").slice(0, 2000),
        tier: "secret-knowledge",
      });
    }
  }

  return entries;
}

/**
 * Process a single markdown file
 */
function processFile(
  filePath: string,
  linkRegistry: Record<string, string>
): ContentDocument | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const relativePath = path.relative(VAULT_PATH, filePath);
    const category = pathToCategory(relativePath);

    // Parse the document
    const parsed = parseObsidianDocument(content, relativePath);

    // Generate slug
    const slug = slugify(parsed.title);

    // Create link resolver function
    const linkResolver = (target: string): string | null => {
      return linkRegistry[target] || null;
    };

    // Convert WikiLinks in all content sections
    const doc: ContentDocument = {
      ...parsed,
      slug,
      category,
      atAGlance: convertWikiLinks(parsed.atAGlance, linkResolver),
      commonKnowledge: convertWikiLinks(parsed.commonKnowledge, linkResolver),
      secretKnowledge: convertWikiLinks(parsed.secretKnowledge, linkResolver),
      rawContent: convertWikiLinks(parsed.rawContent, linkResolver),
    };

    return doc;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

/**
 * Main build function
 */
async function build() {
  console.log("Building content from Obsidian vault...");
  console.log(`Vault path: ${VAULT_PATH}`);
  console.log(`Output dir: ${OUTPUT_DIR}`);

  // Find all markdown files
  const files = findMarkdownFiles(VAULT_PATH);
  console.log(`Found ${files.length} markdown files`);

  // First pass: parse all documents to build link registry
  const preliminaryDocs: ContentDocument[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const relativePath = path.relative(VAULT_PATH, file);
    const category = pathToCategory(relativePath);
    const parsed = parseObsidianDocument(content, relativePath);
    const slug = slugify(parsed.title);

    preliminaryDocs.push({
      ...parsed,
      slug,
      category,
    });
  }

  // Build link registry
  const linkRegistry = buildLinkRegistry(preliminaryDocs);
  console.log(`Link registry: ${Object.keys(linkRegistry).length} entries`);

  // Second pass: process files with link resolution
  const documents: ContentDocument[] = [];

  for (const file of files) {
    const doc = processFile(file, linkRegistry);
    if (doc) {
      documents.push(doc);
    }
  }

  // Filter out misc category (npm package READMEs and other non-Exilium content)
  const EXCLUDED_CATEGORIES = new Set(["misc"]);
  const filteredDocuments = documents.filter(
    (doc) => !EXCLUDED_CATEGORIES.has(doc.category)
  );
  console.log(
    `Processed ${documents.length} documents (${filteredDocuments.length} after filtering misc)`
  );

  // Create output directories
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_CONTENT_DIR, { recursive: true });

  // Write individual document JSON files
  for (const doc of filteredDocuments) {
    const categoryDir = path.join(CONTENT_DIR, doc.category);
    fs.mkdirSync(categoryDir, { recursive: true });

    const filePath = path.join(categoryDir, `${doc.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(doc, null, 2));
  }

  // Create content manifest
  const manifest: ContentManifest = {
    categories: CATEGORIES,
    documents: filteredDocuments.map((doc) => ({
      slug: doc.slug,
      category: doc.category,
      title: doc.title,
      hasSections: {
        atAGlance: !!doc.atAGlance,
        commonKnowledge: !!doc.commonKnowledge,
        secretKnowledge: !!doc.secretKnowledge,
      },
    })),
    wikiLinks: linkRegistry,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  // Create search indices
  const playerSearchIndex: SearchIndexEntry[] = [];
  const dmSearchIndex: SearchIndexEntry[] = [];

  for (const doc of filteredDocuments) {
    playerSearchIndex.push(...createSearchEntry(doc, "player"));
    dmSearchIndex.push(...createSearchEntry(doc, "dm"));
  }

  // Write search indices to public folder (accessible by client)
  fs.writeFileSync(
    path.join(PUBLIC_CONTENT_DIR, "search-player.json"),
    JSON.stringify(playerSearchIndex)
  );

  fs.writeFileSync(
    path.join(PUBLIC_CONTENT_DIR, "search-dm.json"),
    JSON.stringify(dmSearchIndex)
  );

  // Copy manifest to public folder too
  fs.writeFileSync(
    path.join(PUBLIC_CONTENT_DIR, "manifest.json"),
    JSON.stringify(manifest)
  );

  // Summary
  console.log("\nBuild complete!");
  console.log(`  Documents: ${filteredDocuments.length}`);
  console.log(`  Categories: ${CATEGORIES.length}`);
  console.log(`  Player search entries: ${playerSearchIndex.length}`);
  console.log(`  DM search entries: ${dmSearchIndex.length}`);
  console.log(`\nOutput written to:`);
  console.log(`  ${OUTPUT_DIR}`);
  console.log(`  ${PUBLIC_CONTENT_DIR}`);
}

// Run build
build().catch(console.error);
