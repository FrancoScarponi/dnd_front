export type Id = string;

export type CharacterStats = {
  hp: number;
  maxHp: number;
  ac: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type CharacterDTO = {
  _id: Id;
  campaign?: Id | null;     
  owner: Id;
  name: string;
  class: string;
  race: string;
  level: number;
  xp: number;
  stats: CharacterStats;
  armorClass: number;
  skills: Record<string, number>;
  equipment: string[];
  background: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CharacterUpsertInput = {
  campaign?: Id | null;
  name: string;
  class: string;
  race: string;
  level: number;
  xp: number;
  stats: CharacterStats;
  armorClass: number;
  skills: Record<string, number>;
  equipment: string[];
  background: string;
  notes: string;
};
