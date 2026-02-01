"use client";

import type { EnrichedCombatant, Player, Creature } from "@/lib/tracker/types";
import { CONDITION_ICONS, type Condition } from "@/lib/tracker/types";
import {
  formatHP,
  getHPPercentage,
  getHPColor,
} from "@/lib/tracker/utils";

interface CombatantCardProps {
  combatant: EnrichedCombatant;
  isActive: boolean;
  isOnDeck: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function isPlayer(entity: Player | Creature): entity is Player {
  return "character_class" in entity;
}

export function CombatantCard({
  combatant,
  isActive,
  isOnDeck,
  isSelected,
  onClick,
}: CombatantCardProps) {
  const entity = combatant.entity;
  if (!entity) return null;

  const hp =
    combatant.hp_current ??
    (isPlayer(entity) ? entity.hp_current : entity.hp_max);
  const maxHp = combatant.hp_max ?? entity.hp_max;
  const hpPct = getHPPercentage(hp, maxHp);
  const hpColor = getHPColor(hp, maxHp);

  const cardClasses = [
    "rounded p-3 cursor-pointer transition-all",
    "border-2",
    isActive
      ? "border-[var(--gold)] bg-[var(--gold)]/10 shadow-lg shadow-[var(--gold)]/20"
      : isOnDeck
      ? "border-[var(--parchment-aged)] bg-[var(--parchment-aged)]/15 shadow-md shadow-[var(--parchment-aged)]/20"
      : isSelected
      ? "border-[var(--gold)]/50 bg-[var(--study-panel)]"
      : "border-[var(--gold-shadow)] bg-[var(--study-panel)] hover:border-[var(--gold)]/30",
  ].join(" ");

  // Get damage resistances/immunities for creatures
  const resistances = !isPlayer(entity) ? entity.damage_resistances : [];
  const immunities = !isPlayer(entity) ? entity.damage_immunities : [];

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Header: Name + Initiative */}
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-[var(--parchment-light)] truncate">
          {combatant.display_name || entity.name}
        </div>
        {combatant.initiative_roll !== null &&
          combatant.initiative_roll !== undefined && (
            <div className="text-sm bg-[var(--study-wood)] px-2 py-0.5 rounded">
              Init: {combatant.initiative_roll}
            </div>
          )}
      </div>

      {/* Subtitle for players */}
      {isPlayer(entity) && entity.character_class && (
        <div className="text-xs text-[var(--parchment-aged)] mb-2">
          Level {entity.level} {entity.race} {entity.character_class}
        </div>
      )}

      {/* Combat Stats */}
      <div className="flex gap-4 text-sm mb-2">
        <div>
          <span className="text-[var(--parchment-aged)]">AC</span>{" "}
          <span className="font-semibold">{entity.ac}</span>
        </div>
        <div>
          <span className="text-[var(--parchment-aged)]">HP</span>{" "}
          <span className="font-semibold" style={{ color: hpColor }}>
            {formatHP(hp, maxHp)}
          </span>
        </div>
      </div>

      {/* HP Bar */}
      <div className="h-1.5 bg-[var(--study-wood)] rounded-full mb-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${hpPct}%`, backgroundColor: hpColor }}
        />
      </div>

      {/* Conditions */}
      {combatant.conditions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {combatant.conditions.map((cond) => (
            <span
              key={cond}
              className="text-xs bg-[var(--study-wood)] px-1.5 py-0.5 rounded"
              title={cond}
            >
              {CONDITION_ICONS[cond as Condition] || "?"} {cond}
            </span>
          ))}
        </div>
      )}

      {/* Player at 0 HP: Death Saves indicator */}
      {isPlayer(entity) && hp === 0 && (
        <div className="flex items-center gap-2 mb-2 text-xs">
          <span className="text-[var(--vermillion)]">Death Saves:</span>
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={`s-${i}`}
                className={`w-2.5 h-2.5 rounded-full border ${
                  i < combatant.death_save_successes
                    ? "bg-green-500 border-green-500"
                    : "border-green-500/50"
                }`}
              />
            ))}
          </div>
          <span className="text-[var(--ink-faded)]">/</span>
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={`f-${i}`}
                className={`w-2.5 h-2.5 rounded-full border ${
                  i < combatant.death_save_failures
                    ? "bg-red-500 border-red-500"
                    : "border-red-500/50"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Player: Passive Perception */}
      {isPlayer(entity) && (
        <div className="text-xs text-[var(--parchment-aged)]">
          PP: {entity.passive_perception}
        </div>
      )}

      {/* Player: Spell Slots indicator */}
      {isPlayer(entity) &&
        entity.spells?.slots &&
        Object.keys(entity.spells.slots).length > 0 &&
        (() => {
          const maxSlots = entity.spells.slots || {};
          const usedSlots = combatant.spell_slots_used || {};
          const totalMax = Object.values(maxSlots).reduce(
            (sum, val) => sum + (val || 0),
            0
          );
          const totalUsed = Object.entries(usedSlots).reduce(
            (sum, [, val]) => sum + (val || 0),
            0
          );
          const remaining = totalMax - totalUsed;
          return (
            <div className="text-xs text-[var(--gold)] mt-1">
              {remaining}/{totalMax} slots
            </div>
          );
        })()}

      {/* Concentration indicator */}
      {combatant.concentration_spell && (
        <div className="text-xs text-[var(--gold)] mb-1">
          Concentrating: {combatant.concentration_spell}
        </div>
      )}

      {/* Creature: Legendary Actions remaining */}
      {!isPlayer(entity) && entity.legendary_action_count > 0 && (
        <div className="text-xs text-yellow-400 mb-1">
          Legendary:{" "}
          {entity.legendary_action_count - combatant.legendary_actions_used}/
          {entity.legendary_action_count}
        </div>
      )}

      {/* Creature: Resistances/Immunities */}
      {!isPlayer(entity) &&
        (resistances.length > 0 || immunities.length > 0) && (
          <div className="text-xs text-[var(--parchment-aged)] space-y-0.5">
            {resistances.length > 0 && (
              <div>Resist: {resistances.join(", ")}</div>
            )}
            {immunities.length > 0 && (
              <div>Immune: {immunities.join(", ")}</div>
            )}
          </div>
        )}
    </div>
  );
}
