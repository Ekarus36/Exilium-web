import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocumentsByCategory, getAllCategories, getCategory } from "@/lib/content/loader";

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

export default async function CategoryPage({ params }: PageProps) {
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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center text-sm text-stone-500 space-x-2 mb-8">
          <Link href="/" className="hover:text-stone-300">
            Home
          </Link>
          <span>/</span>
          <Link href="/player" className="hover:text-stone-300">
            Player
          </Link>
          <span>/</span>
          <span className="text-stone-300">{categoryInfo.name}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-stone-100">
            {categoryInfo.name}
          </h1>
          <p className="text-stone-400">{categoryInfo.description}</p>
        </header>

        {playerDocs.length === 0 ? (
          <div className="p-6 bg-stone-900/50 border border-stone-800 rounded-lg text-center">
            <p className="text-stone-400">
              No player-visible content in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {playerDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/player/${category}/${doc.slug}`}
                className="block p-4 bg-stone-900/50 border border-stone-800 rounded-lg hover:border-stone-600 hover:bg-stone-900 transition-all"
              >
                <h2 className="text-lg font-semibold text-stone-100 mb-1">
                  {doc.title}
                </h2>
                {doc.atAGlance && (
                  <p className="text-stone-400 text-sm line-clamp-2">
                    {doc.atAGlance.replace(/[#*_\[\]]/g, " ").slice(0, 150)}...
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
