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
    title: `${categoryInfo.name} (DM)`,
    description: `Full ${categoryInfo.description.toLowerCase()} including secrets`,
  };
}

export default async function DMCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = getCategory(category);
  const documents = getDocumentsByCategory(category);

  if (!categoryInfo) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center text-sm text-stone-500 space-x-2 mb-4">
          <Link href="/" className="hover:text-stone-300">
            Home
          </Link>
          <span>/</span>
          <Link href="/dm" className="hover:text-amber-300 text-amber-400/70">
            DM
          </Link>
          <span>/</span>
          <span className="text-stone-300">{categoryInfo.name}</span>
        </nav>

        {/* DM Warning Banner */}
        <div className="mb-8 p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg">
          <p className="text-amber-200 text-sm">
            <strong>DM Content:</strong> This section includes secret knowledge.
          </p>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-stone-100">
            {categoryInfo.name}
          </h1>
          <p className="text-stone-400">{categoryInfo.description}</p>
        </header>

        {documents.length === 0 ? (
          <div className="p-6 bg-stone-900/50 border border-stone-800 rounded-lg text-center">
            <p className="text-stone-400">No content in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Link
                key={doc.slug}
                href={`/dm/${category}/${doc.slug}`}
                className="block p-4 bg-stone-900/50 border border-stone-800 rounded-lg hover:border-amber-800/50 hover:bg-stone-900 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-100 mb-1">
                      {doc.title}
                    </h2>
                    {doc.atAGlance && (
                      <p className="text-stone-400 text-sm line-clamp-2">
                        {doc.atAGlance.replace(/[#*_\[\]]/g, " ").slice(0, 150)}
                        ...
                      </p>
                    )}
                  </div>
                  {doc.secretKnowledge && (
                    <span className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded">
                      Has secrets
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
