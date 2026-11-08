import { SAVE_KEY, SAVE_VERSION } from "./constants";
import type { GameState } from "./types";

export type SaveSlot = {
  slot: number;
  updated: number;
  name: string;
  summary: string;
  state: GameState;
};

type Disk = { version: number; slots: (SaveSlot | null)[] };

function empty(): Disk {
  return { version: SAVE_VERSION, slots: [null, null, null] };
}

export function readDisk(): Disk {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Disk;
    if (!parsed || parsed.version !== SAVE_VERSION || !Array.isArray(parsed.slots)) return empty();
    return parsed;
  } catch {
    return empty();
  }
}

export function writeSlot(slot: number, state: GameState, summary: string) {
  try {
    const disk = readDisk();
    const snap: GameState = JSON.parse(JSON.stringify({
      ...state,
      bullets: [],
      floats: [],
      shake: 0,
      hitStop: 0,
      overlay: null,
    }));
    disk.slots[slot] = {
      slot,
      updated: Date.now(),
      name: `${state.firstName} Smith`,
      summary,
      state: snap,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(disk));
    localStorage.setItem(SAVE_KEY + ":bak", JSON.stringify(disk));
  } catch {
    /* private mode */
  }
}

export function loadSlot(slot: number): GameState | null {
  const s = readDisk().slots[slot];
  return s?.state ?? null;
}

export function hasAnySave() {
  return readDisk().slots.some(Boolean);
}
