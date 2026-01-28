import Link from "next/link";
import { getManifest, getDocumentCounts } from "@/lib/content/loader";
import { SearchWrapper } from "@/components/content/SearchWrapper";

export const metadata = {
  title: "DM Content",
  description: "Full lore including secret knowledge - contains spoilers!",
};

export default function DMContentPage() {
  const manifest = getManifest();
  const counts = getDocumentCounts();

  // Count documents with secrets
  const secretCounts: Record<string, number> = {};
  for (const doc of manifest.documents) {
    if (doc.hasSections.secretKnowledge) {
      secretCounts[doc.category] = (secretCounts[doc.category] || 0) + 1;
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link
            href="/"
            className="text-stone-500 hover:text-stone-300 text-sm mb-4 inline-block"
          >
            &larr; Back to home
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-stone-100">DM Content</h1>
          <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-4 mb-4">
            <p className="text-amber-200 text-sm">
              <strong>Warning:</strong> This section contains secret knowledge,
              plot spoilers, and behind-the-scenes information. Players should
              not read this content.
            </p>
          </div>
          <p className="text-lg text-stone-400 mb-6">
            Complete worldbuilding reference including all three content tiers:
            At a Glance, Common Knowledge, and Secret Knowledge.
          </p>
          <SearchWrapper accessLevel="dm" />
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {manifest.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/dm/${category.slug}`}
              className="block p-6 bg-stone-900/50 border border-stone-800 rounded-xl hover:border-amber-800/50 hover:bg-stone-900 transition-all"
            >
              <h2 className="text-xl font-semibold mb-2 text-stone-100">
                {category.name}
              </h2>
              <p className="text-stone-400 text-sm mb-3">
                {category.description}
              </p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-stone-500">
                  {counts[category.slug] || 0} articles
                </span>
                {secretCounts[category.slug] && (
                  <span className="text-amber-400">
                    {secretCounts[category.slug]} with secrets
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-amber-950/20 border border-amber-800/30 rounded-xl">
          <h2 className="text-lg font-semibold mb-2 text-amber-200">
            Content Tiers Explained
          </h2>
          <ul className="text-stone-400 text-sm space-y-2">
            <li>
              <strong className="text-stone-200">At a Glance:</strong> Common
              knowledge anyone would know
            </li>
            <li>
              <strong className="text-stone-200">Common Knowledge:</strong> What
              educated or well-traveled characters know
            </li>
            <li>
              <strong className="text-amber-300">Secret Knowledge:</strong>{" "}
              Hidden truths, plot hooks, and DM-only information
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
