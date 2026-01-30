import { SearchWrapper } from "@/components/content/SearchWrapper";
import { GlobeIcon, HexagonIcon, HourglassIcon, SwordsIcon, SunIcon, CrownIcon } from "@/components/ui/Icons";

export const metadata = {
  title: "Player Guide",
  description:
    "Explore the world of Exilium - geography, cultures, factions, and peoples",
};

export default function PlayerHomePage() {
  return (
    <div className="animate-fade-in">
      <header className="mb-12">
        {/* Decorative header */}
        <div className="text-center mb-8">
          <div className="text-[var(--gold-dark)] text-sm tracking-[0.5em] mb-4 opacity-60">
            ✦ ✦ ✦
          </div>
          <h1 className="font-['Cinzel',serif] text-4xl md:text-5xl font-medium tracking-wide text-[var(--gold)] mb-4">
            Welcome to Exilium
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold-dark)] to-transparent" />
            <span className="text-[var(--gold)] text-sm">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-[var(--gold-dark)] to-transparent" />
          </div>
        </div>

        <p className="font-['IM_Fell_English',serif] text-xl text-[var(--parchment-aged)] italic text-center max-w-2xl mx-auto mb-8">
          In Exilium, they built Veraheim — a city that proves another way is possible.
        </p>

        <SearchWrapper accessLevel="player" />
      </header>

      <div className="prose max-w-none">
        <h2>Quick Start</h2>
        <p className="drop-cap">
          Use the sidebar to navigate through the world of Exilium. Content is
          organized into sections that will help you understand this realm:
        </p>

        <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
          <CategoryCard
            title="World"
            description="Core systems: religion, magic, distances"
            icon={<GlobeIcon size={24} />}
          />
          <CategoryCard
            title="Geography"
            description="Locations by region: Veraheim, Elven Empire, Broken Isles"
            icon={<HexagonIcon size={24} />}
          />
          <CategoryCard
            title="History"
            description="Timeline and major events"
            icon={<HourglassIcon size={24} />}
          />
          <CategoryCard
            title="Factions"
            description="Political powers and organizations"
            icon={<SwordsIcon size={24} />}
          />
          <CategoryCard
            title="Peoples"
            description="Cultures and races"
            icon={<SunIcon size={24} />}
          />
          <CategoryCard
            title="NPCs"
            description="Notable characters by faction"
            icon={<CrownIcon size={24} />}
          />
        </div>

        <h2>Content Visibility</h2>
        <p>
          As a player, you see <strong>At a Glance</strong> (common knowledge)
          and <strong>Common Knowledge</strong> (what educated characters know).
          Secret information is only available in the{" "}
          <a href="/dm" className="text-[var(--gold)] hover:text-[var(--gold-bright)]">
            Keeper&apos;s Tome
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function CategoryCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="study-panel group hover:border-[var(--gold)]/50 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="text-[var(--gold)] opacity-70 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
        <div>
          <h3 className="font-['Cinzel',serif] text-lg text-[var(--gold)] mb-1">
            {title}
          </h3>
          <p className="text-[var(--parchment-aged)] text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
