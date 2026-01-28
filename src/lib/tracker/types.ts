/**
 * InitTracker Types
 * Based on the existing InitTracker frontend types
 */

export interface Player {
  id: string;
  name: string;
  character_class?: string;
  level: number;
  race?: string;

  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Combat stats
  hp_current: number;
  hp_max: number;
  hp_temp: number;
  ac: number;
  initiative_bonus: number;
  speed: number;
  proficiency_bonus: number;

  // Derived stats
  passive_perception: number;
  passive_investigation: number;
  passive_insight: number;

  // Complex data
  saving_throws: Record<string, number>;
  skills: Record<string, number>;
  conditions: string[];
  features: string[];
  spells: SpellData;
  equipment: string[];

  // Combat abilities
  attacks: Attack[];
  actions: Action[];
  bonus_actions: Action[];
  reactions: Action[];

  source: string;
  source_id?: string;
}

export interface Attack {
  name: string;
  bonus: number;
  damage: string;
  type?: string;
  range?: string;
  description?: string;
}

export interface SpellData {
  slots?: Record<number, number>;
  known?: Spell[];
}

export interface Spell {
  name: string;
  level: number;
  school?: string;
  casting_time?: string;
  range?: string;
  components?: string;
  duration?: string;
  description?: string;
}

export interface Creature {
  id: string;
  name: string;
  creature_type?: string;
  size?: string;
  alignment?: string;
  challenge_rating?: string;

  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Combat stats
  hp_max: number;
  hp_formula?: string;
  ac: number;
  ac_type?: string;

  // Speeds
  speed_walk: number;
  speed_fly: number;
  speed_swim: number;
  speed_climb: number;
  speed_burrow: number;

  // Complex data
  saving_throws: Record<string, number>;
  skills: Record<string, number>;
  damage_resistances: string[];
  damage_immunities: string[];
  damage_vulnerabilities: string[];
  condition_immunities: string[];
  senses: Record<string, number>;
  languages: string[];

  // Abilities
  special_abilities: Action[];
  actions: Action[];
  bonus_actions: Action[];
  reactions: Action[];
  legendary_actions: Action[];
  legendary_action_count: number;
  lair_actions: Action[];

  is_srd: boolean;
  source: string;
  source_id?: string;
}

export interface Action {
  name: string;
  description: string;
  attack_bonus?: number;
  damage?: string;
  damage_type?: string;
}

export interface Combatant {
  id: string;
  entity_type: "player" | "creature";
  entity_id: string;
  display_name?: string;
  initiative_roll?: number;
  hp_current?: number;
  hp_max?: number;
  conditions: string[];
  notes?: string;
  sort_order: number;

  // Death saves
  death_save_successes: number;
  death_save_failures: number;

  // Concentration
  concentration_spell?: string;

  // Legendary actions
  legendary_actions_used: number;

  // Spell slots
  spell_slots_used: Record<string, number>;
}

export interface Encounter {
  id: string;
  name: string;
  campaign_id?: string;
  status: "preparing" | "active" | "completed";
  current_turn_index: number;
  round_number: number;
  combatants: Combatant[];

  // Lair actions
  lair_owner_id?: string;
  lair_action_used: boolean;
  lair_candidates: LairCandidate[];

  // Undo/Redo
  can_undo: boolean;
  can_redo: boolean;
}

export interface LairCandidate {
  combatant_id: string;
  name: string;
  lair_action_count: number;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  player_count: number;
  encounter_count: number;
}

export interface CampaignDetail extends Campaign {
  player_ids: string[];
  encounter_ids: string[];
}

export interface CombatLogEntry {
  id: string;
  timestamp: string;
  round_number?: number;
  turn_index?: number;
  event_type: string;
  actor_name: string;
  target_name?: string;
  description: string;
  data?: Record<string, unknown>;
}

export interface DamageResponse {
  hp_current: number;
  concentration_check_dc?: number;
  concentration_spell?: string;
}

// Enriched combatant with full entity data
export interface EnrichedCombatant extends Combatant {
  entity: Player | Creature;
}

// D&D 5e Conditions
export const CONDITIONS = [
  "blinded",
  "charmed",
  "deafened",
  "exhaustion",
  "frightened",
  "grappled",
  "incapacitated",
  "invisible",
  "paralyzed",
  "petrified",
  "poisoned",
  "prone",
  "restrained",
  "stunned",
  "unconscious",
  "concentrating",
  "stabilized",
  "dead",
] as const;

export type Condition = (typeof CONDITIONS)[number];

export const CONDITION_ICONS: Record<Condition, string> = {
  blinded: "👁️",
  charmed: "💕",
  deafened: "🔇",
  exhaustion: "😫",
  frightened: "😨",
  grappled: "🤝",
  incapacitated: "💫",
  invisible: "👻",
  paralyzed: "⚡",
  petrified: "🗿",
  poisoned: "☠️",
  prone: "⬇️",
  restrained: "⛓️",
  stunned: "💫",
  unconscious: "💤",
  concentrating: "🎯",
  stabilized: "💚",
  dead: "💀",
};
