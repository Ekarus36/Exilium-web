"use client";

interface TurnControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onRollInitiative: () => void;
  onRestart: () => void;
  isActive: boolean;
}

export function TurnControls({
  onPrev,
  onNext,
  onRollInitiative,
  onRestart,
  isActive,
}: TurnControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {!isActive ? (
        <button
          onClick={onRollInitiative}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded font-semibold transition-colors"
        >
          Roll Initiative
        </button>
      ) : (
        <>
          <button
            onClick={onPrev}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            title="Previous Turn (Shift+Space)"
          >
            &larr;
          </button>
          <button
            onClick={onNext}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-500 rounded transition-colors"
            title="Next Turn (Space)"
          >
            &rarr;
          </button>
        </>
      )}
      <button
        onClick={onRestart}
        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
        title="Restart Encounter"
      >
        Reset
      </button>
    </div>
  );
}
