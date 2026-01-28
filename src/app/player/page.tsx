import Link from "next/link";
import { getManifest, getDocumentCounts } from "@/lib/content/loader";
import { SearchWrapper } from "@/components/content/SearchWrapper";

export const metadata = {
  title: "Player Content",
  description:
    "Explore the world of Exilium - geography, cultures, factions, and peoples",
};

export default function PlayerContentPage() {
  const manifest = getManifest();
  const counts = getDocumentCounts();

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
          <h1 className="text-4xl font-bold mb-4 text-stone-100">
            Player Content
          </h1>
          <p className="text-lg text-stone-400 mb-6">
            Everything you need to know about the world of Exilium. This content
            represents what your character would know or could learn.
          </p>
          <SearchWrapper accessLevel="player" />
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {manifest.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/player/${category.slug}`}
              className="block p-6 bg-stone-900/50 border border-stone-800 rounded-xl hover:border-stone-600 hover:bg-stone-900 transition-all"
            >
              <h2 className="text-xl font-semibold mb-2 text-stone-100">
                {category.name}
              </h2>
              <p className="text-stone-400 text-sm mb-3">
                {category.description}
              </p>
              <span className="text-stone-500 text-sm">
                {counts[category.slug] || 0} articles
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-stone-900/30 border border-stone-800 rounded-xl">
          <h2 className="text-lg font-semibold mb-2 text-stone-200">
            Content Tiers
          </h2>
          <p className="text-stone-400 text-sm">
            Player content shows <strong>At a Glance</strong> (common knowledge)
            and <strong>Common Knowledge</strong> (what educated characters
            know). Secret information is only available in the DM section.
          </p>
        </div>
      </div>
    </main>
  );
}
