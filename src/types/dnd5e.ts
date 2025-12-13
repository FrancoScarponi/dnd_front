export type ApiRef = { index: string; name: string; url: string };

export type ListResponse = {
  count: number;
  results: ApiRef[];
};

export type ClassDetail = {
  index: string;
  name: string;
  hit_die: number;
  proficiency_choices: unknown[];
  proficiencies: ApiRef[];
  saving_throws: ApiRef[];
  starting_equipment: unknown[];
};

export type RaceDetail = {
  index: string;
  name: string;
  speed: number;
  ability_bonuses: { ability_score: ApiRef; bonus: number }[];
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  starting_proficiencies: ApiRef[];
  languages: ApiRef[];
  traits: ApiRef[];
};
