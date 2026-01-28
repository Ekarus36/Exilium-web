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
    title: document.title,
    description: document.atAGlance?.slice(0, 160) || `Learn about ${document.title}`,
  };
}

export default async function PlayerContentPage({ params }: PageProps) {
  const { category, slug } = await params;
  const document = getDocument(category, slug);
  const categoryInfo = getCategory(category);

  if (!document) {
    notFound();
  }

  // Check if document has player-visible content
  if (!document.atAGlance && !document.commonKnowledge) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb category={category} categoryName={categoryInfo?.name} title={document.title} />
          <div className="mt-8 p-6 bg-stone-900/50 border border-stone-800 rounded-lg text-center">
            <h1 className="text-2xl font-bold mb-4 text-stone-200">{document.title}</h1>
            <p className="text-stone-400">
              This content is not available in the player section.
              It may contain secret information for DMs only.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb category={category} categoryName={categoryInfo?.name} title={document.title} />
        <div className="mt-8">
          <ContentPage document={document} accessLevel="player" />
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
      <Link href="/player" className="hover:text-stone-300">
        Player
      </Link>
      <span>/</span>
      <Link href={`/player/${category}`} className="hover:text-stone-300">
        {categoryName || category}
      </Link>
      <span>/</span>
      <span className="text-stone-300">{title}</span>
    </nav>
  );
}
