"use client";

import type { Creature } from "@/tools/tracker/lib/types";
import { useEncounterStore } from "@/tools/tracker/lib/store";

interface LegendaryActionsProps {
  combatantId: string;
  creature: Creature;
  used: number;
}

export function LegendaryActions({
  combatantId,
  creature,
  used,
}: LegendaryActionsProps) {
  const { useLegendaryAction } = useEncounterStore();
  const remaining = creature.legendary_action_count - used;

  return (
    <div className="p-3 bg-[var(--study-wood)] rounded">
      <h4 className="text-sm font-semibold text-[var(--gold)] mb-3">
        Legendary Actions ({remaining}/{creature.legendary_action_count})
      </h4>

      <div className="flex gap-1 mb-3">
        {Array.from({ length: creature.legendary_action_count }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              i < remaining
                ? "bg-[var(--gold)] border-[var(--gold)]"
                : "border-[var(--gold-dark)]/50"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => useLegendaryAction(combatantId, 1)}
          disabled={remaining < 1}
          className="px-3 py-1 bg-[var(--gold-dark)] hover:bg-[var(--gold)] disabled:bg-[var(--study-panel)] disabled:text-[var(--parchment-aged)]/40 disabled:cursor-not-allowed rounded text-sm transition-colors"
        >
          Use 1
        </button>
        <button
          onClick={() => useLegendaryAction(combatantId, 2)}
          disabled={remaining < 2}
          className="px-3 py-1 bg-[var(--gold-dark)] hover:bg-[var(--gold)] disabled:bg-[var(--study-panel)] disabled:text-[var(--parchment-aged)]/40 disabled:cursor-not-allowed rounded text-sm transition-colors"
        >
          Use 2
        </button>
        <button
          onClick={() => useLegendaryAction(combatantId, 3)}
          disabled={remaining < 3}
          className="px-3 py-1 bg-[var(--gold-dark)] hover:bg-[var(--gold)] disabled:bg-[var(--study-panel)] disabled:text-[var(--parchment-aged)]/40 disabled:cursor-not-allowed rounded text-sm transition-colors"
        >
          Use 3
        </button>
      </div>
    </div>
  );
}
