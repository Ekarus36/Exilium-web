"use client";

import type {
  EnrichedCombatant,
  Player,
  Creature,
  Action,
} from "@/lib/tracker/types";
import { CONDITION_ICONS, type Condition } from "@/lib/tracker/types";
import {
  formatHP,
  getHPPercentage,
  getHPColor,
  getModifier,
  formatModifier,
} from "@/lib/tracker/utils";
import { DeathSaves } from "./DeathSaves";
import { SpellSlots } from "./SpellSlots";
import { LegendaryActions } from "./LegendaryActions";

interface ActiveTurnCardProps {
  combatant: EnrichedCombatant;
  onDamage: () => void;
  onHeal: () => void;
  onCondition: () => void;
}

function isPlayer(entity: Player | Creature): entity is Player {
  return "character_class" in entity;
}

const ABILITIES = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;

const ABILITY_ABBR: Record<string, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA",
};

function ActionBlock({ title, actions }: { title: string; actions: Action[] }) {
  if (actions.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-[var(--gold)] border-b border-[var(--gold-shadow)] pb-1 mb-2">
        {title}
      </h4>
      <div className="space-y-2">
        {actions.map((action, i) => (
          <div key={i}>
            <span className="font-semibold">{action.name}.</span>{" "}
            <span className="text-[var(--parchment-aged)]">{action.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActiveTurnCard({
  combatant,
  onDamage,
  onHeal,
  onCondition,
}: ActiveTurnCardProps) {
  const entity = combatant.entity;
  if (!entity) return null;

  const hp =
    combatant.hp_current ??
    (isPlayer(entity) ? entity.hp_current : entity.hp_max);
  const maxHp = combatant.hp_max ?? entity.hp_max;
  const hpPct = getHPPercentage(hp, maxHp);
  const hpColor = getHPColor(hp, maxHp);

  return (
    <div className="bg-[var(--study-panel)] rounded border-2 border-[var(--gold)] p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold font-['Cinzel'] text-[var(--gold)]">
            {combatant.display_name || entity.name}
          </h2>
          {isPlayer(entity) && entity.character_class && (
            <div className="text-[var(--parchment-aged)]">
              Level {entity.level} {entity.race} {entity.character_class}
            </div>
          )}
          {!isPlayer(entity) && (
            <div className="text-[var(--parchment-aged)]">
              {entity.size} {entity.creature_type}
              {entity.challenge_rating && ` (CR ${entity.challenge_rating})`}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            Init {combatant.initiative_roll}
          </div>
        </div>
      </div>

      {/* Combat Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-[var(--study-wood)] rounded">
        <div className="text-center">
          <div className="text-xs text-[var(--parchment-aged)]">AC</div>
          <div className="text-2xl font-bold">{entity.ac}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[var(--parchment-aged)]">HP</div>
          <div className="text-2xl font-bold" style={{ color: hpColor }}>
            {formatHP(hp, maxHp)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[var(--parchment-aged)]">Speed</div>
          <div className="text-2xl font-bold">
            {isPlayer(entity) ? entity.speed : entity.speed_walk} ft
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[var(--parchment-aged)]">Initiative</div>
          <div className="text-2xl font-bold">
            {formatModifier(
              isPlayer(entity)
                ? entity.initiative_bonus
                : getModifier(entity.dexterity)
            )}
          </div>
        </div>
      </div>

      {/* HP Bar */}
      <div className="h-3 bg-[var(--study-wood)] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${hpPct}%`, backgroundColor: hpColor }}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onDamage}
          className="px-4 py-2 bg-[var(--vermillion-dark)] hover:bg-[var(--vermillion)] rounded text-sm font-semibold transition-colors"
        >
          Damage (D)
        </button>
        <button
          onClick={onHeal}
          className="px-4 py-2 bg-[var(--gold-dark)] hover:bg-[var(--gold)] rounded text-sm font-semibold transition-colors"
        >
          Heal (H)
        </button>
        <button
          onClick={onCondition}
          className="px-4 py-2 bg-[var(--study-wood)] hover:bg-[var(--study-wood)] rounded text-sm font-semibold transition-colors"
        >
          Condition (C)
        </button>
      </div>

      {/* Death Saves (for players at 0 HP) */}
      {isPlayer(entity) && hp === 0 && (
        <div className="mb-4">
          <DeathSaves
            combatantId={combatant.id}
            successes={combatant.death_save_successes}
            failures={combatant.death_save_failures}
          />
        </div>
      )}

      {/* Spell Slots (for players with spells) */}
      {isPlayer(entity) &&
        entity.spells?.slots &&
        Object.keys(entity.spells.slots).length > 0 && (
          <div className="mb-4">
            <SpellSlots
              combatantId={combatant.id}
              player={entity}
              slotsUsed={combatant.spell_slots_used || {}}
            />
          </div>
        )}

      {/* Legendary Actions (for creatures with legendary actions) */}
      {!isPlayer(entity) && entity.legendary_action_count > 0 && (
        <div className="mb-4">
          <LegendaryActions
            combatantId={combatant.id}
            creature={entity}
            used={combatant.legendary_actions_used}
          />
        </div>
      )}

      {/* Active Conditions */}
      {combatant.conditions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[var(--gold)] mb-2">
            Active Conditions
          </h4>
          <div className="flex flex-wrap gap-2">
            {combatant.conditions.map((cond) => (
              <span
                key={cond}
                className="bg-[var(--gold)]/20 text-[var(--gold)] px-2 py-1 rounded text-sm"
              >
                {CONDITION_ICONS[cond as Condition] || "?"} {cond}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ability Scores */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {ABILITIES.map((ability) => {
          const score = entity[ability];
          const mod = getModifier(score);
          return (
            <div
              key={ability}
              className="text-center p-2 bg-[var(--study-wood)] rounded"
            >
              <div className="text-xs text-[var(--parchment-aged)]">{ABILITY_ABBR[ability]}</div>
              <div className="text-lg font-bold">{score}</div>
              <div className="text-sm text-[var(--gold)]">{formatModifier(mod)}</div>
            </div>
          );
        })}
      </div>

      {/* Saving Throws */}
      {Object.keys(entity.saving_throws).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[var(--gold)] mb-2">
            Saving Throws
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(entity.saving_throws).map(([key, value]) => (
              <span
                key={key}
                className="bg-[var(--study-wood)] px-2 py-1 rounded text-sm"
              >
                {key.toUpperCase()} {formatModifier(value as number)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {Object.keys(entity.skills).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[var(--gold)] mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(entity.skills).map(([key, value]) => (
              <span
                key={key}
                className="bg-[var(--study-wood)] px-2 py-1 rounded text-sm"
              >
                {key} {formatModifier(value as number)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Creature-specific: Damage Resistances/Immunities */}
      {!isPlayer(entity) && (
        <>
          {entity.damage_resistances.length > 0 && (
            <div className="mb-2 text-sm">
              <span className="font-semibold">Damage Resistances:</span>{" "}
              {entity.damage_resistances.join(", ")}
            </div>
          )}
          {entity.damage_immunities.length > 0 && (
            <div className="mb-2 text-sm">
              <span className="font-semibold">Damage Immunities:</span>{" "}
              {entity.damage_immunities.join(", ")}
            </div>
          )}
          {entity.condition_immunities.length > 0 && (
            <div className="mb-4 text-sm">
              <span className="font-semibold">Condition Immunities:</span>{" "}
              {entity.condition_immunities.join(", ")}
            </div>
          )}
        </>
      )}

      {/* Creature Actions */}
      {!isPlayer(entity) && (
        <>
          <ActionBlock
            title="Special Abilities"
            actions={entity.special_abilities}
          />
          <ActionBlock title="Actions" actions={entity.actions} />
          <ActionBlock title="Bonus Actions" actions={entity.bonus_actions} />
          <ActionBlock title="Reactions" actions={entity.reactions} />
          {entity.legendary_action_count > 0 && (
            <>
              <div className="text-sm mb-2">
                <span className="font-semibold">Legendary Actions:</span>{" "}
                {entity.legendary_action_count}/round
              </div>
              <ActionBlock title="" actions={entity.legendary_actions} />
            </>
          )}
        </>
      )}

      {/* Player Features */}
      {isPlayer(entity) && entity.features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[var(--gold)] border-b border-[var(--gold-shadow)] pb-1 mb-2">
            Features
          </h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {entity.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
