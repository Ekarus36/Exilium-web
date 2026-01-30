import * as fs from "fs";
import * as path from "path";
import type { ContentDocument, ContentManifest } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

// Categories to exclude from display
const EXCLUDED_CATEGORIES = ["misc"];

/**
 * Load content manifest (filtered)
 */
export function getManifest(): ContentManifest {
  const manifestPath = path.join(CONTENT_DIR, "manifest.json");
  const content = fs.readFileSync(manifestPath, "utf-8");
  const manifest: ContentManifest = JSON.parse(content);

  // Filter out excluded categories
  return {
    ...manifest,
    categories: manifest.categories.filter(
      (cat) => !EXCLUDED_CATEGORIES.includes(cat.slug)
    ),
    documents: manifest.documents.filter(
      (doc) => !EXCLUDED_CATEGORIES.includes(doc.category)
    ),
  };
}

/**
 * Load raw manifest (unfiltered, for internal use)
 */
export function getRawManifest(): ContentManifest {
  const manifestPath = path.join(CONTENT_DIR, "manifest.json");
  const content = fs.readFileSync(manifestPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Load a single document by category and slug
 */
export function getDocument(
  category: string,
  slug: string
): ContentDocument | null {
  // Block access to excluded categories
  if (EXCLUDED_CATEGORIES.includes(category)) {
    return null;
  }

  const filePath = path.join(CONTENT_DIR, "documents", category, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

/**
 * Get all documents for a category
 */
export function getDocumentsByCategory(category: string): ContentDocument[] {
  // Block access to excluded categories
  if (EXCLUDED_CATEGORIES.includes(category)) {
    return [];
  }

  const categoryDir = path.join(CONTENT_DIR, "documents", category);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".json"));
  const documents: ContentDocument[] = [];

  for (const file of files) {
    const filePath = path.join(categoryDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    documents.push(JSON.parse(content));
  }

  return documents.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Get all document slugs for static generation
 */
export function getAllDocumentPaths(): { category: string; slug: string }[] {
  const manifest = getManifest();
  return manifest.documents.map((doc) => ({
    category: doc.category,
    slug: doc.slug,
  }));
}

/**
 * Get all category slugs
 */
export function getAllCategories(): string[] {
  const manifest = getManifest();
  return manifest.categories.map((cat) => cat.slug);
}

/**
 * Get category info
 */
export function getCategory(slug: string) {
  const manifest = getManifest();
  return manifest.categories.find((cat) => cat.slug === slug);
}

/**
 * Get document count by category
 */
export function getDocumentCounts(): Record<string, number> {
  const manifest = getManifest();
  const counts: Record<string, number> = {};

  for (const doc of manifest.documents) {
    counts[doc.category] = (counts[doc.category] || 0) + 1;
  }

  return counts;
}

/**
 * Search documents
 */
export function searchDocuments(
  query: string,
  accessLevel: "player" | "dm"
): ContentDocument[] {
  const manifest = getManifest();
  const queryLower = query.toLowerCase();
  const results: ContentDocument[] = [];

  for (const docMeta of manifest.documents) {
    const doc = getDocument(docMeta.category, docMeta.slug);
    if (!doc) continue;

    // Check access level
    if (accessLevel === "player" && !doc.atAGlance && !doc.commonKnowledge) {
      continue;
    }

    // Search in title
    if (doc.title.toLowerCase().includes(queryLower)) {
      results.push(doc);
      continue;
    }

    // Search in content
    const searchableContent = [
      doc.atAGlance,
      doc.commonKnowledge,
      accessLevel === "dm" ? doc.secretKnowledge : "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchableContent.includes(queryLower)) {
      results.push(doc);
    }
  }

  return results;
}
