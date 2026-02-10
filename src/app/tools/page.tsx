import Link from "next/link";
import { LightningIcon, ClipboardIcon, MapPinIcon, SlidersIcon, EyeIcon } from "@/components/ui/Icons";
import { tools, type ToolDefinition } from "@/tools/registry";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  EyeIcon,
  LightningIcon,
  ClipboardIcon,
  MapPinIcon,
  SlidersIcon,
};

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
        {tools.map((tool) =>
          tool.status === "active" ? (
            <ToolCardActive key={tool.id} tool={tool} />
          ) : (
            <ToolCardComingSoon key={tool.id} tool={tool} />
          )
        )}
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

function ToolCardActive({ tool }: { tool: ToolDefinition }) {
  const Icon = iconMap[tool.icon];
  return (
    <Link
      href={tool.route}
      className="group block"
    >
      <div className="bg-[var(--study-panel)] border border-[var(--gold-shadow)]/50 rounded p-6 transition-all duration-300 group-hover:border-[var(--gold)]/70 group-hover:shadow-[0_0_30px_rgba(184,148,61,0.1)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-[var(--gold)] opacity-70 group-hover:opacity-100 transition-opacity">
            {Icon && <Icon size={28} />}
          </div>
          <h2 className="font-['Cinzel',serif] text-xl text-[var(--gold)] group-hover:text-[var(--gold-bright)] transition-colors">
            {tool.name}
          </h2>
        </div>
        <p className="font-['Crimson_Pro',serif] text-[var(--parchment-aged)] text-sm mb-4">
          {tool.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tool.tags.map((tag) => (
            <span key={tag} className="text-xs border border-[var(--gold-shadow)]/30 text-[var(--gold-dark)] px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function ToolCardComingSoon({ tool }: { tool: ToolDefinition }) {
  const Icon = iconMap[tool.icon];
  return (
    <div className="bg-[var(--study-panel)] border border-[var(--gold-shadow)]/30 rounded p-6 opacity-50">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-[var(--gold-dark)]">
          {Icon && <Icon size={28} />}
        </div>
        <h2 className="font-['Cinzel',serif] text-xl text-[var(--gold-dark)]">
          {tool.name}
        </h2>
      </div>
      <p className="font-['Crimson_Pro',serif] text-[var(--parchment-aged)] text-sm mb-4">
        {tool.description}
      </p>
      <span className="text-xs border border-[var(--gold-shadow)]/20 text-[var(--gold-dark)] px-2 py-1 rounded">
        Coming soon
      </span>
    </div>
  );
}
