import { CAMPAIGN_START, carryCap } from "./constants";
import { ITEMS } from "./data/items";
import type { FactionId, GameState, InvItem, ItemId, StatId } from "./types";

export function he(s: GameState) {
  return s.gender === "m" ? "he" : "she";
}
export function him(s: GameState) {
  return s.gender === "m" ? "him" : "her";
}
export function his(s: GameState) {
  return s.gender === "m" ? "his" : "her";
}
export function He(s: GameState) {
  return s.gender === "m" ? "He" : "She";
}

export function fullName(s: { firstName: string }) {
  return `${s.firstName} Smith`;
}

export function occupier(side: GameState["side"]) {
  return side === "east" ? "German" : "Japanese";
}

export function agency(side: GameState["side"]) {
  return side === "east" ? "Gestapo" : "Tokk\u014d";
}

export function motherName() {
  return "Mary Smith";
}

export function fatherName() {
  return "Hank Smith";
}

export function brotherName() {
  return "Joseph Smith";
}

export function officerName(side: GameState["side"]) {
  return side === "east" ? "Kriminalinspektor Otto Hollen" : "Keibu Takeshi Kurohane";
}

export function handlerName(side: GameState["side"]) {
  return officerName(side);
}

export function handlerShort(side: GameState["side"]) {
  return side === "east" ? "Hollen" : "Kurohane";
}

export function recruiterName(_side?: GameState["side"]) {
  return "Mitchell Connor";
}

export function resistanceCmd(side: GameState["side"]) {
  return side === "east" ? "Alder McGarity" : "Richard Bedford";
}

export function resistanceCode(side: GameState["side"]) {
  return side === "east" ? "Boss" : "Swims";
}

/** Locked roster. Flavor and dossier; most do not appear in Chapter 1. */
export const FIGURES = [
  { name: "Mary Smith", role: "Mother" },
  { name: "Hank Smith", role: "Father" },
  { name: "Joseph Smith", role: "Brother \u2014 opposite bank" },
  { name: "Mitchell Connor", role: "Resistance recruiter" },
  { name: "Alder McGarity", role: "Captain \u201cBoss\u201d \u2014 east Resistance commander" },
  { name: "Richard Bedford", role: "Captain \u201cSwims\u201d \u2014 west Resistance commander" },
  { name: "Dieter Fleischer", role: "Kriminaloberkommissar \u2014 Gestapo regional head" },
  { name: "Klaus Von Schmerz", role: "Obergruppenf\u00fchrer \u2014 SS regional head, occupational commander" },
  { name: "Otto Hollen", role: "Kriminalinspektor \u2014 Gestapo case officer" },
  { name: "Wilhelm Von Strauffenberg", role: "Oberst \u2014 Wehrmacht commander, Valkyrie Circle" },
  { name: "Genji Igarashi", role: "Keishich\u014d \u2014 Tokk\u014d regional head" },
  { name: "Kanji Yamishita", role: "Sh\u014dsh\u014d \u2014 Kempeitai regional head, occupational commander" },
  { name: "Takeshi Kurohane", role: "Keibu \u2014 Tokk\u014d case officer" },
  { name: "Kiyoshi Minamoto", role: "Taisa \u2014 IJA commander, Japanese imperialist group" },
] as const;

export function clock(minutes: number) {
  const d = new Date(CAMPAIGN_START.getTime() + minutes * 60_000);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const hh = d.getUTCHours();
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ap = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return {
    date: d,
    label: `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`,
    time: `${h12}:${mm} ${ap}`,
    hour: hh,
    day: Math.floor(minutes / 1440),
  };
}

export function hourOf(minutes: number) {
  return new Date(CAMPAIGN_START.getTime() + minutes * 60_000).getUTCHours();
}

export function lightLevel(minutes: number) {
  const h = hourOf(minutes) + (minutes % 60) / 60;
  if (h < 5.5 || h > 20.5) return 0.18;
  if (h < 7) return 0.18 + ((h - 5.5) / 1.5) * 0.72;
  if (h > 18.5) return 0.9 - ((h - 18.5) / 2) * 0.72;
  return 0.92;
}

export function weightOf(items: InvItem[]) {
  return items.reduce((n, it) => n + ITEMS[it.id].weight * it.qty, 0);
}

export function countItem(items: InvItem[], id: ItemId) {
  return items.filter((i) => i.id === id).reduce((n, i) => n + i.qty, 0);
}

export function addItem(items: InvItem[], id: ItemId, qty = 1): InvItem[] {
  const def = ITEMS[id];
  const next = items.map((i) => ({ ...i }));
  if (def.stack) {
    const i = next.find((x) => x.id === id && !x.inShoe);
    if (i) {
      i.qty = Math.min(def.stack, i.qty + qty);
      return next;
    }
  }
  next.push({ id, qty });
  return next;
}

export function removeItem(items: InvItem[], id: ItemId, qty = 1): InvItem[] {
  const next: InvItem[] = [];
  let left = qty;
  for (const it of items) {
    if (it.id !== id || it.inShoe) {
      next.push({ ...it });
      continue;
    }
    if (it.qty > left) next.push({ ...it, qty: it.qty - left }), (left = 0);
    else left -= it.qty;
  }
  return next;
}

export function hasBulky(items: InvItem[]) {
  return items.some((i) => ITEMS[i.id].bulky);
}

export function visibleWeapon(s: GameState) {
  if (!s.equippedWeapon) return false;
  const def = ITEMS[s.equippedWeapon];
  return def.slot === "weapon" && !def.conceal;
}

export function overloaded(s: GameState) {
  return weightOf(s.items) > carryCap(s.stats.strength);
}

export function skillCheck(s: GameState, stat: StatId, dc: number) {
  const roll = 1 + Math.floor(Math.random() * 8);
  const luck = s.stats.luck >= 7 && Math.random() < 0.18 ? 2 : 0;
  return s.stats[stat] + roll + luck >= dc;
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function bumpRep(
  factions: GameState["factions"],
  id: FactionId,
  delta: number,
  witnessed: boolean,
  intelSees: boolean,
) {
  if (!witnessed && !intelSees) return factions;
  const next = { ...factions };
  next[id] = clamp(next[id] + delta, -100, 100);
  return next;
}

export function health(s: GameState) {
  const b = s.body;
  return (b.head + b.torso + b.arm + b.leg) / 4;
}

export function stingStage(s: GameState) {
  const v = s.flags.stingStage;
  return typeof v === "number" ? v : 0;
}
