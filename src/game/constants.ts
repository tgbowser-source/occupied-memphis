import type { Difficulty, FactionId, Stats } from "./types";

export const TILE = 48;
export const SAVE_VERSION = 4;
export const SAVE_KEY = "occupied-memphis-saves-v4";
export const LAST_NAME = "Smith";

export const STAT_LABEL: Record<keyof Stats, string> = {
  charisma: "Charisma",
  strength: "Strength",
  intelligence: "Intelligence",
  dexterity: "Dexterity",
  luck: "Luck",
  perception: "Perception",
};

export const BASE_STATS: Stats = {
  charisma: 3,
  strength: 3,
  intelligence: 3,
  dexterity: 3,
  luck: 3,
  perception: 3,
};

export const CHILDHOOD_PICKS = 6;

/** Balanced defaults if the player skips the dossier. */
export const DEFAULT_CHILDHOOD: string[] = [
  "cotton",
  "trusses",
  "papers",
  "choir",
  "river",
  "tornado",
];

export const FACTION_LABEL: Record<FactionId, string> = {
  resistanceEast: "Anti-German Resistance",
  resistanceWest: "Anti-Japanese Resistance",
  wehrmacht: "Wehrmacht",
  ss: "SS",
  gestapo: "Gestapo",
  valkyrie: "Valkyrie Circle",
  ija: "Imperial Japanese Army",
  kempeitai: "Kempeitai",
  tokko: "Tokk\u014d",
  imperialist: "Imperialist faction",
  civilians: "Local civilians",
};

export const DIFF_LABEL: Record<Difficulty, string> = {
  story: "Story",
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
  survival: "Survival",
};

export const DIFF_DESC: Record<Difficulty, string> = {
  story: "Consequences stay, but the world is gentler. Free saves.",
  easy: "Forgiving combat and reputation. Free saves.",
  normal: "Grounded. Free saves.",
  hard: "Heavier hits. Manual saves locked \u2014 checkpoints only.",
  survival: "Scarce ammo, worse bleeding, harder stealth. Checkpoints only.",
};

export function diffMult(d: Difficulty) {
  switch (d) {
    case "story":
      return { dmgIn: 0.4, dmgOut: 1.1, rep: 0.5, stealth: 1.35, bleed: 0.5, ammo: 1.6 };
    case "easy":
      return { dmgIn: 0.7, dmgOut: 1.05, rep: 0.8, stealth: 1.15, bleed: 0.75, ammo: 1.2 };
    case "normal":
      return { dmgIn: 1, dmgOut: 1, rep: 1, stealth: 1, bleed: 1, ammo: 1 };
    case "hard":
      return { dmgIn: 1.3, dmgOut: 0.95, rep: 1.3, stealth: 0.85, bleed: 1.25, ammo: 0.8 };
    case "survival":
      return { dmgIn: 1.6, dmgOut: 0.9, rep: 1.6, stealth: 0.7, bleed: 1.6, ammo: 0.55 };
  }
}

export function canManualSave(d: Difficulty) {
  return d === "story" || d === "easy" || d === "normal";
}

export const RM_TO_YEN = 1.4;

export const START_MINUTES = (10 * 60 + 18) | 0; // Nov 10 1950, 18:00 as minutes-of-campaign from midnight of day 0
export const CAMPAIGN_START = new Date(Date.UTC(1950, 10, 10, 18, 0));

export const WALK_SPEED = 108;
export const SPRINT_SPEED = 178;
export const STAMINA_MAX = 100;

export function carryCap(strength: number) {
  return 16 + strength * 2.2;
}

export const ASSETS = {
  title: "/game/scenes/title.jpg",
  scenes: {
    kitchen_east: "/game/scenes/kitchen_east.jpg",
    kitchen_west: "/game/scenes/kitchen_west.jpg",
    office_east: "/game/scenes/office_east.jpg",
    office_west: "/game/scenes/office_west.jpg",
  },
  portraits: {
    father: "/game/portraits/father.jpg",
    mother: "/game/portraits/mother.jpg",
    gestapo: "/game/portraits/gestapo.jpg",
    tokko: "/game/portraits/tokko.jpg",
    player_m: "/game/portraits/player_m.jpg",
    player_f: "/game/portraits/player_f.jpg",
    recruiter_east: "/game/portraits/recruiter_east.jpg",
    recruiter_west: "/game/portraits/recruiter_west.jpg",
    wehrmacht: "/game/portraits/wehrmacht.jpg",
    ija: "/game/portraits/ija.jpg",
  },
  tiles: {
    grass: "/game/tiles/grass.jpg",
    dirt: "/game/tiles/dirt.jpg",
    road: "/game/tiles/road.jpg",
    water: "/game/tiles/water.jpg",
    wood: "/game/tiles/wood.jpg",
  },
  sprites: {
    player_m: "/game/sprites/player_m.png",
    player_f: "/game/sprites/player_f.png",
    wehrmacht: "/game/sprites/wehrmacht.png",
    ija: "/game/sprites/ija.png",
    civilian: "/game/sprites/civilian.png",
  },
  props: {
    house: "/game/props/house.png",
    farmhouse: "/game/props/farmhouse.png",
    barn: "/game/props/barn.png",
    hq_east: "/game/props/hq_east.png",
    hq_west: "/game/props/hq_west.png",
    factory: "/game/props/factory.png",
    cafe: "/game/props/cafe.png",
    garage: "/game/props/garage.png",
    checkpoint: "/game/props/checkpoint.png",
    crate: "/game/props/crate.png",
    tower: "/game/props/tower.png",
    tallgrass: "/game/props/tallgrass.png",
  },
} as const;
