"use client";

import { useEncounterStore } from "@/lib/tracker/store";

export function ConcentrationCheckModal() {
  const {
    concentrationCheck,
    passConcentrationCheck,
    failConcentrationCheck,
  } = useEncounterStore();

  if (!concentrationCheck) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--study-panel)] rounded p-6 border border-[var(--gold)] max-w-md w-full mx-4">
        <h3 className="text-lg font-bold font-['Cinzel'] text-[var(--gold)] mb-2">
          Concentration Check
        </h3>
        <p className="text-[var(--parchment-dark)] mb-4">
          <strong>{concentrationCheck.combatantName}</strong> must make a
          Constitution saving throw (DC {concentrationCheck.dc}) to maintain
          concentration on <strong>{concentrationCheck.spell}</strong>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={passConcentrationCheck}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold transition-colors"
          >
            Passed
          </button>
          <button
            onClick={failConcentrationCheck}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-semibold transition-colors"
          >
            Failed
          </button>
        </div>
      </div>
    </div>
  );
}
