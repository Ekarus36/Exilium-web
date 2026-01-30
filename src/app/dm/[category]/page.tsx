import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDocumentsByCategory,
  getAllCategories,
  getCategory,
} from "@/lib/content/loader";
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

  const breadcrumbs = [
    { label: "Home", href: "/dm" },
    { label: categoryInfo.name },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />

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
                  <span className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded flex-shrink-0 ml-4">
                    Has secrets
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
