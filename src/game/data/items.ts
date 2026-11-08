import type { ItemDef, ItemId } from "../types";

export const ITEMS: Record<ItemId, ItemDef> = {
  knife: { id: "knife", name: "Pocket knife", weight: 0.2, desc: "A folding blade. Legal enough until it isn't.", slot: "weapon", conceal: true, damage: 9 },
  clothes: { id: "clothes", name: "Work clothes", weight: 1.1, desc: "What you stood up in this morning.", slot: "body" },
  cigarettes: { id: "cigarettes", name: "Cigarettes", weight: 0.04, desc: "Mid-scarce. A small bribe, a smaller comfort.", stack: 20 },
  bandage: { id: "bandage", name: "Field dressing", weight: 0.18, desc: "Stops a bleed. Doesn't make you new.", stack: 6 },
  pistol: { id: "pistol", name: "Service pistol", weight: 0.96, desc: "Concealable. Loud. The street will remember it.", slot: "weapon", conceal: true, damage: 24, ammo: "ammo9" },
  rifle: { id: "rifle", name: "Service rifle", weight: 4.1, desc: "Open carry is a decision you don't get to take back.", slot: "weapon", conceal: false, damage: 42, ammo: "ammo8" },
  ammo9: { id: "ammo9", name: "Pistol rounds", weight: 0.012, desc: "Counted, not wasted.", stack: 40 },
  ammo8: { id: "ammo8", name: "Rifle rounds", weight: 0.024, desc: "Heavy for the pocket.", stack: 30 },
  nitrate: { id: "nitrate", name: "Nitrate crate", weight: 18, desc: "Fertilizer, if anyone asks. The Resistance does not.", bulky: true },
  arms: { id: "arms", name: "Arms crate", weight: 16, desc: "Weight, bulk, and a death sentence if opened in the street.", bulky: true },
  papersEast: { id: "papersEast", name: "German papers", weight: 0.02, desc: "You exist, according to the Reich.", conceal: true },
  papersWest: { id: "papersWest", name: "Japanese papers", weight: 0.02, desc: "A name the Empire is willing to file.", conceal: true },
  rations: { id: "rations", name: "Ration tin", weight: 0.4, desc: "Meat adjacent. Keeps.", stack: 8 },
  bottle: { id: "bottle", name: "Empty bottle", weight: 0.3, desc: "Frangible. A distraction, or a beginning.", throw: true, frangible: true },
  string: { id: "string", name: "Twine", weight: 0.05, desc: "For parcels. For other work, if you're clever." },
  molotov: { id: "molotov", name: "Bottle bomb", weight: 0.52, desc: "Fire is loud in a way a gun is not.", throw: true },
  usd: { id: "usd", name: "Old U.S. dollars", weight: 0.01, desc: "Paper from a country that no longer pays. Useless as tender.", stack: 50 },
  keyHome: { id: "keyHome", name: "House key", weight: 0.03, desc: "It still fits. That is not nothing." },
};

export function itemName(id: ItemId) {
  return ITEMS[id].name;
}

export const SHOPS: Record<string, { name: string; hours: [number, number]; stock: { id: ItemId; price: number; qty: number }[] }> = {
  east_general: {
    name: "Kaufmann's Dry Goods",
    hours: [7, 19],
    stock: [
      { id: "cigarettes", price: 2, qty: 12 },
      { id: "bandage", price: 6, qty: 4 },
      { id: "rations", price: 4, qty: 6 },
      { id: "bottle", price: 1, qty: 5 },
      { id: "string", price: 1, qty: 3 },
    ],
  },
  west_general: {
    name: "Brennan's Counter",
    hours: [6, 18],
    stock: [
      { id: "cigarettes", price: 3, qty: 10 },
      { id: "bandage", price: 8, qty: 4 },
      { id: "rations", price: 5, qty: 6 },
      { id: "bottle", price: 1, qty: 5 },
      { id: "string", price: 1, qty: 3 },
    ],
  },
};
