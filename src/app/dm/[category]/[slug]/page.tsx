import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocument, getAllDocumentPaths, getCategory } from "@/lib/content/loader";
import { ContentPage } from "@/components/content/ContentPage";

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

export default async function DMContentPage({ params }: PageProps) {
  const { category, slug } = await params;
  const document = getDocument(category, slug);
  const categoryInfo = getCategory(category);

  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb category={category} categoryName={categoryInfo?.name} title={document.title} />

        {/* DM Warning Banner */}
        <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg">
          <p className="text-amber-200 text-sm">
            <strong>DM Content:</strong> This page includes secret knowledge not
            visible to players.
          </p>
        </div>

        <div className="mt-8">
          <ContentPage document={document} accessLevel="dm" />
        </div>
      </div>
    </main>
  );
}

function Breadcrumb({
  category,
  categoryName,
  title,
}: {
  category: string;
  categoryName?: string;
  title: string;
}) {
  return (
    <nav className="flex items-center text-sm text-stone-500 space-x-2">
      <Link href="/" className="hover:text-stone-300">
        Home
      </Link>
      <span>/</span>
      <Link href="/dm" className="hover:text-amber-300 text-amber-400/70">
        DM
      </Link>
      <span>/</span>
      <Link href={`/dm/${category}`} className="hover:text-stone-300">
        {categoryName || category}
      </Link>
      <span>/</span>
      <span className="text-stone-300">{title}</span>
    </nav>
  );
}
