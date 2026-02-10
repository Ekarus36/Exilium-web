import Link from "next/link";
import { LightningIcon, ClipboardIcon, MapPinIcon, SlidersIcon, EyeIcon } from "@/components/ui/Icons";

export const metadata = {
  title: "DM Tools",
  description: "Initiative tracker, campaign management, and encounter builder",
};

export default function ToolsPage() {
  return (
    <div className="animate-fade-in">
      <header className="mb-12">
        <div className="text-center mb-8">
          <div className="text-[var(--gold)] text-sm tracking-[0.5em] mb-4 opacity-60">
            ✦ ✦ ✦
          </div>
          <h1 className="font-['Cinzel',serif] text-4xl md:text-5xl font-semibold tracking-[0.08em] text-[var(--gold)] mb-4">
            Arcane Tools
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold-dark)] to-transparent" />
            <span className="text-[var(--gold)] text-sm opacity-60">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-[var(--gold-dark)] to-transparent" />
          </div>
        </div>

        <p className="font-['IM_Fell_English',serif] text-xl text-[var(--parchment-aged)] italic text-center max-w-2xl mx-auto">
          Instruments for the Keeper — track initiative, chronicle sessions, and forge encounters.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        <Link
          href="/dm/oracle"
          className="group block"
        >
          <div className="bg-[var(--study-panel)] border border-[var(--gold-shadow)]/50 rounded p-6 transition-all duration-300 group-hover:border-[var(--gold)]/70 group-hover:shadow-[0_0_30px_rgba(184,148,61,0.1)]">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-[var(--gold)] opacity-70 group-hover:opacity-100 transition-opacity">
                <EyeIcon size={28} />
              </div>
              <h2 className="font-['Cinzel',serif] text-xl text-[var(--gold)] group-hover:text-[var(--gold-bright)] transition-colors">
                The Oracle
              </h2>
            </div>
            <p className="font-['Crimson_Pro',serif] text-[var(--parchment-aged)] text-sm mb-4">
              Ask questions about the world of Exilium. The Oracle searches lore
              documents and answers with cited sources.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs border border-[var(--gold-shadow)]/30 text-[var(--gold-dark)] px-2 py-1 rounded">
                Lore search
              </span>
              <span className="text-xs border border-[var(--gold-shadow)]/30 text-[var(--gold-dark)] px-2 py-1 rounded">
                AI-powered
              </span>
              <span className="text-xs border border-[var(--gold-shadow)]/30 text-[var(--gold-dark)] px-2 py-1 rounded">
                Cited answers
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/tools/tracker"
          className="group block"
        >
          <div className="bg-[var(--study-panel)] border border-[var(--gold-shadow)]/50 rounded p-6 transition-all duration-300 group-hover:border-[var(--gold)]/70 group-hover:shadow-[0_0_30px_rgba(184,148,61,0.1)]">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-[var(--gold)] opacity-70 group-hover:opacity-100 transition-opacity">
                <LightningIcon size={28} />
              </div>
              <h2 className="font-['Cinzel',serif] text-xl text-[var(--gold)] group-hover:text-[var(--gold-bright)] transition-colors">
                Initiative Tracker
              </h2>
            </div>
            <p className="font-['Crimson_Pro',serif] text-[var(--parchment-aged)] text-sm mb-4">
              Track combat initiative, HP, conditions, and more. Supports
              multi-user campaigns with persistent data.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs border border-[var(--gold-shadow)]/30 text-[var(--gold-dark)] px-2 py-1 rounded">
                Combat tracking
              </span>
              <span className="text-xs border border-[var(--gold-shadow)]/30 text-[var(--gold-dark)] px-2 py-1 rounded">
                Conditions
              </span>
              <span className="text-xs border border-[var(--gold-shadow)]/30 text-[var(--gold-dark)] px-2 py-1 rounded">
                SRD monsters
              </span>
            </div>
          </div>
        </Link>

        <ToolCardComingSoon
          title="Session Notes"
          description="Track session summaries, player decisions, and campaign events."
          icon={<ClipboardIcon size={28} />}
        />

        <ToolCardComingSoon
          title="Encounter Builder"
          description="Build balanced encounters with CR calculations and terrain options."
          icon={<MapPinIcon size={28} />}
        />

        <ToolCardComingSoon
          title="Random Tables"
          description="Roll on custom random tables for loot, encounters, and events."
          icon={<SlidersIcon size={28} />}
        />
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <div className="card-dark">
          <p className="font-['Crimson_Pro',serif] text-[var(--parchment-aged)] text-sm">
            <span className="text-[var(--gold)]">✦</span>{" "}
            Tools require sign-in to save data. Your campaigns and creatures are
            stored securely and only accessible to you.
          </p>
        </div>
      </div>
    </div>
  );
}

function ToolCardComingSoon({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--study-panel)] border border-[var(--gold-shadow)]/30 rounded p-6 opacity-50">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-[var(--gold-dark)]">
          {icon}
        </div>
        <h2 className="font-['Cinzel',serif] text-xl text-[var(--gold-dark)]">
          {title}
        </h2>
      </div>
      <p className="font-['Crimson_Pro',serif] text-[var(--parchment-aged)] text-sm mb-4">
        {description}
      </p>
      <span className="text-xs border border-[var(--gold-shadow)]/20 text-[var(--gold-dark)] px-2 py-1 rounded">
        Coming soon
      </span>
    </div>
  );
}
