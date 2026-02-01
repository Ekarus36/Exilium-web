"use client";

import { CONDITIONS, CONDITION_ICONS, type Condition } from "@/lib/tracker/types";
import { useEncounterStore } from "@/lib/tracker/store";

interface ConditionPickerProps {
  combatantId: string;
  currentConditions: string[];
  onClose: () => void;
}

export function ConditionPicker({
  combatantId,
  currentConditions,
  onClose,
}: ConditionPickerProps) {
  const { addCondition, removeCondition } = useEncounterStore();

  const toggleCondition = async (condition: string) => {
    if (currentConditions.includes(condition)) {
      await removeCondition(combatantId, condition);
    } else {
      await addCondition(combatantId, condition);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-[var(--study-panel)] rounded p-6 border border-[var(--gold-shadow)] max-w-md w-full mx-4">
        <h3 className="text-lg font-bold font-['Cinzel'] mb-4">Conditions</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {CONDITIONS.map((condition) => {
            const isActive = currentConditions.includes(condition);
            return (
              <button
                key={condition}
                onClick={() => toggleCondition(condition)}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--gold-dark)] text-[var(--parchment-light)]"
                    : "bg-[var(--study-wood)] hover:bg-[var(--study-wood)]"
                }`}
              >
                {CONDITION_ICONS[condition as Condition]} {condition}
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-[var(--study-wood)] hover:bg-[var(--study-wood)] rounded"
        >
          Close (Esc)
        </button>
      </div>
    </div>
  );
}
