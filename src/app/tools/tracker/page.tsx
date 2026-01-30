"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  campaignsApi,
  encountersApi,
  playersApi,
  creaturesApi,
  srdApi,
  importApi,
  type SrdMonsterListItem,
  type OcrPreviewResult,
} from "@/lib/tracker/api";
import type {
  Campaign,
  CampaignDetail,
  Encounter,
  Player,
  Creature,
} from "@/lib/tracker/types";

// QuickAddModal for creating players and creatures
function QuickAddModal({
  type,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  type: "player" | "creature";
  onClose: () => void;
  onSubmit: (data: Partial<Player | Creature>) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("");
  const [ac, setAc] = useState("10");
  const [hp, setHp] = useState("10");
  const [dex, setDex] = useState("10");

  const handleSubmit = () => {
    if (!name.trim()) return;

    const data: Record<string, unknown> = {
      name: name.trim(),
      ac: parseInt(ac) || 10,
      dexterity: parseInt(dex) || 10,
    };

    if (type === "player") {
      data.hp_current = parseInt(hp) || 10;
      data.hp_max = parseInt(hp) || 10;
      data.initiative_bonus = Math.floor((parseInt(dex) - 10) / 2);
    } else {
      data.hp_max = parseInt(hp) || 10;
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-sm border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          New {type === "player" ? "Player" : "Creature"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
              placeholder={type === "player" ? "Character name" : "Creature name"}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  handleSubmit();
                }
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
                AC
              </label>
              <input
                type="number"
                value={ac}
                onChange={(e) => setAc(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
                HP
              </label>
              <input
                type="number"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
                DEX
              </label>
              <input
                type="number"
                value={dex}
                onChange={(e) => setDex(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating..." : `Add ${type === "player" ? "Player" : "Creature"}`}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// EditPlayerModal for editing existing players
function EditPlayerModal({
  player,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  player: Player;
  onClose: () => void;
  onSubmit: (data: Partial<Player>) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(player.name);
  const [ac, setAc] = useState(String(player.ac || 10));
  const [hpMax, setHpMax] = useState(String(player.hp_max || 10));
  const [hpCurrent, setHpCurrent] = useState(String(player.hp_current || player.hp_max || 10));
  const [level, setLevel] = useState(String(player.level || 1));
  const [charClass, setCharClass] = useState(player.character_class || "");
  const [race, setRace] = useState(player.race || "");
  const [str, setStr] = useState(String(player.strength || 10));
  const [dex, setDex] = useState(String(player.dexterity || 10));
  const [con, setCon] = useState(String(player.constitution || 10));
  const [int, setInt] = useState(String(player.intelligence || 10));
  const [wis, setWis] = useState(String(player.wisdom || 10));
  const [cha, setCha] = useState(String(player.charisma || 10));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      ac: parseInt(ac) || 10,
      hp_max: parseInt(hpMax) || 10,
      hp_current: parseInt(hpCurrent) || parseInt(hpMax) || 10,
      level: parseInt(level) || 1,
      character_class: charClass || undefined,
      race: race || undefined,
      strength: parseInt(str) || 10,
      dexterity: parseInt(dex) || 10,
      constitution: parseInt(con) || 10,
      intelligence: parseInt(int) || 10,
      wisdom: parseInt(wis) || 10,
      charisma: parseInt(cha) || 10,
      initiative_bonus: Math.floor((parseInt(dex) - 10) / 2),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Edit Player</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Race</label>
              <input
                type="text"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                placeholder="Human"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Class</label>
              <input
                type="text"
                value={charClass}
                onChange={(e) => setCharClass(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                placeholder="Fighter"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Level</label>
              <input
                type="number"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">AC</label>
              <input
                type="number"
                value={ac}
                onChange={(e) => setAc(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">HP Max</label>
              <input
                type="number"
                value={hpMax}
                onChange={(e) => setHpMax(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">HP Cur</label>
              <input
                type="number"
                value={hpCurrent}
                onChange={(e) => setHpCurrent(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Ability Scores</label>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: "STR", value: str, set: setStr },
                { label: "DEX", value: dex, set: setDex },
                { label: "CON", value: con, set: setCon },
                { label: "INT", value: int, set: setInt },
                { label: "WIS", value: wis, set: setWis },
                { label: "CHA", value: cha, set: setCha },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="block text-xs text-slate-500 mb-1 text-center">{label}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full px-1 py-2 bg-slate-900 border border-slate-700 rounded text-white text-center text-sm font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={onClose} className="px-4 py-3 text-slate-400 hover:text-white rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// EditCreatureModal for editing existing creatures
function EditCreatureModal({
  creature,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  creature: Creature;
  onClose: () => void;
  onSubmit: (data: Partial<Creature>) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(creature.name);
  const [ac, setAc] = useState(String(creature.ac || 10));
  const [hpMax, setHpMax] = useState(String(creature.hp_max || 10));
  const [creatureType, setCreatureType] = useState(creature.creature_type || "");
  const [size, setSize] = useState(creature.size || "Medium");
  const [cr, setCr] = useState(String(creature.challenge_rating || 0));
  const [str, setStr] = useState(String(creature.strength || 10));
  const [dex, setDex] = useState(String(creature.dexterity || 10));
  const [con, setCon] = useState(String(creature.constitution || 10));
  const [int, setInt] = useState(String(creature.intelligence || 10));
  const [wis, setWis] = useState(String(creature.wisdom || 10));
  const [cha, setCha] = useState(String(creature.charisma || 10));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      ac: parseInt(ac) || 10,
      hp_max: parseInt(hpMax) || 10,
      creature_type: creatureType || undefined,
      size: size || "Medium",
      challenge_rating: cr || undefined,
      strength: parseInt(str) || 10,
      dexterity: parseInt(dex) || 10,
      constitution: parseInt(con) || 10,
      intelligence: parseInt(int) || 10,
      wisdom: parseInt(wis) || 10,
      charisma: parseInt(cha) || 10,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Edit Creature</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
              >
                {["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Type</label>
              <input
                type="text"
                value={creatureType}
                onChange={(e) => setCreatureType(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                placeholder="Beast"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">CR</label>
              <input
                type="text"
                value={cr}
                onChange={(e) => setCr(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
                placeholder="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">AC</label>
              <input
                type="number"
                value={ac}
                onChange={(e) => setAc(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">HP</label>
              <input
                type="number"
                value={hpMax}
                onChange={(e) => setHpMax(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Ability Scores</label>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: "STR", value: str, set: setStr },
                { label: "DEX", value: dex, set: setDex },
                { label: "CON", value: con, set: setCon },
                { label: "INT", value: int, set: setInt },
                { label: "WIS", value: wis, set: setWis },
                { label: "CHA", value: cha, set: setCha },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="block text-xs text-slate-500 mb-1 text-center">{label}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full px-1 py-2 bg-slate-900 border border-slate-700 rounded text-white text-center text-sm font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={onClose} className="px-4 py-3 text-slate-400 hover:text-white rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// OCRImportModal for importing from screenshots
function OCRImportModal({
  mode,
  onClose,
  onSuccess,
}: {
  mode: "player" | "creature";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<OcrPreviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setError(null);
    setPreview(null);

    try {
      setIsLoading(true);
      const result = mode === "player"
        ? await importApi.ocrPlayerPreview(selectedFile)
        : await importApi.ocrCreaturePreview(selectedFile);
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    try {
      setIsImporting(true);
      if (mode === "player") {
        await importApi.ocrPlayer(file);
      } else {
        await importApi.ocrCreature(file);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-2 text-center">
          Import {mode === "player" ? "Player" : "Creature"} from Screenshot
        </h3>
        <p className="text-sm text-slate-400 text-center mb-6">
          Upload a screenshot of a {mode === "player" ? "character sheet" : "stat block"} to extract data using AI
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-full px-4 py-8 border-2 border-dashed border-slate-600 rounded-lg text-center cursor-pointer hover:border-amber-500 transition-colors">
              {file ? (
                <div>
                  <div className="text-white font-medium">{file.name}</div>
                  <div className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              ) : (
                <div className="text-slate-400">
                  Click to select an image or drag & drop
                </div>
              )}
            </div>
          </label>
        </div>

        {isLoading && (
          <div className="text-center py-4 text-slate-400">
            Analyzing image with AI...
          </div>
        )}

        {preview && (
          <div className="mb-4 p-4 bg-slate-900 rounded-lg">
            <h4 className="text-sm font-semibold text-amber-400 mb-3">Extracted Data</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Name</span>
                <span className="text-white font-medium">{preview.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AC</span>
                <span className="text-white">{preview.ac || 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HP</span>
                <span className="text-white">{preview.hp_max || 10}</span>
              </div>
              {mode === "player" && (
                <>
                  {preview.race && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Race</span>
                      <span className="text-white">{preview.race}</span>
                    </div>
                  )}
                  {preview.character_class && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class</span>
                      <span className="text-white">{preview.character_class}</span>
                    </div>
                  )}
                  {preview.level && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Level</span>
                      <span className="text-white">{preview.level}</span>
                    </div>
                  )}
                </>
              )}
              {mode === "creature" && (
                <>
                  {preview.creature_type && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="text-white">{preview.creature_type}</span>
                    </div>
                  )}
                  {preview.size && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Size</span>
                      <span className="text-white">{preview.size}</span>
                    </div>
                  )}
                  {preview.challenge_rating !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">CR</span>
                      <span className="text-white">{preview.challenge_rating}</span>
                    </div>
                  )}
                </>
              )}
              <div className="pt-2 border-t border-slate-700">
                <div className="grid grid-cols-6 gap-2 text-center">
                  {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((ability, i) => {
                    const keys = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
                    const value = preview[keys[i] as keyof OcrPreviewResult] as number || 10;
                    return (
                      <div key={ability}>
                        <div className="text-xs text-slate-500">{ability}</div>
                        <div className="text-white font-mono">{value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={!preview || isImporting}
            className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? "Importing..." : "Import"}
          </button>
          <button onClick={onClose} className="px-4 py-3 text-slate-400 hover:text-white rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// PDFImportModal for importing players from PDF character sheets
function PDFImportModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<OcrPreviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setError(null);
    setPreview(null);

    try {
      setIsLoading(true);
      const result = await importApi.pdfPreview(selectedFile);
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    try {
      setIsImporting(true);
      await importApi.pdfPlayer(file);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-2 text-center">Import Player from PDF</h3>
        <p className="text-sm text-slate-400 text-center mb-6">
          Upload a D&D character sheet PDF to extract player data
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block w-full">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-full px-4 py-8 border-2 border-dashed border-slate-600 rounded-lg text-center cursor-pointer hover:border-amber-500 transition-colors">
              {file ? (
                <div>
                  <div className="text-white font-medium">{file.name}</div>
                  <div className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              ) : (
                <div className="text-slate-400">
                  Click to select a PDF character sheet
                </div>
              )}
            </div>
          </label>
        </div>

        {isLoading && (
          <div className="text-center py-4 text-slate-400">
            Extracting data from PDF...
          </div>
        )}

        {preview && (
          <div className="mb-4 p-4 bg-slate-900 rounded-lg">
            <h4 className="text-sm font-semibold text-amber-400 mb-3">Extracted Data</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Name</span>
                <span className="text-white font-medium">{preview.name}</span>
              </div>
              {preview.race && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Race</span>
                  <span className="text-white">{preview.race}</span>
                </div>
              )}
              {preview.character_class && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Class</span>
                  <span className="text-white">{preview.character_class}</span>
                </div>
              )}
              {preview.level && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Level</span>
                  <span className="text-white">{preview.level}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">AC</span>
                <span className="text-white">{preview.ac || 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HP</span>
                <span className="text-white">{preview.hp_max || 10}</span>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <div className="grid grid-cols-6 gap-2 text-center">
                  {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((ability, i) => {
                    const keys = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
                    const value = preview[keys[i] as keyof OcrPreviewResult] as number || 10;
                    return (
                      <div key={ability}>
                        <div className="text-xs text-slate-500">{ability}</div>
                        <div className="text-white font-mono">{value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={!preview || isImporting}
            className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? "Importing..." : "Import Player"}
          </button>
          <button onClick={onClose} className="px-4 py-3 text-slate-400 hover:text-white rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// DDBImportModal for importing from D&D Beyond
function DDBImportModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<OcrPreviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characterId, setCharacterId] = useState<string | null>(null);

  const extractCharacterId = (value: string): string | null => {
    // Handle full URLs like https://www.dndbeyond.com/characters/12345678
    const urlMatch = value.match(/characters\/(\d+)/);
    if (urlMatch) return urlMatch[1];
    // Handle just the ID
    if (/^\d+$/.test(value.trim())) return value.trim();
    return null;
  };

  const handlePreview = async () => {
    const id = extractCharacterId(input);
    if (!id) {
      setError("Please enter a valid D&D Beyond character URL or ID");
      return;
    }
    setCharacterId(id);
    setError(null);
    setPreview(null);

    try {
      setIsLoading(true);
      const result = await importApi.ddbPreview(id);
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch character. Make sure the character is public.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!characterId) return;
    try {
      setIsImporting(true);
      await importApi.ddbImport(characterId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-2 text-center">Import from D&D Beyond</h3>
        <p className="text-sm text-slate-400 text-center mb-6">
          Enter a D&D Beyond character URL or ID to import
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Character URL or ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://www.dndbeyond.com/characters/12345678"
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handlePreview()}
            />
            <button
              onClick={handlePreview}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium disabled:opacity-40 transition-colors"
            >
              {isLoading ? "..." : "Preview"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            The character must be set to public on D&D Beyond
          </p>
        </div>

        {preview && (
          <div className="mb-4 p-4 bg-slate-900 rounded-lg">
            <h4 className="text-sm font-semibold text-amber-400 mb-3">Character Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Name</span>
                <span className="text-white font-medium">{preview.name}</span>
              </div>
              {preview.race && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Race</span>
                  <span className="text-white">{preview.race}</span>
                </div>
              )}
              {preview.character_class && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Class</span>
                  <span className="text-white">{preview.character_class}</span>
                </div>
              )}
              {preview.level && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Level</span>
                  <span className="text-white">{preview.level}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">AC</span>
                <span className="text-white">{preview.ac || 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HP</span>
                <span className="text-white">{preview.hp_max || 10}</span>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <div className="grid grid-cols-6 gap-2 text-center">
                  {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((ability, i) => {
                    const keys = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
                    const value = preview[keys[i] as keyof OcrPreviewResult] as number || 10;
                    return (
                      <div key={ability}>
                        <div className="text-xs text-slate-500">{ability}</div>
                        <div className="text-white font-mono">{value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={!preview || isImporting}
            className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? "Importing..." : "Import Character"}
          </button>
          <button onClick={onClose} className="px-4 py-3 text-slate-400 hover:text-white rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// EncounterSetupModal for adding combatants before combat
function EncounterSetupModal({
  encounter,
  players,
  creatures,
  onAddCombatant,
  onRemoveCombatant,
  onClose,
  onStartCombat,
}: {
  encounter: Encounter;
  players: Player[];
  creatures: Creature[];
  onAddCombatant: (entityType: string, entityId: string, quantity?: number) => void;
  onRemoveCombatant: (combatantId: string) => void;
  onClose: () => void;
  onStartCombat: () => void;
}) {
  const [creatureQuantities, setCreatureQuantities] = useState<Record<string, number>>({});
  const [creatureSearch, setCreatureSearch] = useState("");

  const filteredCreatures = creatures.filter((c) =>
    c.name.toLowerCase().includes(creatureSearch.toLowerCase())
  );

  const existingPlayerIds = new Set(
    encounter.combatants?.filter((c) => c.entity_type === "player").map((c) => c.entity_id) || []
  );

  const creatureCounts: Record<string, number> = {};
  encounter.combatants?.filter((c) => c.entity_type === "creature").forEach((c) => {
    creatureCounts[c.entity_id] = (creatureCounts[c.entity_id] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Setup: {encounter.name}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Current Combatants */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-amber-400 mb-2">
            In Encounter ({encounter.combatants?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-2">
            {encounter.combatants?.map((c) => {
              const entity =
                c.entity_type === "player"
                  ? players.find((p) => p.id === c.entity_id)
                  : creatures.find((cr) => cr.id === c.entity_id);
              return (
                <span
                  key={c.id}
                  className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
                    c.entity_type === "player"
                      ? "bg-blue-600/20 text-blue-300"
                      : "bg-red-600/20 text-red-300"
                  }`}
                >
                  {c.display_name || entity?.name || "Unknown"}
                  <button
                    onClick={() => onRemoveCombatant(c.id)}
                    className="ml-1 hover:text-white"
                    title="Remove from encounter"
                  >
                    &times;
                  </button>
                </span>
              );
            })}
            {(!encounter.combatants || encounter.combatants.length === 0) && (
              <span className="text-slate-500 text-sm">
                No combatants yet. Add players and creatures below.
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4">
          {/* Available Players */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Players</h4>
            <div className="space-y-2">
              {players.map((player) => {
                const alreadyAdded = existingPlayerIds.has(player.id);
                return (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg flex justify-between items-center ${
                      alreadyAdded
                        ? "bg-blue-600/10 border border-blue-600/30"
                        : "bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-white">{player.name}</div>
                      <div className="text-xs text-slate-500">
                        AC {player.ac} | HP {player.hp_max}
                      </div>
                    </div>
                    {!alreadyAdded ? (
                      <button
                        onClick={() => onAddCombatant("player", player.id)}
                        className="px-3 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded"
                      >
                        Add
                      </button>
                    ) : (
                      <span className="text-xs text-blue-400">Added</span>
                    )}
                  </div>
                );
              })}
              {players.length === 0 && (
                <p className="text-slate-500 text-xs">No players created yet.</p>
              )}
            </div>
          </div>

          {/* Available Creatures */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Creatures</h4>
            <input
              type="text"
              value={creatureSearch}
              onChange={(e) => setCreatureSearch(e.target.value)}
              placeholder="Search creatures..."
              className="w-full px-3 py-2 mb-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
            />
            <div className="space-y-2">
              {filteredCreatures.map((creature) => {
                const count = creatureCounts[creature.id] || 0;
                const quantity = creatureQuantities[creature.id] || 1;
                return (
                  <div
                    key={creature.id}
                    className={`p-3 rounded-lg ${
                      count > 0 ? "bg-red-600/10 border border-red-600/30" : "bg-slate-900"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm text-white">{creature.name}</div>
                        <div className="text-xs text-slate-500">
                          AC {creature.ac} | HP {creature.hp_max}
                          {count > 0 && (
                            <span className="text-red-400 ml-2">({count} in encounter)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={quantity}
                        onChange={(e) =>
                          setCreatureQuantities({
                            ...creatureQuantities,
                            [creature.id]: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)),
                          })
                        }
                        className="w-14 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-center text-white"
                      />
                      <button
                        onClick={() => {
                          onAddCombatant("creature", creature.id, quantity);
                          setCreatureQuantities({ ...creatureQuantities, [creature.id]: 1 });
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded"
                      >
                        Add {quantity > 1 ? `${quantity}x` : ""}
                      </button>
                    </div>
                  </div>
                );
              })}
              {creatures.length === 0 && (
                <p className="text-slate-500 text-xs">No creatures created yet.</p>
              )}
              {creatures.length > 0 && filteredCreatures.length === 0 && (
                <p className="text-slate-500 text-xs">No creatures match "{creatureSearch}"</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={onStartCombat}
            disabled={!encounter.combatants || encounter.combatants.length === 0}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Combat
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete confirmation modal
function DeleteConfirmModal({
  type,
  name,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  type: string;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-sm border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-2 text-center">Delete {type}?</h3>
        <p className="text-slate-400 text-center mb-6 text-sm">
          <span className="text-white font-medium">{name}</span> will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// New Campaign Modal
function NewCampaignModal({
  onClose,
  onSubmit,
  isSubmitting,
}: {
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-sm border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6 text-center">New Campaign</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
              placeholder="Campaign name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  onSubmit(name.trim(), description.trim() || undefined);
                }
              }}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none resize-none"
              placeholder="Campaign description"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSubmit(name.trim(), description.trim() || undefined)}
            disabled={!name.trim() || isSubmitting}
            className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Campaign"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Player Detail Modal
function PlayerDetailModal({
  player,
  onClose,
  onEdit,
}: {
  player: Player;
  onClose: () => void;
  onEdit: () => void;
}) {
  const mod = (score: number | undefined) => {
    if (score === undefined) return "+0";
    const m = Math.floor((score - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-amber-400">{player.name}</h3>
            <p className="text-sm text-slate-400 italic">
              {player.race && `${player.race} `}
              {player.character_class && `${player.character_class} `}
              {player.level && `Level ${player.level}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Combat Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 uppercase">AC</div>
            <div className="text-xl font-bold text-white">{player.ac}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 uppercase">HP</div>
            <div className="text-xl font-bold text-white">
              {player.hp_current}/{player.hp_max}
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 uppercase">Init</div>
            <div className="text-xl font-bold text-white">
              {player.initiative_bonus !== undefined && player.initiative_bonus >= 0 ? "+" : ""}
              {player.initiative_bonus ?? 0}
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 uppercase">Speed</div>
            <div className="text-xl font-bold text-white">{player.speed ?? 30} ft</div>
          </div>
        </div>

        {/* Ability Scores */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">
            Ability Scores
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {[
              { name: "STR", value: player.strength },
              { name: "DEX", value: player.dexterity },
              { name: "CON", value: player.constitution },
              { name: "INT", value: player.intelligence },
              { name: "WIS", value: player.wisdom },
              { name: "CHA", value: player.charisma },
            ].map((stat) => (
              <div key={stat.name} className="bg-slate-900 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500">{stat.name}</div>
                <div className="text-lg font-bold text-white">{stat.value ?? 10}</div>
                <div className="text-xs text-amber-400">{mod(stat.value)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Proficiency & Passive Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-xs text-slate-500 uppercase">Proficiency Bonus</div>
            <div className="font-bold text-white">+{player.proficiency_bonus ?? 2}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-xs text-slate-500 uppercase">Passive Perception</div>
            <div className="font-bold text-white">{player.passive_perception ?? 10}</div>
          </div>
        </div>

        {/* Skills */}
        {player.skills && Object.keys(player.skills).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wide border-b border-slate-700 pb-1">
              Skills
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(player.skills)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([skill, bonus]) => (
                  <div key={skill} className="flex justify-between text-sm py-1">
                    <span className="text-slate-400 capitalize">
                      {skill.replace(/_/g, " ")}
                    </span>
                    <span className="font-mono text-amber-400">
                      {(bonus as number) >= 0 ? "+" : ""}
                      {bonus as number}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Saving Throws */}
        {player.saving_throws && Object.keys(player.saving_throws).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wide border-b border-slate-700 pb-1">
              Saving Throws
            </h4>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              {Object.entries(player.saving_throws)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([save, bonus]) => (
                  <div key={save} className="flex justify-between text-sm py-1">
                    <span className="text-slate-400 uppercase">{save.slice(0, 3)}</span>
                    <span className="font-mono text-amber-400">
                      {(bonus as number) >= 0 ? "+" : ""}
                      {bonus as number}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Spell Slots */}
        {player.spell_slots && Object.keys(player.spell_slots).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wide border-b border-slate-700 pb-1">
              Spell Slots
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(player.spell_slots)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([level, count]) => (
                  <div
                    key={level}
                    className="bg-slate-900 rounded px-3 py-1.5 text-sm"
                  >
                    <span className="text-slate-400">Lvl {level}:</span>{" "}
                    <span className="text-white font-mono">{count as number}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-700 flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Creature Detail Modal
function CreatureDetailModal({
  creature,
  onClose,
  onEdit,
}: {
  creature: Creature;
  onClose: () => void;
  onEdit: () => void;
}) {
  const mod = (score: number | undefined) => {
    if (score === undefined) return "+0";
    const m = Math.floor((score - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-red-400">{creature.name}</h3>
            <p className="text-sm text-slate-400 italic">
              {creature.size} {creature.creature_type}
              {creature.alignment && `, ${creature.alignment}`}
            </p>
            {creature.challenge_rating && (
              <p className="text-sm text-amber-400 mt-1">
                Challenge Rating {creature.challenge_rating}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Combat Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 uppercase">AC</div>
            <div className="text-xl font-bold text-white">{creature.ac}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 uppercase">HP</div>
            <div className="text-xl font-bold text-white">{creature.hp_max}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 uppercase">Speed</div>
            <div className="text-xl font-bold text-white">{creature.speed ?? 30} ft</div>
          </div>
        </div>

        {/* Ability Scores */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">
            Ability Scores
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {[
              { name: "STR", value: creature.strength },
              { name: "DEX", value: creature.dexterity },
              { name: "CON", value: creature.constitution },
              { name: "INT", value: creature.intelligence },
              { name: "WIS", value: creature.wisdom },
              { name: "CHA", value: creature.charisma },
            ].map((stat) => (
              <div key={stat.name} className="bg-slate-900 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500">{stat.name}</div>
                <div className="text-lg font-bold text-white">{stat.value ?? 10}</div>
                <div className="text-xs text-red-400">{mod(stat.value)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Legendary Actions */}
        {creature.legendary_actions !== undefined && creature.legendary_actions > 0 && (
          <div className="bg-slate-900 rounded-lg p-3 mb-4">
            <div className="text-xs text-slate-500 uppercase">Legendary Actions</div>
            <div className="font-bold text-amber-400">{creature.legendary_actions} per round</div>
          </div>
        )}

        {/* Resistances & Immunities */}
        {(creature.damage_resistances?.length || creature.damage_immunities?.length || creature.condition_immunities?.length) && (
          <div className="space-y-2 mb-4">
            {creature.damage_resistances && creature.damage_resistances.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-3">
                <div className="text-xs text-slate-500 uppercase mb-1">Damage Resistances</div>
                <div className="text-sm text-slate-300">{creature.damage_resistances.join(", ")}</div>
              </div>
            )}
            {creature.damage_immunities && creature.damage_immunities.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-3">
                <div className="text-xs text-slate-500 uppercase mb-1">Damage Immunities</div>
                <div className="text-sm text-slate-300">{creature.damage_immunities.join(", ")}</div>
              </div>
            )}
            {creature.condition_immunities && creature.condition_immunities.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-3">
                <div className="text-xs text-slate-500 uppercase mb-1">Condition Immunities</div>
                <div className="text-sm text-slate-300">{creature.condition_immunities.join(", ")}</div>
              </div>
            )}
          </div>
        )}

        {/* Senses */}
        {creature.senses && Object.keys(creature.senses).length > 0 && (
          <div className="bg-slate-900 rounded-lg p-3 mb-4">
            <div className="text-xs text-slate-500 uppercase mb-1">Senses</div>
            <div className="text-sm text-slate-300">
              {Object.entries(creature.senses)
                .map(([sense, value]) => `${sense.replace(/_/g, " ")} ${value} ft.`)
                .join(", ")}
            </div>
          </div>
        )}

        {/* Languages */}
        {creature.languages && creature.languages.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-3 mb-4">
            <div className="text-xs text-slate-500 uppercase mb-1">Languages</div>
            <div className="text-sm text-slate-300">{creature.languages.join(", ")}</div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-700 flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// SRD Browser Modal
function SrdBrowserModal({
  onClose,
  onImportSuccess,
}: {
  onClose: () => void;
  onImportSuccess: () => void;
}) {
  const [search, setSearch] = useState("");
  const [monsters, setMonsters] = useState<SrdMonsterListItem[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null);
  const [monsterDetails, setMonsterDetails] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [importing, setImporting] = useState<Set<string>>(new Set());

  // Load monsters on mount and when search changes
  useEffect(() => {
    const loadMonsters = async () => {
      setIsLoading(true);
      try {
        const data = await srdApi.listMonsters(search || undefined);
        setMonsters(data.results);
      } catch {
        setMonsters([]);
      } finally {
        setIsLoading(false);
      }
    };
    const debounce = setTimeout(loadMonsters, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  // Load monster details when selected
  useEffect(() => {
    if (!selectedMonster) {
      setMonsterDetails(null);
      return;
    }
    const loadDetails = async () => {
      try {
        const data = await srdApi.getMonster(selectedMonster);
        setMonsterDetails(data as Record<string, unknown>);
      } catch {
        setMonsterDetails(null);
      }
    };
    loadDetails();
  }, [selectedMonster]);

  const handleImport = async (index: string) => {
    setImporting((prev) => new Set(prev).add(index));
    try {
      await srdApi.importMonster(index);
      onImportSuccess();
    } finally {
      setImporting((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const formatCR = (cr: number | string) => {
    if (cr === 0.125) return "1/8";
    if (cr === 0.25) return "1/4";
    if (cr === 0.5) return "1/2";
    return String(cr);
  };

  const mod = (score: number) => {
    const m = Math.floor((score - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  const details = monsterDetails as Record<string, unknown> | null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-white">SRD Monster Database</h3>
            <p className="text-xs text-slate-400">322 monsters from the D&D 5e SRD</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-700">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search monsters..."
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
            autoFocus
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Monster List */}
          <div className="w-1/3 border-r border-slate-700 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-slate-400">Loading...</div>
            ) : (
              <div className="divide-y divide-slate-700">
                {monsters.map((monster) => (
                  <button
                    key={monster.index}
                    onClick={() => setSelectedMonster(monster.index)}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors ${
                      selectedMonster === monster.index ? "bg-slate-700" : ""
                    }`}
                  >
                    <div className="font-medium text-white">{monster.name}</div>
                  </button>
                ))}
                {monsters.length === 0 && (
                  <div className="p-4 text-center text-slate-400">No monsters found</div>
                )}
              </div>
            )}
          </div>

          {/* Monster Details */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedMonster && details ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-red-400">{details.name as string}</h4>
                    <p className="text-sm text-slate-400">
                      {details.size as string} {details.type as string}
                      {details.subtype && ` (${details.subtype})`}, {details.alignment as string}
                    </p>
                  </div>
                  <button
                    onClick={() => handleImport(selectedMonster)}
                    disabled={importing.has(selectedMonster)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {importing.has(selectedMonster) ? "Importing..." : "Import"}
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-xs text-slate-500 uppercase">AC</div>
                    <div className="text-lg font-bold text-white">
                      {(details.armor_class as Array<{value: number}>)?.[0]?.value || 10}
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-xs text-slate-500 uppercase">HP</div>
                    <div className="text-lg font-bold text-white">{details.hit_points as number}</div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-xs text-slate-500 uppercase">CR</div>
                    <div className="text-lg font-bold text-amber-400">
                      {formatCR(details.challenge_rating as number)}
                    </div>
                  </div>
                </div>

                {/* Ability Scores */}
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map(
                    (ability) => (
                      <div key={ability} className="bg-slate-900 rounded-lg p-2 text-center">
                        <div className="text-xs text-slate-500 uppercase">{ability.slice(0, 3)}</div>
                        <div className="font-bold text-white">{details[ability] as number}</div>
                        <div className="text-xs text-slate-400">{mod(details[ability] as number)}</div>
                      </div>
                    )
                  )}
                </div>

                {/* Actions */}
                {(details.actions as Array<{name: string; desc: string}>)?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-red-400 mb-2">Actions</div>
                    {(details.actions as Array<{name: string; desc: string}>).map((action, i) => (
                      <div key={i} className="mb-2 text-sm text-slate-300">
                        <span className="font-semibold text-white">{action.name}.</span> {action.desc}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Select a monster to view details
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-between items-center">
          <div className="text-xs text-slate-500">Data from dnd5eapi.co (SRD content only)</div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Player to Campaign Modal
function AddPlayerToCampaignModal({
  campaign,
  allPlayers,
  campaignPlayerIds,
  onAddPlayer,
  onRemovePlayer,
  onClose,
}: {
  campaign: CampaignDetail;
  allPlayers: Player[];
  campaignPlayerIds: string[];
  onAddPlayer: (playerId: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onClose: () => void;
}) {
  const availablePlayers = allPlayers.filter((p) => !campaignPlayerIds.includes(p.id));
  const campaignPlayers = allPlayers.filter((p) => campaignPlayerIds.includes(p.id));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Manage Players: {campaign.name}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Current Players in Campaign */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-amber-400 mb-2">
            In Campaign ({campaignPlayers.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {campaignPlayers.map((player) => (
              <div
                key={player.id}
                className="p-2 bg-slate-900 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-sm text-white">{player.name}</div>
                  <div className="text-xs text-slate-500">
                    {player.character_class ? `Level ${player.level} ${player.character_class}` : "No class"}
                  </div>
                </div>
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            {campaignPlayers.length === 0 && (
              <p className="text-slate-500 text-sm">No players in this campaign yet.</p>
            )}
          </div>
        </div>

        {/* Available Players */}
        <div className="flex-1 overflow-y-auto">
          <h4 className="text-sm font-semibold text-slate-400 mb-2">
            Available Players ({availablePlayers.length})
          </h4>
          <div className="space-y-2">
            {availablePlayers.map((player) => (
              <div
                key={player.id}
                className="p-2 bg-slate-900 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-sm text-white">{player.name}</div>
                  <div className="text-xs text-slate-500">
                    {player.character_class ? `Level ${player.level} ${player.character_class}` : "No class"}
                  </div>
                </div>
                <button
                  onClick={() => onAddPlayer(player.id)}
                  className="px-3 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
                >
                  Add
                </button>
              </div>
            ))}
            {availablePlayers.length === 0 && (
              <p className="text-slate-500 text-sm">All players are in this campaign.</p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// EncounterHistoryModal for viewing combat logs of archived encounters
function EncounterHistoryModal({
  encounter,
  onClose,
}: {
  encounter: Encounter;
  onClose: () => void;
}) {
  const [combatLog, setCombatLog] = useState<import("@/lib/tracker/types").CombatLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLog() {
      try {
        const log = await encountersApi.getCombatLog(encounter.id, 500);
        setCombatLog(log);
      } catch {
        // Silently fail - show empty log
      } finally {
        setIsLoading(false);
      }
    }
    loadLog();
  }, [encounter.id]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "damage":
        return "⚔️";
      case "heal":
        return "💚";
      case "condition":
        return "✨";
      case "turn":
        return "➡️";
      case "death_save":
        return "💀";
      case "legendary":
        return "⭐";
      case "lair":
        return "🏰";
      case "initiative":
        return "🎲";
      default:
        return "📝";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-2xl border border-slate-700 max-h-[85vh] flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{encounter.name}</h3>
              <p className="text-sm text-slate-400 mt-1">
                Completed &bull; {encounter.round_number} rounds &bull;{" "}
                {encounter.combatants.length} combatants
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">
            Combat Log
          </h4>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : combatLog.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No combat log entries recorded.
            </div>
          ) : (
            <div className="space-y-2">
              {combatLog.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
                >
                  <span className="text-lg" title={entry.event_type}>
                    {getEventIcon(entry.event_type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{entry.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {entry.round_number !== undefined && `Round ${entry.round_number}`}
                      {entry.round_number !== undefined && entry.turn_index !== undefined && " • "}
                      {formatTimestamp(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TrackerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [activeTab, setActiveTab] = useState<
    "encounters" | "campaigns" | "players" | "creatures"
  >("encounters");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showNewEncounter, setShowNewEncounter] = useState(false);
  const [newEncounterName, setNewEncounterName] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState<"player" | "creature" | null>(null);
  const [setupEncounterId, setSetupEncounterId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "player" | "creature" | "encounter" | "campaign";
    id: string;
    name: string;
  } | null>(null);

  // Campaign states
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [activeCampaign, setActiveCampaign] = useState<CampaignDetail | null>(null);
  const [campaignPlayers, setCampaignPlayers] = useState<Player[]>([]);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showAddPlayerToCampaign, setShowAddPlayerToCampaign] = useState(false);

  // Detail view states
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [viewingCreature, setViewingCreature] = useState<Creature | null>(null);

  // Import modals
  const [showSrdBrowser, setShowSrdBrowser] = useState(false);
  const [showOcrImport, setShowOcrImport] = useState<"player" | "creature" | null>(null);
  const [showPdfImport, setShowPdfImport] = useState(false);
  const [showDdbImport, setShowDdbImport] = useState(false);

  // Edit modals
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingCreature, setEditingCreature] = useState<Creature | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Loading states for mutations
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Archive/History states
  const [showArchived, setShowArchived] = useState(false);
  const [viewingEncounterHistory, setViewingEncounterHistory] = useState<Encounter | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [campaignsData, encountersData, playersData, creaturesData] =
        await Promise.all([
          campaignsApi.list(),
          encountersApi.list(),
          playersApi.list(),
          creaturesApi.list(),
        ]);
      setCampaigns(campaignsData);
      setEncounters(encountersData);
      setPlayers(playersData);
      setCreatures(creaturesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load active campaign details when campaign is selected
  useEffect(() => {
    async function loadCampaignData() {
      if (!activeCampaignId) {
        setActiveCampaign(null);
        setCampaignPlayers([]);
        return;
      }
      try {
        const [campaignData, playersData] = await Promise.all([
          campaignsApi.get(activeCampaignId),
          campaignsApi.listPlayers(activeCampaignId),
        ]);
        setActiveCampaign(campaignData);
        setCampaignPlayers(playersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load campaign");
        setActiveCampaignId(null);
      }
    }
    loadCampaignData();
  }, [activeCampaignId]);

  // Create campaign
  const handleCreateCampaign = async (name: string, description?: string) => {
    try {
      setIsCreating(true);
      await campaignsApi.create({ name, description });
      setShowNewCampaign(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setIsCreating(false);
    }
  };

  // Add player to campaign
  const handleAddPlayerToCampaign = async (playerId: string) => {
    if (!activeCampaignId) return;
    try {
      await campaignsApi.addPlayer(activeCampaignId, playerId);
      // Reload campaign players
      const playersData = await campaignsApi.listPlayers(activeCampaignId);
      setCampaignPlayers(playersData);
      // Reload campaign to get updated counts
      const campaignData = await campaignsApi.get(activeCampaignId);
      setActiveCampaign(campaignData);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add player to campaign");
    }
  };

  // Remove player from campaign
  const handleRemovePlayerFromCampaign = async (playerId: string) => {
    if (!activeCampaignId) return;
    try {
      await campaignsApi.removePlayer(activeCampaignId, playerId);
      // Reload campaign players
      const playersData = await campaignsApi.listPlayers(activeCampaignId);
      setCampaignPlayers(playersData);
      // Reload campaign to get updated counts
      const campaignData = await campaignsApi.get(activeCampaignId);
      setActiveCampaign(campaignData);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove player from campaign");
    }
  };

  // Create encounter (optionally within a campaign)
  const handleCreateEncounter = async () => {
    if (!newEncounterName.trim()) return;
    try {
      setIsCreating(true);
      await encountersApi.create({
        name: newEncounterName.trim(),
        campaign_id: activeCampaignId || undefined,
      });
      setNewEncounterName("");
      setShowNewEncounter(false);
      await loadData();
      // Reload campaign data if in campaign view
      if (activeCampaignId) {
        const campaignData = await campaignsApi.get(activeCampaignId);
        setActiveCampaign(campaignData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create encounter");
    } finally {
      setIsCreating(false);
    }
  };

  // Create player/creature
  const handleQuickAdd = async (data: Partial<Player | Creature>) => {
    try {
      setIsCreating(true);
      if (showQuickAdd === "player") {
        await playersApi.create(data as Omit<Player, "id">);
      } else {
        await creaturesApi.create(data as Omit<Creature, "id">);
      }
      setShowQuickAdd(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setIsCreating(false);
    }
  };

  // Edit player
  const handleEditPlayer = async (data: Partial<Player>) => {
    if (!editingPlayer) return;
    try {
      setIsEditing(true);
      await playersApi.update(editingPlayer.id, data);
      setEditingPlayer(null);
      setViewingPlayer(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update player");
    } finally {
      setIsEditing(false);
    }
  };

  // Edit creature
  const handleEditCreature = async (data: Partial<Creature>) => {
    if (!editingCreature) return;
    try {
      setIsEditing(true);
      await creaturesApi.update(editingCreature.id, data);
      setEditingCreature(null);
      setViewingCreature(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update creature");
    } finally {
      setIsEditing(false);
    }
  };

  // Add/remove combatants from encounter
  const handleAddCombatant = async (
    entityType: string,
    entityId: string,
    quantity?: number
  ) => {
    if (!setupEncounterId) return;
    try {
      await encountersApi.addCombatant(setupEncounterId, {
        entity_type: entityType,
        entity_id: entityId,
        quantity,
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add combatant");
    }
  };

  const handleRemoveCombatant = async (combatantId: string) => {
    if (!setupEncounterId) return;
    try {
      await encountersApi.removeCombatant(setupEncounterId, combatantId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove combatant");
    }
  };

  // Delete entity
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      switch (deleteConfirm.type) {
        case "player":
          await playersApi.delete(deleteConfirm.id);
          break;
        case "creature":
          await creaturesApi.delete(deleteConfirm.id);
          break;
        case "encounter":
          await encountersApi.delete(deleteConfirm.id);
          break;
        case "campaign":
          await campaignsApi.delete(deleteConfirm.id);
          // Clear active campaign if we deleted the current one
          if (activeCampaignId === deleteConfirm.id) {
            setActiveCampaignId(null);
            setActiveCampaign(null);
            setCampaignPlayers([]);
          }
          break;
      }
      setDeleteConfirm(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "preparing":
        return "text-yellow-400";
      case "completed":
        return "text-slate-500";
      default:
        return "text-slate-400";
    }
  };

  const setupEncounter = encounters.find((e) => e.id === setupEncounterId);

  // Filter encounters by campaign and archive status
  const filteredByCampaign = activeCampaignId
    ? encounters.filter((e) => e.campaign_id === activeCampaignId)
    : encounters;

  const activeEncounters = filteredByCampaign.filter((e) => e.status !== "completed");
  const archivedEncounters = filteredByCampaign.filter((e) => e.status === "completed");
  const displayedEncounters = showArchived ? archivedEncounters : activeEncounters;

  // Archive/restore encounter
  const handleArchiveEncounter = async (encounterId: string) => {
    try {
      setIsArchiving(true);
      await encountersApi.update(encounterId, { status: "completed" });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive encounter");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleRestoreEncounter = async (encounterId: string) => {
    try {
      setIsArchiving(true);
      await encountersApi.update(encounterId, { status: "preparing" });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore encounter");
    } finally {
      setIsArchiving(false);
    }
  };

  // Players to show in encounter setup (campaign players if in campaign, all players otherwise)
  const setupPlayers = setupEncounter?.campaign_id
    ? campaignPlayers
    : players;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/"
                className="text-amber-400 hover:text-amber-300 text-sm"
              >
                &larr; Back to Exilium
              </Link>
              <h1 className="text-2xl font-bold text-white mt-1">
                Initiative Tracker
              </h1>
            </div>
            <div className="text-right">
              {authLoading ? (
                <span className="text-slate-500 text-sm">Loading...</span>
              ) : user ? (
                <div className="text-sm">
                  <span className="text-slate-400">Signed in as </span>
                  <span className="text-slate-200">{user.email}</span>
                  <p className="text-green-400 text-xs mt-1">
                    Data will be saved
                  </p>
                </div>
              ) : (
                <div className="text-sm">
                  <Link
                    href="/auth/login"
                    className="text-amber-400 hover:text-amber-300"
                  >
                    Sign in
                  </Link>
                  <span className="text-slate-500"> to save your data</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-4">
            {[
              {
                id: "encounters" as const,
                label: "Encounters",
                count: encounters.length,
              },
              {
                id: "campaigns" as const,
                label: "Campaigns",
                count: campaigns.length,
              },
              {
                id: "players" as const,
                label: "Players",
                count: players.length,
              },
              {
                id: "creatures" as const,
                label: "Creatures",
                count: creatures.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Campaign Navigation */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 uppercase tracking-wide mr-2">View:</span>
            <button
              onClick={() => setActiveCampaignId(null)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !activeCampaignId
                  ? "bg-amber-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Library
            </button>
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => setActiveCampaignId(campaign.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCampaignId === campaign.id
                    ? "bg-amber-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {campaign.name}
              </button>
            ))}
            <button
              onClick={() => setShowNewCampaign(true)}
              className="px-3 py-1.5 rounded-lg text-sm bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
              title="Create new campaign"
            >
              + Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Context Bar */}
      {activeCampaign && (
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{activeCampaign.name}</h2>
                {activeCampaign.description && (
                  <p className="text-sm text-slate-400">{activeCampaign.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  {activeCampaign.player_count} players &bull; {activeCampaign.encounter_count} encounters
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddPlayerToCampaign(true)}
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
                >
                  Manage Players
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      type: "campaign",
                      id: activeCampaign.id,
                      name: activeCampaign.name,
                    })
                  }
                  className="px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete campaign"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-red-300">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">
            Loading tracker data...
          </div>
        ) : (
          <>
            {/* Encounters Tab */}
            {activeTab === "encounters" && (
              <div>
                {/* Header with Archive Toggle */}
                <div className="mb-6 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowArchived(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        !showArchived
                          ? "bg-amber-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      Active ({activeEncounters.length})
                    </button>
                    <button
                      onClick={() => setShowArchived(true)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        showArchived
                          ? "bg-slate-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      Archived ({archivedEncounters.length})
                    </button>
                  </div>
                  {!showArchived && (
                    <button
                      onClick={() => setShowNewEncounter(true)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
                    >
                      + New Encounter
                    </button>
                  )}
                </div>

                {/* New Encounter Form (inline) */}
                {showNewEncounter && (
                  <div className="mb-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
                    <input
                      type="text"
                      value={newEncounterName}
                      onChange={(e) => setNewEncounterName(e.target.value)}
                      placeholder="Encounter name"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-3 focus:border-amber-500 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newEncounterName.trim()) {
                          handleCreateEncounter();
                        }
                        if (e.key === "Escape") {
                          setShowNewEncounter(false);
                          setNewEncounterName("");
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleCreateEncounter}
                        disabled={!newEncounterName.trim() || isCreating}
                        className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {isCreating ? "Creating..." : "Create"}
                      </button>
                      <button
                        onClick={() => {
                          setShowNewEncounter(false);
                          setNewEncounterName("");
                        }}
                        className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {displayedEncounters.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                      <p className="mb-4">
                        {showArchived
                          ? "No archived encounters yet."
                          : activeCampaignId
                            ? "No active encounters in this campaign."
                            : "No active encounters yet."}
                      </p>
                      {!showArchived && (
                        <button
                          onClick={() => setShowNewEncounter(true)}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          Create your first encounter
                        </button>
                      )}
                    </div>
                  ) : (
                    displayedEncounters.map((encounter) => (
                      <div
                        key={encounter.id}
                        className={`bg-slate-800 rounded-lg p-4 border transition-colors group ${
                          showArchived
                            ? "border-slate-700/50 opacity-80 hover:opacity-100"
                            : "border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-white">
                            {encounter.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm ${getStatusColor(
                                encounter.status
                              )}`}
                            >
                              {showArchived ? "archived" : encounter.status}
                            </span>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: "encounter",
                                  id: encounter.id,
                                  name: encounter.name,
                                })
                              }
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                              title="Delete encounter"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-slate-400 mb-3">
                          {encounter.round_number} rounds &bull;{" "}
                          {encounter.combatants.length} combatants
                        </div>
                        {showArchived ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setViewingEncounterHistory(encounter)}
                              className="flex-1 px-3 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                              View History
                            </button>
                            <button
                              onClick={() => handleRestoreEncounter(encounter.id)}
                              disabled={isArchiving}
                              className="flex-1 px-3 py-2 text-sm text-amber-400 hover:text-amber-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Restore
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSetupEncounterId(encounter.id)}
                              className="flex-1 px-3 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                              Setup
                            </button>
                            <Link
                              href={`/tools/tracker/encounter/${encounter.id}`}
                              className="flex-1 px-3 py-2 text-sm text-center bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                            >
                              Run
                            </Link>
                            <button
                              onClick={() => handleArchiveEncounter(encounter.id)}
                              disabled={isArchiving}
                              className="opacity-0 group-hover:opacity-100 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all disabled:opacity-50"
                              title="Archive encounter"
                            >
                              Archive
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === "campaigns" && (
              <div>
                {/* New Campaign Button */}
                <div className="mb-6 flex justify-end">
                  <button
                    onClick={() => setShowNewCampaign(true)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
                  >
                    + New Campaign
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    <p className="mb-4">No campaigns yet.</p>
                    <button
                      onClick={() => setShowNewCampaign(true)}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      Create your first campaign
                    </button>
                  </div>
                ) : (
                  campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="bg-slate-800 rounded-lg p-4 border border-slate-700 group"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white mb-2">
                          {campaign.name}
                        </h3>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: "campaign",
                              id: campaign.id,
                              name: campaign.name,
                            })
                          }
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                          title="Delete campaign"
                        >
                          &times;
                        </button>
                      </div>
                      {campaign.description && (
                        <p className="text-sm text-slate-400 mb-2">
                          {campaign.description}
                        </p>
                      )}
                      <div className="text-sm text-slate-500 mb-3">
                        {campaign.player_count} players &bull;{" "}
                        {campaign.encounter_count} encounters
                      </div>
                      <button
                        onClick={() => {
                          setActiveCampaignId(campaign.id);
                          setActiveTab("encounters");
                        }}
                        className="w-full px-3 py-2 text-sm bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
                      >
                        View Campaign
                      </button>
                    </div>
                  ))
                )}
                </div>
              </div>
            )}

            {/* Players Tab */}
            {activeTab === "players" && (
              <div>
                {/* Player Action Buttons - only show in Library view */}
                {!activeCampaignId && (
                  <div className="mb-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowDdbImport(true)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                      D&D Beyond
                    </button>
                    <button
                      onClick={() => setShowPdfImport(true)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                      PDF Import
                    </button>
                    <button
                      onClick={() => setShowOcrImport("player")}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Screenshot
                    </button>
                    <button
                      onClick={() => setShowQuickAdd("player")}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
                    >
                      + New Player
                    </button>
                  </div>
                )}

                {/* Campaign view info */}
                {activeCampaignId && (
                  <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">
                      Showing players in <span className="text-white font-medium">{activeCampaign?.name}</span>.
                      Use "Manage Players" above to add or remove players from this campaign.
                    </p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(activeCampaignId ? campaignPlayers : players).length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                      <p className="mb-4">
                        {activeCampaignId
                          ? "No players in this campaign yet."
                          : "No players yet."}
                      </p>
                      {activeCampaignId ? (
                        <button
                          onClick={() => setShowAddPlayerToCampaign(true)}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          Add players to campaign
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowQuickAdd("player")}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          Add your first player
                        </button>
                      )}
                    </div>
                  ) : (
                    (activeCampaignId ? campaignPlayers : players).map((player) => (
                      <div
                        key={player.id}
                        onClick={() => setViewingPlayer(player)}
                        className="bg-slate-800 rounded-lg p-4 border border-slate-700 group cursor-pointer hover:border-amber-500/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white">{player.name}</h3>
                          {activeCampaignId ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePlayerFromCampaign(player.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all text-xs"
                              title="Remove from campaign"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm({
                                  type: "player",
                                  id: player.id,
                                  name: player.name,
                                });
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                              title="Delete player"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                        <div className="text-sm text-slate-400">
                          Level {player.level} {player.race}{" "}
                          {player.character_class}
                        </div>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="text-slate-300">AC {player.ac}</span>
                          <span className="text-slate-300">
                            HP {player.hp_current}/{player.hp_max}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Creatures Tab */}
            {activeTab === "creatures" && (
              <div>
                {/* Creature Action Buttons */}
                <div className="mb-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowSrdBrowser(true)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                  >
                    SRD Browser
                  </button>
                  <button
                    onClick={() => setShowOcrImport("creature")}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Screenshot
                  </button>
                  <button
                    onClick={() => setShowQuickAdd("creature")}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
                  >
                    + New Creature
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {creatures.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                      <p className="mb-4">No creatures yet.</p>
                      <button
                        onClick={() => setShowQuickAdd("creature")}
                        className="text-amber-400 hover:text-amber-300"
                      >
                        Create a creature
                      </button>
                    </div>
                  ) : (
                    creatures.map((creature) => (
                      <div
                        key={creature.id}
                        onClick={() => setViewingCreature(creature)}
                        className="bg-slate-800 rounded-lg p-4 border border-slate-700 group cursor-pointer hover:border-red-500/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white">{creature.name}</h3>
                          <div className="flex items-center gap-2">
                            {creature.challenge_rating && (
                              <span className="text-sm text-amber-400">
                                CR {creature.challenge_rating}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm({
                                  type: "creature",
                                  id: creature.id,
                                  name: creature.name,
                                });
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                              title="Delete creature"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-slate-400">
                          {creature.size} {creature.creature_type}
                        </div>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="text-slate-300">AC {creature.ac}</span>
                          <span className="text-slate-300">HP {creature.hp_max}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showQuickAdd && (
        <QuickAddModal
          type={showQuickAdd}
          onClose={() => setShowQuickAdd(null)}
          onSubmit={handleQuickAdd}
          isSubmitting={isCreating}
        />
      )}

      {setupEncounter && (
        <EncounterSetupModal
          encounter={setupEncounter}
          players={setupPlayers}
          creatures={creatures}
          onAddCombatant={handleAddCombatant}
          onRemoveCombatant={handleRemoveCombatant}
          onClose={() => setSetupEncounterId(null)}
          onStartCombat={() => {
            setSetupEncounterId(null);
            window.location.href = `/tools/tracker/encounter/${setupEncounter.id}`;
          }}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          type={deleteConfirm.type}
          name={deleteConfirm.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          isDeleting={isDeleting}
        />
      )}

      {showNewCampaign && (
        <NewCampaignModal
          onClose={() => setShowNewCampaign(false)}
          onSubmit={handleCreateCampaign}
          isSubmitting={isCreating}
        />
      )}

      {showAddPlayerToCampaign && activeCampaign && (
        <AddPlayerToCampaignModal
          campaign={activeCampaign}
          allPlayers={players}
          campaignPlayerIds={activeCampaign.player_ids || []}
          onAddPlayer={handleAddPlayerToCampaign}
          onRemovePlayer={handleRemovePlayerFromCampaign}
          onClose={() => setShowAddPlayerToCampaign(false)}
        />
      )}

      {viewingPlayer && (
        <PlayerDetailModal
          player={viewingPlayer}
          onClose={() => setViewingPlayer(null)}
          onEdit={() => {
            setEditingPlayer(viewingPlayer);
            setViewingPlayer(null);
          }}
        />
      )}

      {viewingCreature && (
        <CreatureDetailModal
          creature={viewingCreature}
          onClose={() => setViewingCreature(null)}
          onEdit={() => {
            setEditingCreature(viewingCreature);
            setViewingCreature(null);
          }}
        />
      )}

      {editingPlayer && (
        <EditPlayerModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSubmit={handleEditPlayer}
          isSubmitting={isEditing}
        />
      )}

      {editingCreature && (
        <EditCreatureModal
          creature={editingCreature}
          onClose={() => setEditingCreature(null)}
          onSubmit={handleEditCreature}
          isSubmitting={isEditing}
        />
      )}

      {showSrdBrowser && (
        <SrdBrowserModal
          onClose={() => setShowSrdBrowser(false)}
          onImportSuccess={() => loadData()}
        />
      )}

      {showOcrImport && (
        <OCRImportModal
          mode={showOcrImport}
          onClose={() => setShowOcrImport(null)}
          onSuccess={() => loadData()}
        />
      )}

      {showPdfImport && (
        <PDFImportModal
          onClose={() => setShowPdfImport(false)}
          onSuccess={() => loadData()}
        />
      )}

      {showDdbImport && (
        <DDBImportModal
          onClose={() => setShowDdbImport(false)}
          onSuccess={() => loadData()}
        />
      )}

      {viewingEncounterHistory && (
        <EncounterHistoryModal
          encounter={viewingEncounterHistory}
          onClose={() => setViewingEncounterHistory(null)}
        />
      )}
    </div>
  );
}
