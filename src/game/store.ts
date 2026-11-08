import { create } from "zustand";
import { BASE_STATS, DEFAULT_CHILDHOOD, SAVE_VERSION } from "./constants";
import { CHILDHOOD } from "./data/childhood";
import { startId } from "./data/dialogue";
import { ITEMS } from "./data/items";
import { mapName, mapSpawn, MAPS, hydrateNpcs } from "./data/maps";
import { addItem, clamp, clock, fullName, weightOf } from "./helpers";
import { hasAnySave, loadSlot, writeSlot } from "./save";
import type { CreateDraft, FactionId, GameState, Stats } from "./types";

const FACTIONS = [
  "resistanceEast","resistanceWest","wehrmacht","ss","gestapo","valkyrie",
  "ija","kempeitai","tokko","imperialist","civilians",
] as const satisfies FactionId[];

function zeroFactions(): GameState["factions"] {
  return Object.fromEntries(FACTIONS.map((k) => [k, 0])) as GameState["factions"];
}

export const emptyDraft = (): CreateDraft => ({
  firstName: "",
  gender: "m",
  hair: "dark",
  build: "average",
  personality: "quiet",
  side: "east",
  childhood: [],
  knife: true,
  difficulty: "normal",
});

export function defaultState(): GameState {
  return {
    version: SAVE_VERSION,
    mode: "title",
    overlay: null,
    createStep: 0,
    draft: emptyDraft(),
    firstName: "Alex",
    gender: "m",
    hair: "dark",
    build: "average",
    personality: "quiet",
    side: "east",
    difficulty: "normal",
    stats: { ...BASE_STATS },
    birthdayDone: false,
    minutes: 0,
    weather: "clear",
    mapId: "east",
    x: 0, y: 0, z: 0, facing: 0, pitch: 0,
    view: "third", aiming: false, hudPrompt: "", ammo: 0,
    vx: 0, vy: 0, speed: 0,
    stamina: 100, sprinting: false, hidden: false,
    body: { head: 100, torso: 100, arm: 100, leg: 100 },
    bleeding: 0,
    items: [],
    equippedWeapon: null,
    moneyRm: 0, moneyYen: 0, usd: 4,
    alignment: 0,
    factions: zeroFactions(),
    flags: {},
    journal: ["November 10, 1950. You turn eighteen."],
    log: [],
    discovered: [],
    wantedUntil: -1,
    captures: 0,
    dossier: [],
    npcs: [],
    bullets: [],
    floats: [],
    crateOnMap: false,
    worldSeed: 1,
    dialogueId: null,
    dialogueFrom: null,
    shopId: null,
    shake: 0, hitStop: 0, objectiveFlash: 0,
    savedAt: 0, slot: 0, helpSeen: false,
    dead: false, ending: null,
  };
}

function statsFrom(picks: string[]): Stats {
  const s = { ...BASE_STATS };
  for (const id of picks) {
    const o = CHILDHOOD.find((c) => c.id === id);
    if (o) s[o.stat] += 1;
  }
  return s;
}

function enterMap(s: GameState, mapId: string, x: number, y: number): Partial<GameState> {
  const map = MAPS[mapId];
  const discovered = s.discovered.includes(mapId) ? s.discovered : [...s.discovered, mapId];
  return {
    mapId,
    x,
    y,
    z: 0,
    npcs: map ? hydrateNpcs(map, s.flags) : [],
    discovered,
    bullets: [],
  };
}

export const useGame = create<GameState & {
  setMode: (m: GameState["mode"]) => void;
  setOverlay: (o: GameState["overlay"]) => void;
  patchDraft: (p: Partial<CreateDraft>) => void;
  setCreateStep: (n: number) => void;
  beginCreate: () => void;
  startNew: () => void;
  quickStart: () => void;
  continueLast: () => boolean;
  load: (slot: number) => boolean;
  save: (slot: number) => void;
  apply: (p: Partial<GameState>) => void;
  pushLog: (text: string) => void;
  beginDialogue: (id: string) => void;
  goWorld: () => void;
  warp: (mapId: string, x: number, y: number) => void;
}>((set, get) => ({
  ...defaultState(),
  setMode: (mode) => set({ mode }),
  setOverlay: (overlay) => set({ overlay }),
  patchDraft: (p) => set({ draft: { ...get().draft, ...p } }),
  setCreateStep: (createStep) => set({ createStep }),
  beginCreate: () =>
    set({
      mode: "create",
      createStep: 0,
      overlay: null,
      dialogueId: null,
      draft: emptyDraft(),
    }),
  apply: (p) => set((st) => ({ ...st, ...p })),
  pushLog: (text) => {
    const s = get();
    set({ log: [...s.log.slice(-24), { t: s.minutes, text }] });
  },
  goWorld: () => set({ mode: "world", dialogueId: null, overlay: get().helpSeen ? null : "help" }),
  warp: (mapId, x, y) => set(enterMap(get(), mapId, x, y)),
  beginDialogue: (id) => set({ mode: "dialogue", dialogueId: id, overlay: null }),
  startNew: () => {
    const d = get().draft;
    const first = d.firstName.trim() || (d.gender === "m" ? "Calvin" : "Ruth");
    const childhood =
      d.childhood.length > 0
        ? d.childhood
        : [...DEFAULT_CHILDHOOD];
    const mapId = d.side === "east" ? "home_east" : "home_west";
    const born = mapSpawn(mapId, {});
    let items = addItem(addItem([], "clothes"), "keyHome");
    if (d.knife) items = addItem(items, "knife");
    items = addItem(items, "usd", 4);
    const seed = (Date.now() % 1e9) | 0;
    const weather = seed % 7 === 0 ? "rain" : seed % 3 === 0 ? "overcast" : "clear";
    const base = defaultState();
    const next: GameState = {
      ...base,
      mode: "dialogue",
      firstName: first,
      gender: d.gender,
      hair: d.hair,
      build: d.build,
      personality: d.personality,
      side: d.side,
      difficulty: d.difficulty,
      stats: statsFrom(childhood),
      items,
      equippedWeapon: d.knife ? "knife" : null,
      usd: 4,
      mapId,
      x: born.x,
      y: born.y,
      z: 0,
      facing: 0,
      npcs: born.npcs,
      discovered: [mapId, d.side],
      dialogueId: startId(d.side),
      worldSeed: seed,
      weather,
      slot: 0,
      draft: d,
      view: "third",
    };
    set((st) => ({ ...st, ...next }));
  },
  quickStart: () => {
    set({
      draft: {
        ...emptyDraft(),
        firstName: "Calvin",
        childhood: [...DEFAULT_CHILDHOOD],
      },
    });
    get().startNew();
  },
  continueLast: () => {
    const disk = [0, 1, 2].map((i) => loadSlot(i)).filter(Boolean) as GameState[];
    disk.sort((a, b) => b.savedAt - a.savedAt);
    if (!disk[0]) return false;
    set((st) => ({ ...st, ...disk[0], overlay: null, bullets: [], floats: [] }));
    return true;
  },
  load: (slot) => {
    const loaded = loadSlot(slot);
    if (!loaded) return false;
    set((st) => ({ ...st, ...loaded, overlay: null, bullets: [], floats: [] }));
    return true;
  },
  save: (slot) => {
    const s = get();
    const c = clock(s.minutes);
    writeSlot(slot, { ...s, savedAt: Date.now(), slot }, `${c.label} \u00b7 ${c.time} \u00b7 ${mapName(s.mapId)}`);
    set({ savedAt: Date.now(), slot });
  },
}));

if (typeof window !== "undefined") {
  window.__game = useGame;
}

declare global {
  interface Window {
    __game?: typeof useGame;
  }
}

export function summaryLine(s: GameState) {
  const c = clock(s.minutes);
  return `${fullName(s)} \u00b7 ${c.label} \u00b7 ${c.time}`;
}

export { enterMap, hasAnySave, weightOf, clamp, ITEMS };
