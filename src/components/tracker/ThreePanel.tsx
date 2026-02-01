"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useEncounterStore } from "@/lib/tracker/store";
import { CombatantCard } from "./CombatantCard";
import { ActiveTurnCard } from "./ActiveTurnCard";
import { TurnControls } from "./TurnControls";
import { ConditionPicker } from "./ConditionPicker";
import { InitiativeModal } from "./InitiativeModal";
import { ConcentrationCheckModal } from "./ConcentrationCheckModal";

interface ThreePanelProps {
  encounterId: string;
}

type MobileTab = "players" | "active" | "creatures";

export function ThreePanel({ encounterId }: ThreePanelProps) {
  const {
    encounter,
    enrichedCombatants,
    selectedCombatantId,
    damageMode,
    healMode,
    pendingAmount,
    isLoading,
    error,
    loadEntities,
    loadEncounter,
    rollInitiative,
    nextTurn,
    prevTurn,
    selectCombatant,
    setDamageMode,
    setHealMode,
    setPendingAmount,
    confirmPendingAmount,
    setInitiative,
    restartEncounter,
    undo,
    redo,
  } = useEncounterStore();

  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showInitiativeModal, setShowInitiativeModal] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("active");

  // Track previous turn index for auto-focus on turn change
  const prevTurnIndex = useRef<number | null>(null);

  // Load data on mount
  useEffect(() => {
    loadEntities().then(() => loadEncounter(encounterId));
  }, [encounterId, loadEntities, loadEncounter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ": // Space - next turn
          e.preventDefault();
          if (e.shiftKey) {
            prevTurn();
          } else {
            nextTurn();
          }
          break;
        case "d":
        case "D":
          if (selectedCombatantId) {
            setDamageMode(true);
          }
          break;
        case "h":
        case "H":
          if (selectedCombatantId) {
            setHealMode(true);
          }
          break;
        case "c":
        case "C":
          if (selectedCombatantId) {
            setShowConditionPicker(true);
          }
          break;
        case "r":
        case "R":
          rollInitiative();
          break;
        case "z":
        case "Z":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          }
          break;
        case "Escape":
          setDamageMode(false);
          setHealMode(false);
          setShowConditionPicker(false);
          setPendingAmount("");
          break;
        case "Enter":
          if (damageMode || healMode) {
            confirmPendingAmount();
          }
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          if (!damageMode && !healMode) {
            const index = parseInt(e.key) - 1;
            if (index < enrichedCombatants.length) {
              selectCombatant(enrichedCombatants[index].id);
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedCombatantId,
    damageMode,
    healMode,
    enrichedCombatants,
    nextTurn,
    prevTurn,
    rollInitiative,
    selectCombatant,
    setDamageMode,
    setHealMode,
    setPendingAmount,
    confirmPendingAmount,
    undo,
    redo,
  ]);

  // Separate players and creatures
  const players = enrichedCombatants.filter((c) => c.entity_type === "player");
  const creatures = enrichedCombatants.filter(
    (c) => c.entity_type === "creature"
  );

  // Get current turn combatant and on-deck combatant
  const sortedCombatants = [...enrichedCombatants].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const activeCombatant = encounter
    ? sortedCombatants[encounter.current_turn_index]
    : null;
  const onDeckCombatant =
    encounter && sortedCombatants.length > 1
      ? sortedCombatants[
          (encounter.current_turn_index + 1) % sortedCombatants.length
        ]
      : null;

  // Auto-select active combatant on turn change
  useEffect(() => {
    if (!encounter || !activeCombatant) return;

    const turnChanged =
      prevTurnIndex.current !== null &&
      prevTurnIndex.current !== encounter.current_turn_index;

    // Select if nothing selected OR if turn changed (snaps back to active)
    if (!selectedCombatantId || turnChanged) {
      selectCombatant(activeCombatant.id);
    }

    prevTurnIndex.current = encounter.current_turn_index;
  }, [
    encounter?.current_turn_index,
    activeCombatant,
    selectedCombatantId,
    selectCombatant,
  ]);

  const selectedCombatant = enrichedCombatants.find(
    (c) => c.id === selectedCombatantId
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--study-dark)]">
        <div className="text-xl text-[var(--parchment-aged)]">Loading encounter...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--study-dark)]">
        <div className="text-xl text-[var(--vermillion)]">{error}</div>
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--study-dark)]">
        <div className="text-xl text-[var(--parchment-aged)]">Encounter not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--study-dark)]">
      {/* Header */}
      <header className="bg-[var(--study-panel)] border-b border-[var(--gold-shadow)]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/tools/tracker"
              className="text-[var(--parchment-aged)] hover:text-[var(--gold)] transition-colors"
              title="Back to tracker"
            >
              &larr;
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-[var(--gold)] truncate">
              {encounter.name}
            </h1>
            <span className="text-[var(--parchment-aged)] text-sm whitespace-nowrap">
              R{encounter.round_number}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* Lair action indicator - hidden on small screens */}
            {encounter.lair_owner_id && (
              <span
                className={`text-sm hidden sm:inline ${
                  encounter.lair_action_used ? "text-[var(--parchment-aged)]/40" : "text-[var(--vermillion)]"
                }`}
              >
                {encounter.lair_action_used ? "Lair Used" : "Lair Ready"}
              </span>
            )}

            {/* Undo/Redo buttons */}
            <div className="flex gap-1">
              <button
                onClick={undo}
                disabled={!encounter.can_undo}
                className={`px-2 py-1 rounded text-sm ${
                  encounter.can_undo
                    ? "bg-[var(--study-wood)] hover:bg-[var(--gold)]/20"
                    : "bg-[var(--study-panel)] text-[var(--parchment-aged)]/30 cursor-not-allowed"
                }`}
                title="Undo (Ctrl+Z)"
              >
                ↩
              </button>
              <button
                onClick={redo}
                disabled={!encounter.can_redo}
                className={`px-2 py-1 rounded text-sm ${
                  encounter.can_redo
                    ? "bg-[var(--study-wood)] hover:bg-[var(--gold)]/20"
                    : "bg-[var(--study-panel)] text-[var(--parchment-aged)]/30 cursor-not-allowed"
                }`}
                title="Redo (Ctrl+Shift+Z)"
              >
                ↪
              </button>
            </div>

            <TurnControls
              onPrev={prevTurn}
              onNext={nextTurn}
              onRollInitiative={() => setShowInitiativeModal(true)}
              onRestart={restartEncounter}
              isActive={encounter.status === "active"}
            />
          </div>
        </div>

        {/* Mobile tab navigation */}
        <div className="flex lg:hidden border-t border-[var(--gold-shadow)]">
          {[
            { id: "players" as const, label: `Players (${players.length})` },
            { id: "active" as const, label: "Active" },
            { id: "creatures" as const, label: `Creatures (${creatures.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mobileTab === tab.id
                  ? "text-[var(--gold)] border-b-2 border-[var(--gold)]"
                  : "text-[var(--parchment-aged)] hover:text-[var(--parchment-dark)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main layout - responsive */}
      <main className="flex-1 grid lg:grid-cols-[1fr_2fr_1fr] gap-4 p-4 overflow-hidden">
        {/* Left: Players - hidden on mobile unless tab selected */}
        <div
          className={`overflow-y-auto space-y-3 ${
            mobileTab === "players" ? "block" : "hidden lg:block"
          }`}
        >
          <h2 className="text-sm font-semibold text-[var(--parchment-aged)] uppercase tracking-wider mb-2 hidden lg:block">
            Players ({players.length})
          </h2>
          {players.map((combatant) => (
            <CombatantCard
              key={combatant.id}
              combatant={combatant}
              isActive={activeCombatant?.id === combatant.id}
              isOnDeck={onDeckCombatant?.id === combatant.id}
              isSelected={selectedCombatantId === combatant.id}
              onClick={() => {
                selectCombatant(combatant.id);
                setMobileTab("active");
              }}
            />
          ))}
        </div>

        {/* Center: Active Turn - hidden on mobile unless tab selected */}
        <div
          className={`overflow-hidden flex flex-col ${
            mobileTab === "active" ? "block" : "hidden lg:flex"
          }`}
        >
          {selectedCombatant ? (
            <ActiveTurnCard
              combatant={selectedCombatant}
              onDamage={() => setDamageMode(true)}
              onHeal={() => setHealMode(true)}
              onCondition={() => setShowConditionPicker(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--parchment-aged)]">
              Select a combatant to view details
            </div>
          )}

          {/* Damage/Heal input overlay */}
          {(damageMode || healMode) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
              <div className="bg-[var(--study-panel)] rounded p-6 border border-[var(--gold-shadow)]">
                <h3 className="text-lg font-bold mb-4">
                  {damageMode ? "Apply Damage" : "Apply Healing"}
                </h3>
                <input
                  type="number"
                  autoFocus
                  value={pendingAmount}
                  onChange={(e) => setPendingAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmPendingAmount();
                    if (e.key === "Escape") {
                      setDamageMode(false);
                      setHealMode(false);
                    }
                  }}
                  className="w-32 px-4 py-2 text-2xl text-center bg-[var(--study-wood)] border border-[var(--gold-dark)] rounded"
                  placeholder="0"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={confirmPendingAmount}
                    className={`px-4 py-2 rounded font-semibold ${
                      damageMode
                        ? "bg-[var(--vermillion-dark)] hover:bg-[var(--vermillion)]"
                        : "bg-[var(--gold-dark)] hover:bg-[var(--gold)]"
                    }`}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setDamageMode(false);
                      setHealMode(false);
                    }}
                    className="px-4 py-2 bg-[var(--study-wood)] hover:bg-[var(--study-wood)] rounded"
                  >
                    Cancel (Esc)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Condition picker overlay */}
          {showConditionPicker && selectedCombatantId && (
            <ConditionPicker
              combatantId={selectedCombatantId}
              currentConditions={selectedCombatant?.conditions || []}
              onClose={() => setShowConditionPicker(false)}
            />
          )}
        </div>

        {/* Right: Creatures - hidden on mobile unless tab selected */}
        <div
          className={`overflow-y-auto space-y-3 ${
            mobileTab === "creatures" ? "block" : "hidden lg:block"
          }`}
        >
          <h2 className="text-sm font-semibold text-[var(--parchment-aged)] uppercase tracking-wider mb-2 hidden lg:block">
            Creatures ({creatures.length})
          </h2>
          {creatures.map((combatant) => (
            <CombatantCard
              key={combatant.id}
              combatant={combatant}
              isActive={activeCombatant?.id === combatant.id}
              isOnDeck={onDeckCombatant?.id === combatant.id}
              isSelected={selectedCombatantId === combatant.id}
              onClick={() => {
                selectCombatant(combatant.id);
                setMobileTab("active");
              }}
            />
          ))}
        </div>
      </main>

      {/* Footer: Keyboard shortcuts hint - hidden on mobile */}
      <footer className="hidden sm:block px-6 py-2 bg-[var(--study-panel)] border-t border-[var(--gold-shadow)] text-xs text-[var(--ink-faded)]">
        <span className="mr-4">Space: Next</span>
        <span className="mr-4">Shift+Space: Prev</span>
        <span className="mr-4">D: Damage</span>
        <span className="mr-4">H: Heal</span>
        <span className="mr-4">C: Conditions</span>
        <span className="mr-4">R: Roll Init</span>
        <span className="mr-4">Ctrl+Z: Undo</span>
        <span>1-9: Select</span>
      </footer>

      {/* Initiative Modal */}
      {showInitiativeModal && (
        <InitiativeModal
          combatants={enrichedCombatants}
          onConfirm={async (initiatives) => {
            await setInitiative(initiatives);
            setShowInitiativeModal(false);
          }}
          onCancel={() => setShowInitiativeModal(false)}
        />
      )}

      {/* Concentration Check Modal */}
      <ConcentrationCheckModal />
    </div>
  );
}
