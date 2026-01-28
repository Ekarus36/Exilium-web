// Content tier types
export type ContentTier = "at-a-glance" | "common-knowledge" | "secret-knowledge";

// Content access levels
export type AccessLevel = "player" | "dm";

// Parsed content document
export interface ContentDocument {
  // Identification
  slug: string;
  category: string;
  title: string;

  // Metadata (from frontmatter table or YAML)
  metadata: Record<string, string>;

  // Optional quote at the start
  epigraph?: string;

  // Content tiers
  atAGlance: string;
  commonKnowledge: string;
  secretKnowledge: string;

  // Additional sections (Connections, See Also, etc.)
  connections?: string; // Mermaid diagram
  seeAlso: string[];
  plotHooks?: { hook: string; description: string }[];

  // Raw content for DM view
  rawContent: string;

  // Source file info
  sourcePath: string;
}

// Parsed WikiLink
export interface WikiLink {
  display: string;
  target: string;
  anchor?: string;
}

// Search index entry
export interface SearchIndexEntry {
  slug: string;
  category: string;
  title: string;
  content: string; // Combined searchable text
  tier: ContentTier;
}

// Category definition
export interface Category {
  slug: string;
  name: string;
  description: string;
  path: string; // Folder path in Obsidian vault
}

// Content manifest (generated at build time)
export interface ContentManifest {
  categories: Category[];
  documents: {
    slug: string;
    category: string;
    title: string;
    hasSections: {
      atAGlance: boolean;
      commonKnowledge: boolean;
      secretKnowledge: boolean;
    };
  }[];
  wikiLinks: Record<string, string>; // title -> slug mapping for resolving links
  generatedAt: string;
}
