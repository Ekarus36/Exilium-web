"use client";

import Link from "next/link";

export interface Relationship {
  type: "location" | "npc" | "faction" | "event" | "parent" | "child";
  label: string;
  href: string;
}

interface RelationshipPanelProps {
  relationships: Relationship[];
  backlinks?: { label: string; href: string }[];
  baseUrl: string; // "/player" or "/dm"
}

const relationshipConfig: Record<
  Relationship["type"],
  { icon: string; title: string; color: string }
> = {
  parent: {
    icon: "📍",
    title: "Part of",
    color: "text-[var(--azure)]",
  },
  child: {
    icon: "🏛️",
    title: "Contains",
    color: "text-[var(--viridian)]",
  },
  npc: {
    icon: "👥",
    title: "Key NPCs",
    color: "text-[var(--gold)]",
  },
  faction: {
    icon: "⚔️",
    title: "Factions Present",
    color: "text-[var(--vermillion)]",
  },
  event: {
    icon: "📜",
    title: "Historical Events",
    color: "text-[var(--gold-bright)]",
  },
  location: {
    icon: "🗺️",
    title: "Locations",
    color: "text-[var(--azure)]",
  },
};

export function RelationshipPanel({
  relationships,
  backlinks,
  baseUrl,
}: RelationshipPanelProps) {
  // Group relationships by type
  const grouped = relationships.reduce((acc, rel) => {
    if (!acc[rel.type]) acc[rel.type] = [];
    acc[rel.type].push(rel);
    return acc;
  }, {} as Record<string, Relationship[]>);

  const hasRelationships = relationships.length > 0;
  const hasBacklinks = backlinks && backlinks.length > 0;

  if (!hasRelationships && !hasBacklinks) return null;

  return (
    <div className="mt-8 space-y-4">
      {/* Typed Relationships */}
      {hasRelationships && (
        <div className="bg-[var(--study-panel)] border border-[var(--gold-shadow)] rounded p-4">
          <h3 className="text-sm font-['Cinzel'] font-medium text-[var(--gold)] uppercase tracking-wider mb-3">
            Connections
          </h3>
          <div className="space-y-3">
            {Object.entries(grouped).map(([type, items]) => {
              const config = relationshipConfig[type as Relationship["type"]];
              return (
                <div key={type} className="flex items-start gap-2">
                  <span className="text-lg" title={config.title}>
                    {config.icon}
                  </span>
                  <div className="flex-1">
                    <span className={`text-xs font-medium ${config.color}`}>
                      {config.title}:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {items.map((item) => (
                        <Link
                          key={item.href}
                          href={`${baseUrl}${item.href}`}
                          className="inline-flex items-center px-2 py-0.5 bg-[var(--study-wood)] hover:bg-[var(--gold-shadow)]/50 text-[var(--parchment-dark)] hover:text-[var(--parchment)] text-sm rounded transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Backlinks */}
      {hasBacklinks && (
        <div className="bg-[var(--study-dark)]/80 border border-[var(--gold-shadow)]/50 rounded p-4">
          <h3 className="text-sm font-['Cinzel'] font-medium text-[var(--ink-faded)] uppercase tracking-wider mb-2">
            Linked from
          </h3>
          <div className="flex flex-wrap gap-2">
            {backlinks.map((link) => (
              <Link
                key={link.href}
                href={`${baseUrl}${link.href}`}
                className="inline-flex items-center px-2 py-0.5 bg-[var(--study-wood)]/50 hover:bg-[var(--study-wood)] text-[var(--parchment-aged)] hover:text-[var(--parchment-dark)] text-sm rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
