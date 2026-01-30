import { notFound } from "next/navigation";
import { getDocument, getAllDocumentPaths } from "@/lib/content/loader";
import { ContentPage } from "@/components/content/ContentPage";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RelationshipPanel } from "@/components/content/RelationshipPanel";
import { getBreadcrumbs, playerNavigation } from "@/lib/content/navigation";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllDocumentPaths();
  return paths.map(({ category, slug }) => ({
    category,
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params;
  const document = getDocument(category, slug);

  if (!document) {
    return { title: "Not Found" };
  }

  return {
    title: document.title,
    description: document.atAGlance?.slice(0, 160) || `Learn about ${document.title}`,
  };
}

export default async function PlayerDocumentPage({ params }: PageProps) {
  const { category, slug } = await params;
  const document = getDocument(category, slug);

  if (!document) {
    notFound();
  }

  // Build breadcrumbs from navigation
  const href = `/player/${category}/${slug}`;
  const breadcrumbs = getBreadcrumbs(href, playerNavigation);

  // Check if document has player-visible content
  if (!document.atAGlance && !document.commonKnowledge) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-8 p-6 bg-stone-900/50 border border-stone-800 rounded-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-stone-200">
            {document.title}
          </h1>
          <p className="text-stone-400">
            This content is not available in the player section. It may contain
            secret information for DMs only.
          </p>
        </div>
      </div>
    );
  }

  // Extract relationships from metadata (placeholder - will be enhanced)
  const relationships = extractRelationships(document);

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <ContentPage document={document} accessLevel="player" />
      <RelationshipPanel
        relationships={relationships}
        backlinks={document.seeAlso.map((link) => ({
          label: link,
          href: `/${category}/${slugify(link)}`,
        }))}
        baseUrl="/player"
      />
    </div>
  );
}

// Helper to extract typed relationships from document metadata
function extractRelationships(document: ReturnType<typeof getDocument>) {
  if (!document) return [];

  const relationships: Array<{
    type: "location" | "npc" | "faction" | "event" | "parent" | "child";
    label: string;
    href: string;
  }> = [];

  // Extract from metadata if present
  const meta = document.metadata;

  if (meta.Region) {
    relationships.push({
      type: "parent",
      label: meta.Region,
      href: `/geography/${slugify(meta.Region)}`,
    });
  }

  if (meta.Location) {
    relationships.push({
      type: "parent",
      label: meta.Location,
      href: `/geography/${slugify(meta.Location)}`,
    });
  }

  if (meta.Faction) {
    relationships.push({
      type: "faction",
      label: meta.Faction,
      href: `/factions/${slugify(meta.Faction)}`,
    });
  }

  return relationships;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
