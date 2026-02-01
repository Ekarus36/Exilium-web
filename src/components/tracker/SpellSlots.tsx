"use client";

import type { Player } from "@/lib/tracker/types";
import { useEncounterStore } from "@/lib/tracker/store";

interface SpellSlotsProps {
  combatantId: string;
  player: Player;
  slotsUsed: Record<string, number>;
}

export function SpellSlots({ combatantId, player, slotsUsed }: SpellSlotsProps) {
  const { useSpellSlot, restoreSpellSlot, resetSpellSlots } = useEncounterStore();

  const slots = player.spells?.slots || {};

  return (
    <div className="p-3 bg-[var(--study-wood)] rounded">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-[var(--gold)]">Spell Slots</h4>
        <button
          onClick={() => resetSpellSlots(combatantId)}
          className="text-xs px-2 py-1 bg-[var(--study-panel)] hover:bg-[var(--study-wood)] rounded transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(slots).map(([level, max]) => {
          const used = slotsUsed[level] || 0;
          const remaining = (max || 0) - used;

          return (
            <div key={level} className="flex items-center gap-2">
              <span className="text-sm text-[var(--parchment-aged)] w-8">L{level}:</span>
              <div className="flex gap-1">
                {Array.from({ length: max || 0 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border ${
                      i < remaining
                        ? "bg-[var(--gold)] border-[var(--gold)]"
                        : "border-[var(--gold-dark)]/50"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={() => useSpellSlot(combatantId, parseInt(level))}
                  disabled={remaining <= 0}
                  className="text-xs px-1.5 py-0.5 bg-[var(--vermillion-dark)] hover:bg-[var(--vermillion)] disabled:bg-[var(--study-panel)] disabled:text-[var(--parchment-aged)]/40 disabled:cursor-not-allowed rounded transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => restoreSpellSlot(combatantId, parseInt(level))}
                  disabled={used <= 0}
                  className="text-xs px-1.5 py-0.5 bg-[var(--gold-dark)] hover:bg-[var(--gold)] disabled:bg-[var(--study-panel)] disabled:text-[var(--parchment-aged)]/40 disabled:cursor-not-allowed rounded transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
