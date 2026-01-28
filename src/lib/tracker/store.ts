"use client";

import { create } from "zustand";
import type {
  Encounter,
  Player,
  Creature,
  EnrichedCombatant,
  CombatLogEntry,
} from "./types";
import { encountersApi, playersApi, creaturesApi } from "./api";

interface ConcentrationCheck {
  combatantId: string;
  combatantName: string;
  dc: number;
  spell: string;
}

interface EncounterState {
  // Current encounter
  encounter: Encounter | null;
  enrichedCombatants: EnrichedCombatant[];

  // Entity caches
  players: Record<string, Player>;
  creatures: Record<string, Creature>;

  // Combat log
  combatLog: CombatLogEntry[];

  // UI state
  selectedCombatantId: string | null;
  damageMode: boolean;
  healMode: boolean;
  pendingAmount: string;

  // Concentration check pending
  concentrationCheck: ConcentrationCheck | null;

  // Lair owner selection modal
  showLairOwnerSelect: boolean;

  // Loading state
  isLoading: boolean;
  error: string | null;

  // Actions
  loadEncounter: (id: string) => Promise<void>;
  loadEntities: () => Promise<void>;
  loadCombatLog: () => Promise<void>;
  rollInitiative: () => Promise<void>;
  setInitiative: (initiatives: Record<string, number>) => Promise<void>;
  restartEncounter: () => Promise<void>;
  nextTurn: () => Promise<void>;
  prevTurn: () => Promise<void>;
  applyDamage: (combatantId: string, amount: number) => Promise<void>;
  applyHeal: (combatantId: string, amount: number) => Promise<void>;
  addCondition: (combatantId: string, condition: string) => Promise<void>;
  removeCondition: (combatantId: string, condition: string) => Promise<void>;

  // Death saves
  recordDeathSave: (
    combatantId: string,
    success: boolean,
    natural20?: boolean,
    natural1?: boolean
  ) => Promise<void>;

  // Concentration
  setConcentration: (
    combatantId: string,
    spellName: string | null
  ) => Promise<void>;
  clearConcentrationCheck: () => void;
  passConcentrationCheck: () => void;
  failConcentrationCheck: () => Promise<void>;

  // Legendary actions
  useLegendaryAction: (combatantId: string, cost?: number) => Promise<void>;

  // Spell slots
  useSpellSlot: (
    combatantId: string,
    level: number,
    count?: number
  ) => Promise<void>;
  restoreSpellSlot: (
    combatantId: string,
    level: number,
    count?: number
  ) => Promise<void>;
  resetSpellSlots: (combatantId: string) => Promise<void>;

  // Lair actions
  setLairOwner: (combatantId: string | null) => Promise<void>;
  useLairAction: (actionIndex: number) => Promise<void>;
  setShowLairOwnerSelect: (show: boolean) => void;

  // Undo/Redo
  undo: () => Promise<void>;
  redo: () => Promise<void>;

  // UI actions
  selectCombatant: (id: string | null) => void;
  setDamageMode: (on: boolean) => void;
  setHealMode: (on: boolean) => void;
  setPendingAmount: (amount: string) => void;
  confirmPendingAmount: () => Promise<void>;
}

export const useEncounterStore = create<EncounterState>((set, get) => ({
  encounter: null,
  enrichedCombatants: [],
  players: {},
  creatures: {},
  combatLog: [],
  selectedCombatantId: null,
  damageMode: false,
  healMode: false,
  pendingAmount: "",
  concentrationCheck: null,
  showLairOwnerSelect: false,
  isLoading: false,
  error: null,

  loadEntities: async () => {
    try {
      const [players, creatures] = await Promise.all([
        playersApi.list(),
        creaturesApi.list(),
      ]);

      const playerMap: Record<string, Player> = {};
      players.forEach((p) => (playerMap[p.id] = p));

      const creatureMap: Record<string, Creature> = {};
      creatures.forEach((c) => (creatureMap[c.id] = c));

      set({ players: playerMap, creatures: creatureMap });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load entities" });
    }
  },

  loadEncounter: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { players, creatures } = get();
      const encounter = await encountersApi.get(id);

      // Enrich combatants with entity data
      const sorted = [...encounter.combatants].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      const enriched: EnrichedCombatant[] = sorted.map((c) => ({
        ...c,
        entity:
          c.entity_type === "player"
            ? players[c.entity_id]
            : creatures[c.entity_id],
      }));

      set({ encounter, enrichedCombatants: enriched, isLoading: false });

      // Check if we need to show lair owner selection
      if (encounter.lair_candidates.length > 1 && !encounter.lair_owner_id) {
        set({ showLairOwnerSelect: true });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load encounter",
        isLoading: false,
      });
    }
  },

  loadCombatLog: async () => {
    const { encounter } = get();
    if (!encounter) return;

    try {
      const log = await encountersApi.getCombatLog(encounter.id);
      set({ combatLog: log });
    } catch (err) {
      console.error("Failed to load combat log:", err);
    }
  },

  rollInitiative: async () => {
    const { encounter } = get();
    if (!encounter) return;

    const updated = await encountersApi.rollInitiative(encounter.id);
    await get().loadEncounter(updated.id);
    await get().loadCombatLog();
  },

  setInitiative: async (initiatives: Record<string, number>) => {
    const { encounter } = get();
    if (!encounter) return;

    const updated = await encountersApi.setInitiative(encounter.id, initiatives);
    await get().loadEncounter(updated.id);
    await get().loadCombatLog();
  },

  restartEncounter: async () => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.restart(encounter.id);
    await get().loadEncounter(encounter.id);
    set({ combatLog: [] });
  },

  nextTurn: async () => {
    const { encounter } = get();
    if (!encounter) return;

    const updated = await encountersApi.nextTurn(encounter.id);
    await get().loadEncounter(updated.id);
    await get().loadCombatLog();
  },

  prevTurn: async () => {
    const { encounter } = get();
    if (!encounter) return;

    const updated = await encountersApi.prevTurn(encounter.id);
    await get().loadEncounter(updated.id);
    await get().loadCombatLog();
  },

  applyDamage: async (combatantId: string, amount: number) => {
    const { encounter, enrichedCombatants } = get();
    if (!encounter) return;

    const result = await encountersApi.damage(combatantId, amount);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();

    // Check for concentration
    if (result.concentration_check_dc && result.concentration_spell) {
      const combatant = enrichedCombatants.find((c) => c.id === combatantId);
      const name =
        combatant?.display_name || combatant?.entity?.name || "Unknown";
      set({
        concentrationCheck: {
          combatantId,
          combatantName: name,
          dc: result.concentration_check_dc,
          spell: result.concentration_spell,
        },
      });
    }
  },

  applyHeal: async (combatantId: string, amount: number) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.heal(combatantId, amount);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  addCondition: async (combatantId: string, condition: string) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.addCondition(combatantId, condition);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  removeCondition: async (combatantId: string, condition: string) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.removeCondition(combatantId, condition);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  recordDeathSave: async (
    combatantId: string,
    success: boolean,
    natural20 = false,
    natural1 = false
  ) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.recordDeathSave(combatantId, success, natural20, natural1);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  setConcentration: async (combatantId: string, spellName: string | null) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.setConcentration(combatantId, spellName);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  clearConcentrationCheck: () => {
    set({ concentrationCheck: null });
  },

  passConcentrationCheck: () => {
    set({ concentrationCheck: null });
  },

  failConcentrationCheck: async () => {
    const { concentrationCheck } = get();
    if (!concentrationCheck) return;

    await get().setConcentration(concentrationCheck.combatantId, null);
    set({ concentrationCheck: null });
  },

  useLegendaryAction: async (combatantId: string, cost = 1) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.useLegendaryAction(combatantId, cost);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  useSpellSlot: async (combatantId: string, level: number, count = 1) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.useSpellSlot(combatantId, level, count);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  restoreSpellSlot: async (combatantId: string, level: number, count = 1) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.restoreSpellSlot(combatantId, level, count);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  resetSpellSlots: async (combatantId: string) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.resetSpellSlots(combatantId);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  setLairOwner: async (combatantId: string | null) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.setLairOwner(encounter.id, combatantId);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
    set({ showLairOwnerSelect: false });
  },

  useLairAction: async (actionIndex: number) => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.useLairAction(encounter.id, actionIndex);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  setShowLairOwnerSelect: (show: boolean) => {
    set({ showLairOwnerSelect: show });
  },

  undo: async () => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.undo(encounter.id);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  redo: async () => {
    const { encounter } = get();
    if (!encounter) return;

    await encountersApi.redo(encounter.id);
    await get().loadEncounter(encounter.id);
    await get().loadCombatLog();
  },

  selectCombatant: (id) => set({ selectedCombatantId: id }),

  setDamageMode: (on) =>
    set({ damageMode: on, healMode: false, pendingAmount: "" }),

  setHealMode: (on) =>
    set({ healMode: on, damageMode: false, pendingAmount: "" }),

  setPendingAmount: (amount) => set({ pendingAmount: amount }),

  confirmPendingAmount: async () => {
    const { selectedCombatantId, damageMode, healMode, pendingAmount } = get();
    if (!selectedCombatantId || !pendingAmount) return;

    const amount = parseInt(pendingAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    if (damageMode) {
      await get().applyDamage(selectedCombatantId, amount);
    } else if (healMode) {
      await get().applyHeal(selectedCombatantId, amount);
    }

    set({ damageMode: false, healMode: false, pendingAmount: "" });
  },
}));
