import type { CampaignDTO } from "../types/campaignTypes";

export const mockCampaignDetail: CampaignDTO = {
  _id: "cmp_1",
  name: "Curse of Strahd",
  description:
    "Una campaña oscura y gótica ambientada en Barovia, dominada por el vampiro Strahd von Zarovich. " +
    "Los personajes deberán sobrevivir en un mundo donde la esperanza es escasa y la muerte acecha en cada esquina.",
  DM: "user_1",
  players: [],
  characters: ["char_1", "char_2", "char_3"],
  sessions: ["ses_1", "ses_2", "ses_3", "ses_4"],
  inviteCode: "STR4HD",
  createdAt: "2025-01-10T18:30:00.000Z",
  updatedAt: "2025-02-15T22:10:00.000Z",
};
