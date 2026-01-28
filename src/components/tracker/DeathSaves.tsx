"use client";

import { useEncounterStore } from "@/lib/tracker/store";

interface DeathSavesProps {
  combatantId: string;
  successes: number;
  failures: number;
}

export function DeathSaves({
  combatantId,
  successes,
  failures,
}: DeathSavesProps) {
  const { recordDeathSave } = useEncounterStore();

  return (
    <div className="p-3 bg-slate-700 rounded-lg">
      <h4 className="text-sm font-semibold text-red-400 mb-3">Death Saves</h4>
      <div className="flex items-center gap-4">
        {/* Successes */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-400">Success:</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={`s-${i}`}
                className={`w-4 h-4 rounded-full border-2 ${
                  i < successes
                    ? "bg-green-500 border-green-500"
                    : "border-green-500/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Failures */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-red-400">Fail:</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={`f-${i}`}
                className={`w-4 h-4 rounded-full border-2 ${
                  i < failures
                    ? "bg-red-500 border-red-500"
                    : "border-red-500/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => recordDeathSave(combatantId, true)}
          disabled={successes >= 3}
          className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => recordDeathSave(combatantId, false)}
          disabled={failures >= 3}
          className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
        >
          Fail
        </button>
        <button
          onClick={() => recordDeathSave(combatantId, true, true)}
          disabled={successes >= 3}
          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
          title="Natural 20 - Regain 1 HP"
        >
          Nat 20
        </button>
        <button
          onClick={() => recordDeathSave(combatantId, false, false, true)}
          disabled={failures >= 3}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
          title="Natural 1 - Two failures"
        >
          Nat 1
        </button>
      </div>
    </div>
  );
}
