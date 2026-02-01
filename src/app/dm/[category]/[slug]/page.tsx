import { notFound } from "next/navigation";
import { getDocument, getAllDocumentPaths } from "@/lib/content/loader";
import { ContentPage } from "@/components/content/ContentPage";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RelationshipPanel } from "@/components/content/RelationshipPanel";
import { getBreadcrumbs, dmNavigation } from "@/lib/content/navigation";

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
    title: `${document.title} (DM)`,
    description: `Full content including secrets for ${document.title}`,
  };
}

export default async function DMDocumentPage({ params }: PageProps) {
  const { category, slug } = await params;
  const document = getDocument(category, slug);

  if (!document) {
    notFound();
  }

  // Build breadcrumbs from navigation
  const href = `/dm/${category}/${slug}`;
  const breadcrumbs = getBreadcrumbs(href, dmNavigation);

  // Extract relationships from metadata
  const relationships = extractRelationships(document);

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />

      {/* DM indicator */}
      {document.secretKnowledge && (
        <div className="mb-4 px-3 py-1.5 bg-[var(--vermillion-dark)]/20 border border-[var(--vermillion-dark)] rounded inline-block">
          <span className="text-[var(--vermillion)] text-sm font-['Cinzel'] font-medium">
            Contains secret knowledge
          </span>
        </div>
      )}

      <ContentPage document={document} accessLevel="dm" />

      <RelationshipPanel
        relationships={relationships}
        backlinks={document.seeAlso.map((link) => ({
          label: link,
          href: `/${category}/${slugify(link)}`,
        }))}
        baseUrl="/dm"
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
