"use client";

import { useState } from "react";
import type { EnrichedCombatant } from "@/lib/tracker/types";

interface InitiativeModalProps {
  combatants: EnrichedCombatant[];
  onConfirm: (initiatives: Record<string, number>) => void;
  onCancel: () => void;
}

export function InitiativeModal({
  combatants,
  onConfirm,
  onCancel,
}: InitiativeModalProps) {
  const [initiatives, setInitiatives] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    combatants.forEach((c) => {
      init[c.id] = c.initiative_roll?.toString() || "";
    });
    return init;
  });

  const handleSubmit = () => {
    const parsed: Record<string, number> = {};
    Object.entries(initiatives).forEach(([id, value]) => {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        parsed[id] = num;
      }
    });
    onConfirm(parsed);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Set Initiative</h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {combatants.map((combatant) => (
            <div key={combatant.id} className="flex items-center gap-3">
              <span className="flex-1 truncate">
                {combatant.display_name || combatant.entity?.name || "Unknown"}
              </span>
              <input
                type="number"
                value={initiatives[combatant.id] || ""}
                onChange={(e) =>
                  setInitiatives((prev) => ({
                    ...prev,
                    [combatant.id]: e.target.value,
                  }))
                }
                className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-center"
                placeholder="Init"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded font-semibold transition-colors"
          >
            Set Initiative
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
