/**
 * InitTracker API Client
 * Uses the /api/tracker proxy route to communicate with FastAPI backend
 */

import type {
  Player,
  Creature,
  Encounter,
  Combatant,
  Campaign,
  CampaignDetail,
  CombatLogEntry,
  DamageResponse,
} from "./types";

const BASE_URL = "/api/tracker";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.error || `API error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Players API
export const playersApi = {
  list: () => fetchApi<Player[]>("/players"),
  get: (id: string) => fetchApi<Player>(`/players/${id}`),
  create: (player: Omit<Player, "id">) =>
    fetchApi<Player>("/players", {
      method: "POST",
      body: JSON.stringify(player),
    }),
  update: (id: string, player: Partial<Player>) =>
    fetchApi<Player>(`/players/${id}`, {
      method: "PUT",
      body: JSON.stringify(player),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/players/${id}`, { method: "DELETE" }),
};

// Creatures API
export const creaturesApi = {
  list: () => fetchApi<Creature[]>("/creatures"),
  get: (id: string) => fetchApi<Creature>(`/creatures/${id}`),
  create: (creature: Omit<Creature, "id">) =>
    fetchApi<Creature>("/creatures", {
      method: "POST",
      body: JSON.stringify(creature),
    }),
  update: (id: string, creature: Partial<Creature>) =>
    fetchApi<Creature>(`/creatures/${id}`, {
      method: "PUT",
      body: JSON.stringify(creature),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/creatures/${id}`, { method: "DELETE" }),
};

// Campaigns API
export const campaignsApi = {
  list: () => fetchApi<Campaign[]>("/campaigns"),
  get: (id: string) => fetchApi<CampaignDetail>(`/campaigns/${id}`),
  create: (campaign: { name: string; description?: string }) =>
    fetchApi<Campaign>("/campaigns", {
      method: "POST",
      body: JSON.stringify(campaign),
    }),
  update: (id: string, campaign: Partial<Campaign>) =>
    fetchApi<Campaign>(`/campaigns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(campaign),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/campaigns/${id}`, { method: "DELETE" }),

  // Player management
  listPlayers: (campaignId: string) =>
    fetchApi<Player[]>(`/campaigns/${campaignId}/players`),
  addPlayer: (campaignId: string, playerId: string) =>
    fetchApi<void>(`/campaigns/${campaignId}/players/${playerId}`, {
      method: "POST",
    }),
  removePlayer: (campaignId: string, playerId: string) =>
    fetchApi<void>(`/campaigns/${campaignId}/players/${playerId}`, {
      method: "DELETE",
    }),

  // Encounters
  listEncounters: (campaignId: string) =>
    fetchApi<Encounter[]>(`/campaigns/${campaignId}/encounters`),
};

// Encounters API
export const encountersApi = {
  list: () => fetchApi<Encounter[]>("/encounters"),
  get: (id: string) => fetchApi<Encounter>(`/encounters/${id}`),
  create: (encounter: {
    name: string;
    campaign_id?: string;
    combatants?: Array<{ entity_type: string; entity_id: string }>;
  }) =>
    fetchApi<Encounter>("/encounters", {
      method: "POST",
      body: JSON.stringify(encounter),
    }),
  update: (id: string, encounter: Partial<Encounter>) =>
    fetchApi<Encounter>(`/encounters/${id}`, {
      method: "PUT",
      body: JSON.stringify(encounter),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/encounters/${id}`, { method: "DELETE" }),

  // Combat actions
  addCombatant: (
    encounterId: string,
    combatant: { entity_type: string; entity_id: string; quantity?: number }
  ) =>
    fetchApi<Combatant[]>(`/encounters/${encounterId}/combatants`, {
      method: "POST",
      body: JSON.stringify(combatant),
    }),
  removeCombatant: (encounterId: string, combatantId: string) =>
    fetchApi<void>(`/encounters/${encounterId}/combatants/${combatantId}`, {
      method: "DELETE",
    }),
  getAvailablePlayers: (encounterId: string) =>
    fetchApi<Player[]>(`/encounters/${encounterId}/available-players`),
  restart: (encounterId: string) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/restart`, {
      method: "POST",
    }),
  rollInitiative: (encounterId: string) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/roll-initiative`, {
      method: "POST",
    }),
  setInitiative: (encounterId: string, initiatives: Record<string, number>) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/set-initiative`, {
      method: "POST",
      body: JSON.stringify(initiatives),
    }),
  nextTurn: (encounterId: string) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/next-turn`, {
      method: "POST",
    }),
  prevTurn: (encounterId: string) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/prev-turn`, {
      method: "POST",
    }),

  // Combatant actions
  damage: (combatantId: string, amount: number, damageType?: string) =>
    fetchApi<DamageResponse>(`/encounters/combatants/${combatantId}/damage`, {
      method: "POST",
      body: JSON.stringify({ amount, damage_type: damageType }),
    }),
  heal: (combatantId: string, amount: number) =>
    fetchApi<Combatant>(`/encounters/combatants/${combatantId}/heal`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  addCondition: (combatantId: string, condition: string) =>
    fetchApi<Combatant>(`/encounters/combatants/${combatantId}/condition`, {
      method: "POST",
      body: JSON.stringify({ condition, action: "add" }),
    }),
  removeCondition: (combatantId: string, condition: string) =>
    fetchApi<Combatant>(`/encounters/combatants/${combatantId}/condition`, {
      method: "POST",
      body: JSON.stringify({ condition, action: "remove" }),
    }),

  // Combat log
  getCombatLog: (encounterId: string, limit = 100) =>
    fetchApi<CombatLogEntry[]>(
      `/encounters/${encounterId}/log?limit=${limit}`
    ),

  // Death saves
  recordDeathSave: (
    combatantId: string,
    success: boolean,
    natural20 = false,
    natural1 = false
  ) =>
    fetchApi<Combatant>(`/encounters/combatants/${combatantId}/death-save`, {
      method: "POST",
      body: JSON.stringify({
        success,
        natural_20: natural20,
        natural_1: natural1,
      }),
    }),
  resetDeathSaves: (combatantId: string) =>
    fetchApi<Combatant>(
      `/encounters/combatants/${combatantId}/death-save/reset`,
      { method: "POST" }
    ),

  // Concentration
  setConcentration: (combatantId: string, spellName: string | null) =>
    fetchApi<Combatant>(
      `/encounters/combatants/${combatantId}/concentration`,
      {
        method: "POST",
        body: JSON.stringify({ spell_name: spellName }),
      }
    ),

  // Legendary actions
  useLegendaryAction: (combatantId: string, cost = 1) =>
    fetchApi<Combatant>(
      `/encounters/combatants/${combatantId}/legendary-action`,
      {
        method: "POST",
        body: JSON.stringify({ cost }),
      }
    ),
  resetLegendaryActions: (combatantId: string) =>
    fetchApi<Combatant>(
      `/encounters/combatants/${combatantId}/legendary-action/reset`,
      { method: "POST" }
    ),

  // Spell slots
  useSpellSlot: (combatantId: string, level: number, count = 1) =>
    fetchApi<Encounter>(
      `/encounters/combatants/${combatantId}/spell-slot/use`,
      {
        method: "POST",
        body: JSON.stringify({ level, count }),
      }
    ),
  restoreSpellSlot: (combatantId: string, level: number, count = 1) =>
    fetchApi<Encounter>(
      `/encounters/combatants/${combatantId}/spell-slot/restore`,
      {
        method: "POST",
        body: JSON.stringify({ level, count }),
      }
    ),
  resetSpellSlots: (combatantId: string) =>
    fetchApi<Encounter>(
      `/encounters/combatants/${combatantId}/spell-slot/reset`,
      { method: "POST" }
    ),

  // Lair actions
  setLairOwner: (encounterId: string, combatantId: string | null) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/lair-owner`, {
      method: "POST",
      body: JSON.stringify({ combatant_id: combatantId }),
    }),
  useLairAction: (encounterId: string, actionIndex: number) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/lair-action`, {
      method: "POST",
      body: JSON.stringify({ action_index: actionIndex }),
    }),

  // Undo/Redo
  undo: (encounterId: string) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/undo`, { method: "POST" }),
  redo: (encounterId: string) =>
    fetchApi<Encounter>(`/encounters/${encounterId}/redo`, { method: "POST" }),
};

// SRD API
export interface SrdMonsterListItem {
  index: string;
  name: string;
  url: string;
}

export interface SrdMonsterList {
  count: number;
  results: SrdMonsterListItem[];
}

export const srdApi = {
  listMonsters: (search?: string) =>
    fetchApi<SrdMonsterList>(
      `/srd/monsters${search ? `?search=${encodeURIComponent(search)}` : ""}`
    ),
  getMonster: (index: string) => fetchApi<unknown>(`/srd/monsters/${index}`),
  importMonster: (index: string) =>
    fetchApi<Creature>(`/srd/monsters/${index}/import`, { method: "POST" }),
};

// Health check
export const healthApi = {
  check: () => fetchApi<{ status: string; version: string }>("/health"),
};

// Import API (file uploads use FormData)
async function uploadFile<T>(endpoint: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
    // Don't set Content-Type - browser sets it with boundary
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export interface OcrPreviewResult {
  name: string;
  ac?: number;
  hp_max?: number;
  dexterity?: number;
  strength?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  level?: number;
  character_class?: string;
  race?: string;
  creature_type?: string;
  size?: string;
  challenge_rating?: number;
  raw_extraction?: Record<string, unknown>;
}

export const importApi = {
  // OCR (screenshot) imports
  ocrPlayerPreview: (file: File) =>
    uploadFile<OcrPreviewResult>("/import/ocr/player/preview", file),
  ocrPlayer: (file: File) => uploadFile<Player>("/import/ocr/player", file),
  ocrCreaturePreview: (file: File) =>
    uploadFile<OcrPreviewResult>("/import/ocr/creature/preview", file),
  ocrCreature: (file: File) => uploadFile<Creature>("/import/ocr/creature", file),

  // PDF imports
  pdfPreview: (file: File) =>
    uploadFile<OcrPreviewResult>("/import/pdf/preview", file),
  pdfPlayer: (file: File) => uploadFile<Player>("/import/pdf", file),

  // D&D Beyond imports
  ddbPreview: (characterId: string) =>
    fetchApi<OcrPreviewResult>(`/import/dndbeyond/preview/${characterId}`),
  ddbImport: (characterId: string) =>
    fetchApi<Player>(`/import/dndbeyond/${characterId}`, { method: "POST" }),
};
