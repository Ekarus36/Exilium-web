import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Exilium
          </h1>
          <p className="text-xl text-stone-400">
            A world between two empires, where Veraheim stands as the last
            neutral sanctuary
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <SectionCard
            href="/player"
            title="Player Content"
            description="Explore the world of Exilium - geography, cultures, factions, and peoples. Everything a player needs to know."
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
          />

          <SectionCard
            href="/dm"
            title="DM Content"
            description="Full lore including secret knowledge, hidden factions, and mysteries. Contains spoilers!"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            }
            variant="warning"
          />

          <SectionCard
            href="/tools/tracker"
            title="DM Tools"
            description="Initiative tracker, campaign management, and encounter builder. Works offline, saves with login."
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            }
          />
        </div>

        <footer className="mt-16 text-center text-stone-500 text-sm">
          <p>
            Built for the Exilium campaign. Content updates weekly.
          </p>
        </footer>
      </div>
    </main>
  );
}

function SectionCard({
  href,
  title,
  description,
  icon,
  variant = "default",
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "warning";
}) {
  return (
    <Link
      href={href}
      className={`group block p-6 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
        variant === "warning"
          ? "border-amber-800/50 bg-amber-950/20 hover:border-amber-600 hover:bg-amber-950/40"
          : "border-stone-800 bg-stone-900/50 hover:border-stone-600 hover:bg-stone-900"
      }`}
    >
      <div
        className={`mb-4 ${
          variant === "warning"
            ? "text-amber-400 group-hover:text-amber-300"
            : "text-stone-400 group-hover:text-stone-200"
        }`}
      >
        {icon}
      </div>
      <h2 className="text-xl font-semibold mb-2 text-stone-100">{title}</h2>
      <p
        className={`text-sm ${
          variant === "warning" ? "text-amber-200/70" : "text-stone-400"
        }`}
      >
        {description}
      </p>
    </Link>
  );
}
