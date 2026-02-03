import Link from "next/link";
import { SearchWrapper } from "@/components/content/SearchWrapper";
import { EyeIcon, KeyIcon, MasksIcon, GlobeIcon, HexagonIcon, HourglassIcon, SwordsIcon, SunIcon, CrownIcon } from "@/components/ui/Icons";

export const metadata = {
  title: "DM Guide",
  description: "Complete DM reference for Exilium including secrets and plot hooks",
};

export default function DMHomePage() {
  return (
    <div className="animate-fade-in">
      <header className="mb-12">
        {/* Decorative header with warning aesthetic */}
        <div className="text-center mb-8">
          <div className="text-[var(--gold)] text-sm tracking-[0.5em] mb-4 opacity-60">
            ✦ ✦ ✦
          </div>
          <h1 className="font-['Cinzel',serif] text-4xl md:text-5xl font-medium tracking-wide text-[var(--gold)] mb-4">
            Keeper&apos;s Tome
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--vermillion-dark)] to-transparent" />
            <span className="text-[var(--vermillion)] text-sm">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-[var(--vermillion-dark)] to-transparent" />
          </div>
        </div>

        <p className="font-['IM_Fell_English',serif] text-xl text-[var(--parchment-aged)] italic text-center max-w-2xl mx-auto mb-8">
          Complete chronicles including secrets, plot hooks, and forbidden knowledge.
        </p>

        <SearchWrapper accessLevel="dm" />
      </header>

      <div className="prose max-w-none">
        <h2>Dungeon Master Content</h2>
        <p>
          This tome includes everything from the Player&apos;s Codex plus the hidden
          truths that shape this world:
        </p>

        <div className="grid md:grid-cols-3 gap-6 not-prose my-8">
          <SecretCard
            title="Secret Knowledge"
            description="Hidden truths, conspiracies, and information players don't know"
            icon={<EyeIcon size={28} />}
          />
          <SecretCard
            title="Plot Hooks"
            description="Adventure seeds and story connections"
            icon={<KeyIcon size={28} />}
          />
          <SecretCard
            title="NPC Motivations"
            description="True goals and hidden agendas"
            icon={<MasksIcon size={28} />}
          />
        </div>

        {/* Stats panel */}
        <div className="card-warning not-prose my-8">
          <h3 className="font-['Cinzel',serif] text-lg text-[var(--vermillion)] mb-4">
            Chronicle Statistics
          </h3>
          <ul className="space-y-2 text-[var(--parchment)]">
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✦</span>
              ~106,000 words across 107 pages
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✦</span>
              4 major regions: Veraheim, Elven Empire, Human Kingdom, Broken Isles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✦</span>
              73 detailed NPCs with backgrounds and motivations
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✦</span>
              Rich political intrigue and hidden conflicts
            </li>
          </ul>
        </div>

        {/* Oracle link */}
        <div className="not-prose my-8">
          <Link
            href="/dm/oracle"
            className="block bg-gradient-to-r from-[var(--study-panel)] via-[rgba(139,42,29,0.15)] to-[var(--study-panel)] border border-[var(--vermillion-dark)]/40 rounded p-6 group hover:border-[var(--vermillion)]/60 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="text-[var(--vermillion)] opacity-80 group-hover:opacity-100 transition-opacity">
                <EyeIcon size={28} />
              </div>
              <div>
                <h3 className="font-['Cinzel',serif] text-lg text-[var(--gold)] group-hover:text-[var(--gold-bright)] transition-colors">
                  The Oracle
                </h3>
                <p className="text-sm text-[var(--parchment-aged)]">
                  Ask questions about Exilium lore — the Oracle searches the full archives and answers with citations
                </p>
              </div>
            </div>
          </Link>
        </div>

        <h2>Browse the Archives</h2>
        <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
          <DMCategoryCard
            href="/dm/world"
            title="World"
            description="Core systems: religion, magic, distances"
            icon={<GlobeIcon size={22} />}
          />
          <DMCategoryCard
            href="/dm/geography"
            title="Geography"
            description="Locations by region with hidden details"
            icon={<HexagonIcon size={22} />}
          />
          <DMCategoryCard
            href="/dm/history"
            title="History"
            description="Timeline and the true causes behind events"
            icon={<HourglassIcon size={22} />}
          />
          <DMCategoryCard
            href="/dm/factions"
            title="Factions"
            description="Political powers, secret agendas, alliances"
            icon={<SwordsIcon size={22} />}
          />
          <DMCategoryCard
            href="/dm/peoples"
            title="Peoples"
            description="Cultures, races, and hidden truths"
            icon={<SunIcon size={22} />}
          />
          <DMCategoryCard
            href="/dm/npcs"
            title="NPCs"
            description="Characters with full motivations revealed"
            icon={<CrownIcon size={22} />}
          />
        </div>

        <p>
          Use the sidebar or cards above to explore. Content mirrors the Player
          Guide structure but includes all tiers of information — the complete
          truth behind each entry.
        </p>
      </div>
    </div>
  );
}

function SecretCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-[var(--study-panel)] to-[rgba(139,42,29,0.1)] border border-[var(--vermillion-dark)]/30 rounded p-6 group hover:border-[var(--vermillion)]/50 transition-all duration-300">
      <div className="text-center">
        <div className="mb-4 flex justify-center text-[var(--vermillion)] opacity-80 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
        <h3 className="font-['Cinzel',serif] text-lg text-[var(--gold)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--parchment-aged)] text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function DMCategoryCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-4 rounded
        bg-gradient-to-r from-[var(--study-panel)] to-[rgba(139,42,29,0.05)]
        border border-[var(--vermillion-dark)]/20
        transition-all duration-300 hover:border-[var(--vermillion-dark)]/50
        hover:shadow-[0_0_20px_rgba(139,42,29,0.08)] hover:-translate-y-0.5"
    >
      <div className="text-[var(--vermillion-dark)] group-hover:text-[var(--vermillion)] transition-colors duration-300 mt-0.5 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-['Cinzel',serif] text-base text-[var(--gold)] group-hover:text-[var(--gold-bright)] transition-colors duration-300 mb-0.5">
          {title}
        </h3>
        <p className="text-[var(--parchment-aged)] text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <span className="text-[var(--vermillion-dark)] opacity-0 group-hover:opacity-60 transition-all duration-300 group-hover:translate-x-0.5 mt-1 shrink-0">
        ›
      </span>
    </Link>
  );
}
