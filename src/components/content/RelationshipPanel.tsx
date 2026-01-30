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
    color: "text-blue-400",
  },
  child: {
    icon: "🏛️",
    title: "Contains",
    color: "text-emerald-400",
  },
  npc: {
    icon: "👥",
    title: "Key NPCs",
    color: "text-purple-400",
  },
  faction: {
    icon: "⚔️",
    title: "Factions Present",
    color: "text-red-400",
  },
  event: {
    icon: "📜",
    title: "Historical Events",
    color: "text-amber-400",
  },
  location: {
    icon: "🗺️",
    title: "Locations",
    color: "text-cyan-400",
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
        <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-3">
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
                          className="inline-flex items-center px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 text-sm rounded transition-colors"
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
        <div className="bg-stone-900/30 border border-stone-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
            Linked from
          </h3>
          <div className="flex flex-wrap gap-2">
            {backlinks.map((link) => (
              <Link
                key={link.href}
                href={`${baseUrl}${link.href}`}
                className="inline-flex items-center px-2 py-0.5 bg-stone-800/50 hover:bg-stone-800 text-stone-400 hover:text-stone-300 text-sm rounded transition-colors"
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
