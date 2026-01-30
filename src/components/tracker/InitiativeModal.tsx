"use client";

import { useState } from "react";
import type { EnrichedCombatant } from "@/lib/tracker/types";

interface InitiativeModalProps {
  combatants: EnrichedCombatant[];
  onConfirm: (initiatives: Record<string, number>) => void;
  onCancel: () => void;
}

interface InitiativeEntry {
  value: string;
  rolled?: {
    d20: number;
    modifier: number;
    total: number;
  };
}

export function InitiativeModal({
  combatants,
  onConfirm,
  onCancel,
}: InitiativeModalProps) {
  const [initiatives, setInitiatives] = useState<Record<string, InitiativeEntry>>(() => {
    const init: Record<string, InitiativeEntry> = {};
    combatants.forEach((c) => {
      init[c.id] = { value: c.initiative_roll?.toString() || "" };
    });
    return init;
  });

  // Calculate dex modifier from dexterity score
  const getDexModifier = (combatant: EnrichedCombatant): number => {
    const dex = combatant.entity?.dexterity || 10;
    return Math.floor((dex - 10) / 2);
  };

  // Roll initiative for a single combatant
  const rollForCombatant = (combatant: EnrichedCombatant) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const modifier = getDexModifier(combatant);
    const total = d20 + modifier;

    setInitiatives((prev) => ({
      ...prev,
      [combatant.id]: {
        value: total.toString(),
        rolled: { d20, modifier, total },
      },
    }));
  };

  // Roll initiative for all combatants that don't have a value yet
  const rollAll = () => {
    const newInitiatives = { ...initiatives };
    combatants.forEach((combatant) => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const modifier = getDexModifier(combatant);
      const total = d20 + modifier;

      newInitiatives[combatant.id] = {
        value: total.toString(),
        rolled: { d20, modifier, total },
      };
    });
    setInitiatives(newInitiatives);
  };

  // Roll only for creatures (not players)
  const rollForCreatures = () => {
    const newInitiatives = { ...initiatives };
    combatants.forEach((combatant) => {
      // Skip players - they roll for themselves
      if (combatant.combatant_type === "player") return;

      const d20 = Math.floor(Math.random() * 20) + 1;
      const modifier = getDexModifier(combatant);
      const total = d20 + modifier;

      newInitiatives[combatant.id] = {
        value: total.toString(),
        rolled: { d20, modifier, total },
      };
    });
    setInitiatives(newInitiatives);
  };

  const handleSubmit = () => {
    const parsed: Record<string, number> = {};
    Object.entries(initiatives).forEach(([id, entry]) => {
      const num = parseInt(entry.value, 10);
      if (!isNaN(num)) {
        parsed[id] = num;
      }
    });
    onConfirm(parsed);
  };

  const handleValueChange = (id: string, value: string) => {
    setInitiatives((prev) => ({
      ...prev,
      [id]: { ...prev[id], value, rolled: undefined },
    }));
  };

  // Check if all combatants have initiative set
  const allSet = combatants.every((c) => {
    const val = initiatives[c.id]?.value;
    return val && !isNaN(parseInt(val, 10));
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-lg w-full mx-4">
        <h3 className="text-lg font-bold mb-2">Roll Initiative</h3>
        <p className="text-slate-400 text-sm mb-4">
          Roll for creatures or enter player rolls manually.
        </p>

        {/* Roll buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={rollForCreatures}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
          >
            🎲 Roll Creatures Only
          </button>
          <button
            onClick={rollAll}
            className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium transition-colors"
          >
            🎲 Roll All
          </button>
        </div>

        {/* Initiative list */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {combatants.map((combatant) => {
            const entry = initiatives[combatant.id];
            const isPlayer = combatant.combatant_type === "player";
            const modifier = getDexModifier(combatant);

            return (
              <div
                key={combatant.id}
                className={`flex items-center gap-3 p-2 rounded ${
                  isPlayer ? "bg-emerald-900/30" : "bg-slate-700/50"
                }`}
              >
                {/* Type indicator */}
                <span className="text-lg" title={isPlayer ? "Player" : "Creature"}>
                  {isPlayer ? "👤" : "👹"}
                </span>

                {/* Name and modifier */}
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">
                    {combatant.display_name || combatant.entity?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-slate-400">
                    DEX: {modifier >= 0 ? "+" : ""}{modifier}
                  </div>
                </div>

                {/* Roll breakdown (if rolled) */}
                {entry?.rolled && (
                  <div className="text-xs text-slate-400 text-right">
                    <span className="text-amber-400">{entry.rolled.d20}</span>
                    <span className="mx-1">+</span>
                    <span>{entry.rolled.modifier}</span>
                  </div>
                )}

                {/* Initiative input */}
                <input
                  type="number"
                  value={entry?.value || ""}
                  onChange={(e) => handleValueChange(combatant.id, e.target.value)}
                  className="w-16 px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-center text-lg font-bold"
                  placeholder="--"
                />

                {/* Individual roll button */}
                <button
                  onClick={() => rollForCombatant(combatant)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors"
                  title="Roll for this combatant"
                >
                  🎲
                </button>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={handleSubmit}
            disabled={!allSet}
            className={`flex-1 px-4 py-2 rounded font-semibold transition-colors ${
              allSet
                ? "bg-amber-600 hover:bg-amber-500"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            Start Combat
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
