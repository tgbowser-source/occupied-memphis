export type Side = "east" | "west";
export type Gender = "m" | "f";
export type Difficulty = "story" | "easy" | "normal" | "hard" | "survival";
export type Personality = "quiet" | "wry" | "idealistic" | "cautious" | "hotheaded";
export type Hair = "dark" | "brown" | "blonde" | "auburn";
export type Build = "slight" | "average" | "sturdy";
export type GameMode = "title" | "create" | "dialogue" | "world";
export type Overlay = null | "inventory" | "map" | "dossier" | "pause" | "shop" | "help";

export type StatId =
  | "charisma"
  | "strength"
  | "intelligence"
  | "dexterity"
  | "luck"
  | "perception";

export type Stats = Record<StatId, number>;

export type FactionId =
  | "resistanceEast"
  | "resistanceWest"
  | "wehrmacht"
  | "ss"
  | "gestapo"
  | "valkyrie"
  | "ija"
  | "kempeitai"
  | "tokko"
  | "imperialist"
  | "civilians";

export type BodyPart = "head" | "torso" | "arm" | "leg";

export type ItemId =
  | "knife"
  | "clothes"
  | "cigarettes"
  | "bandage"
  | "pistol"
  | "rifle"
  | "ammo9"
  | "ammo8"
  | "nitrate"
  | "arms"
  | "papersEast"
  | "papersWest"
  | "rations"
  | "bottle"
  | "string"
  | "molotov"
  | "usd"
  | "keyHome";

export type ItemDef = {
  id: ItemId;
  name: string;
  weight: number;
  desc: string;
  slot?: "weapon" | "body";
  conceal?: boolean;
  bulky?: boolean;
  damage?: number;
  ammo?: "ammo9" | "ammo8";
  stack?: number;
  throw?: boolean;
  frangible?: boolean;
};

export type InvItem = {
  id: ItemId;
  qty: number;
  inShoe?: boolean;
};

export type NpcKind =
  | "civilian"
  | "guard"
  | "parent"
  | "recruiter"
  | "handler"
  | "brother"
  | "shop"
  | "worker";

export type NpcState = {
  id: string;
  name: string;
  kind: NpcKind;
  sprite: string;
  x: number;
  y: number;
  z: number;
  facing: number;
  hp: number;
  alive: boolean;
  faction?: FactionId;
  dialogue?: string;
  shop?: string;
  patrol?: { x: number; y: number }[];
  patrolIndex: number;
  wait: number;
  vision: number;
  fov: number;
  alert: number;
  lastSeenX: number;
  lastSeenY: number;
  suspicious: boolean;
  when?: string;
};

export type PropKind =
  | "house"
  | "farmhouse"
  | "barn"
  | "hq_east"
  | "hq_west"
  | "factory"
  | "cafe"
  | "garage"
  | "checkpoint"
  | "crate"
  | "tower"
  | "tallgrass";

export type MapProp = {
  id: string;
  kind: PropKind;
  x: number;
  y: number;
  w: number;
  h: number;
  collides?: boolean;
  door?: { tx: number; ty: number; to: string; px: number; py: number };
  interact?: string;
  label?: string;
  hide?: boolean;
};

export type TileMap = {
  id: string;
  name: string;
  w: number;
  h: number;
  tiles: Uint8Array;
  props: MapProp[];
  npcs: Omit<NpcState, "patrolIndex" | "wait" | "alert" | "lastSeenX" | "lastSeenY" | "suspicious" | "alive" | "hp">[];
  spawn: { x: number; y: number };
  zone: Side | "bridge";
  interior?: boolean;
  discovered?: boolean;
};

export type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttl: number;
  from: "player" | "npc";
  dmg: number;
};

export type FloatingText = {
  x: number;
  y: number;
  text: string;
  life: number;
  color: string;
};

export type LogLine = { t: number; text: string };

export type CreateDraft = {
  firstName: string;
  gender: Gender;
  hair: Hair;
  build: Build;
  personality: Personality;
  side: Side;
  childhood: string[];
  knife: boolean;
  difficulty: Difficulty;
};

export type GameState = {
  version: number;
  mode: GameMode;
  overlay: Overlay;
  createStep: number;
  draft: CreateDraft;
  firstName: string;
  gender: Gender;
  hair: Hair;
  build: Build;
  personality: Personality;
  side: Side;
  difficulty: Difficulty;
  stats: Stats;
  birthdayDone: boolean;
  minutes: number;
  weather: "clear" | "overcast" | "rain";
  mapId: string;
  x: number;
  y: number;
  z: number;
  facing: number;
  pitch: number;
  view: "third" | "first";
  aiming: boolean;
  hudPrompt: string;
  ammo: number;
  vx: number;
  vy: number;
  speed: number;
  stamina: number;
  sprinting: boolean;
  hidden: boolean;
  body: Record<BodyPart, number>;
  bleeding: number;
  items: InvItem[];
  equippedWeapon: ItemId | null;
  moneyRm: number;
  moneyYen: number;
  usd: number;
  alignment: number;
  factions: Record<FactionId, number>;
  flags: Record<string, boolean | number | string>;
  journal: string[];
  log: LogLine[];
  discovered: string[];
  wantedUntil: number;
  captures: number;
  dossier: string[];
  npcs: NpcState[];
  bullets: Bullet[];
  floats: FloatingText[];
  crateOnMap: boolean;
  worldSeed: number;
  dialogueId: string | null;
  dialogueFrom: string | null;
  shopId: string | null;
  shake: number;
  hitStop: number;
  objectiveFlash: number;
  savedAt: number;
  slot: number;
  helpSeen: boolean;
  dead: boolean;
  ending: string | null;
};

export type DialogueChoice = {
  label: string;
  next?: string | null;
  toWorld?: boolean;
  req?: (s: GameState) => boolean;
  hint?: string;
  effects?: (s: GameState) => Partial<GameState> | void;
};

export type DialogueNode = {
  id: string;
  speaker: string | ((s: GameState) => string);
  portrait?: string | ((s: GameState) => string);
  scene?: string | ((s: GameState) => string);
  text: string | ((s: GameState) => string);
  next?: string | null | ((s: GameState) => string | null | undefined);
  toWorld?: boolean;
  choices?: DialogueChoice[];
  effects?: (s: GameState) => Partial<GameState> | void;
};
