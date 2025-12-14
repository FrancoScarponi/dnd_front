import type { CampaignDTO } from "../../types/campaignTypes";
import type { CharacterDTO } from "../../types/characterTypes";
import { mockCampaigns } from "./campaigns.mock";
import { mockCharacters } from "./characters.mock";

export type MockDb = {
  campaigns: CampaignDTO[];
  characters: CharacterDTO[];
};

export const db: MockDb = {
  campaigns: structuredClone(mockCampaigns),
  characters: structuredClone(mockCharacters),
};

export function sleep(ms = 250) {
  return new Promise((r) => setTimeout(r, ms));
}

// opcional para resetear fácil en dev
export function resetDb() {
  db.campaigns = structuredClone(mockCampaigns);
  db.characters = structuredClone(mockCharacters);
}
