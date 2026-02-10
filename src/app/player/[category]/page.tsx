import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDocumentsByCategory,
  getAllCategories,
  getCategory,
} from "@/tools/wiki/lib/loader";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = getCategory(category);

  if (!categoryInfo) {
    return { title: "Not Found" };
  }

  return {
    title: categoryInfo.name,
    description: categoryInfo.description,
  };
}

export default async function PlayerCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = getCategory(category);
  const documents = getDocumentsByCategory(category);

  if (!categoryInfo) {
    notFound();
  }

  // Filter to only documents with player-visible content
  const playerDocs = documents.filter(
    (doc) => doc.atAGlance || doc.commonKnowledge
  );

  const breadcrumbs = [
    { label: "Home", href: "/player" },
    { label: categoryInfo.name },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />

      <header className="mb-8">
        <h1 className="text-3xl font-['Cinzel'] font-medium mb-2 text-[var(--gold)]">
          {categoryInfo.name}
        </h1>
        <p className="text-[var(--parchment-aged)]">{categoryInfo.description}</p>
      </header>

      {playerDocs.length === 0 ? (
        <div className="p-6 bg-[var(--study-panel)] border border-[var(--gold-shadow)] rounded text-center">
          <p className="text-[var(--ink-faded)] font-['IM_Fell_English'] italic">
            No chronicles have been recorded in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {playerDocs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/player/${category}/${doc.slug}`}
              className="block p-4 bg-[var(--study-panel)] border border-[var(--gold-shadow)] rounded hover:border-[var(--gold-dark)] hover:bg-[var(--study-wood)] transition-all"
            >
              <h2 className="text-lg font-['Cinzel'] font-medium text-[var(--parchment)] mb-1">
                {doc.title}
              </h2>
              {doc.atAGlance && (
                <p className="text-[var(--parchment-aged)] text-sm line-clamp-2">
                  {doc.atAGlance.replace(/[#*_\[\]]/g, " ").slice(0, 150)}...
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
