import Link from "next/link";
import { BookHeroIcon, EyeHeroIcon, ScrollHeroIcon, ArrowRightIcon, CornerOrnamentIcon } from "@/components/ui/Icons";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Compass rose watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-[40rem] select-none">
          ✦
        </div>
        {/* Corner decorations */}
        <CornerOrnamentIcon size={96} className="absolute top-8 left-8 text-[var(--gold-dark)] opacity-30" />
        <CornerOrnamentIcon size={96} className="absolute top-8 right-8 text-[var(--gold-dark)] opacity-30 scale-x-[-1]" />
        <CornerOrnamentIcon size={96} className="absolute bottom-8 left-8 text-[var(--gold-dark)] opacity-30 scale-y-[-1]" />
        <CornerOrnamentIcon size={96} className="absolute bottom-8 right-8 text-[var(--gold-dark)] opacity-30 scale-[-1]" />
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header with illuminated manuscript styling */}
        <header className="text-center mb-20 animate-fade-in">
          {/* Decorative flourish above title */}
          <div className="mb-6 text-[var(--gold)] text-2xl tracking-[1em] opacity-60">
            ✦ ✦ ✦
          </div>

          <h1 className="font-['Cinzel',serif] text-7xl md:text-8xl font-semibold tracking-[0.08em] mb-6 text-[var(--gold)] hover:text-[var(--gold-bright)] transition-colors duration-300">
            EXILIUM
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
            <span className="text-[var(--gold)] text-lg opacity-60">✦</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent via-[var(--gold)] to-transparent" />
          </div>

          <p className="font-['IM_Fell_English',serif] text-xl md:text-2xl text-[var(--parchment-aged)] italic max-w-2xl mx-auto leading-relaxed">
            A world between two empires, where Veraheim stands as the last neutral sanctuary
          </p>
        </header>

        {/* Navigation cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <NavigationCard
            href="/player"
            title="Player's Codex"
            subtitle="Common Knowledge"
            description="Explore the world of Exilium — geography, cultures, factions, and peoples. Everything a traveler would know."
            icon={<BookHeroIcon />}
            delay={1}
          />

          <NavigationCard
            href="/dm"
            title="Keeper's Tome"
            subtitle="Forbidden Lore"
            description="Full chronicles including secret knowledge, hidden factions, and mysteries. Contains revelations!"
            icon={<EyeHeroIcon />}
            variant="forbidden"
            delay={2}
          />

          <NavigationCard
            href="/tools/tracker"
            title="Arcane Tools"
            subtitle="Dungeon Master"
            description="Initiative tracker, campaign chronicles, and encounter builder. Works offline, persists with login."
            icon={<ScrollHeroIcon />}
            delay={3}
          />
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center animate-fade-in-delay-3">
          <div className="divider-ornate" />
          <p className="font-['IM_Fell_English',serif] text-[var(--gold-shadow)] text-sm italic mt-6">
            Chronicled for the Exilium campaign · Updated weekly
          </p>
        </footer>
      </div>
    </main>
  );
}

function NavigationCard({
  href,
  title,
  subtitle,
  description,
  icon,
  variant = "default",
  delay = 0,
}: {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "forbidden";
  delay?: number;
}) {
  const isForbidden = variant === "forbidden";

  return (
    <Link
      href={href}
      className={`
        group block relative
        animate-fade-in-delay-${delay}
        transition-all duration-500 ease-out
        hover:-translate-y-2
      `}
    >
      {/* Card container */}
      <div className={`
        relative p-8 rounded
        ${isForbidden
          ? 'bg-gradient-to-b from-[var(--study-panel)] to-[rgba(139,42,29,0.15)] border border-[var(--vermillion-dark)]/50'
          : 'bg-[var(--study-panel)] border border-[var(--gold-shadow)]/50'
        }
        transition-all duration-500
        group-hover:border-[var(--gold)]/70
        group-hover:shadow-[0_0_40px_rgba(184,148,61,0.15)]
      `}>
        {/* Top decorative line */}
        <div className={`
          absolute top-0 left-4 right-4 h-px
          bg-gradient-to-r from-transparent ${isForbidden ? 'via-[var(--vermillion)]' : 'via-[var(--gold)]'} to-transparent
          opacity-50 group-hover:opacity-100 transition-opacity duration-500
        `} />

        {/* Icon */}
        <div className={`
          mb-6 ${isForbidden ? 'text-[var(--vermillion)]' : 'text-[var(--gold)]'}
          opacity-70 group-hover:opacity-100
          transition-all duration-500
          group-hover:scale-110
        `}>
          {icon}
        </div>

        {/* Subtitle */}
        <p className={`
          font-['Cinzel',serif] text-xs tracking-[0.3em] uppercase mb-2
          ${isForbidden ? 'text-[var(--vermillion)]/70' : 'text-[var(--gold-dark)]'}
        `}>
          {subtitle}
        </p>

        {/* Title */}
        <h2 className={`
          font-['Cinzel',serif] text-2xl font-medium tracking-wide mb-4
          ${isForbidden ? 'text-[var(--parchment)]' : 'text-[var(--gold)]'}
          group-hover:text-[var(--gold-bright)]
          transition-colors duration-300
        `}>
          {title}
        </h2>

        {/* Description */}
        <p className="font-['Crimson_Pro',serif] text-[var(--parchment-aged)] leading-relaxed text-base">
          {description}
        </p>

        {/* Bottom decorative element */}
        <div className="mt-6 flex items-center gap-2 text-[var(--gold-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="font-['Cinzel',serif] text-xs tracking-widest uppercase">Enter</span>
          <ArrowRightIcon size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[var(--gold-dark)]/30 group-hover:border-[var(--gold)]/50 transition-colors" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[var(--gold-dark)]/30 group-hover:border-[var(--gold)]/50 transition-colors" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[var(--gold-dark)]/30 group-hover:border-[var(--gold)]/50 transition-colors" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[var(--gold-dark)]/30 group-hover:border-[var(--gold)]/50 transition-colors" />
      </div>
    </Link>
  );
}

