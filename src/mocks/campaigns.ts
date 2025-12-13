import type { CampaignDTO } from "../types/campaignTypes";

export const mockCampaigns: CampaignDTO[] = [
  {
    _id: "cmp_1",
    name: "Curse of Strahd",
    description:
      "Una campaña oscura y gótica ambientada en Barovia, dominada por el vampiro Strahd von Zarovich.",
    DM: "user_1",
    players: [],
    characters: ["char_1", "char_2", "char_3"],
    sessions: ["ses_1", "ses_2", "ses_3", "ses_4"],
    inviteCode: "STR4HD",
    createdAt: "2025-01-10T18:30:00.000Z",
    updatedAt: "2025-02-15T22:10:00.000Z",
  },
  {
    _id: "cmp_2",
    name: "Lost Mine of Phandelver",
    description:
      "Una aventura clásica ideal para comenzar, con goblins, minas olvidadas y secretos antiguos.",
    DM: "user_1",
    players: [],
    characters: ["char_4", "char_5"],
    sessions: ["ses_5", "ses_6"],
    inviteCode: "PHAND",
    createdAt: "2024-11-05T14:00:00.000Z",
    updatedAt: "2024-11-20T20:45:00.000Z",
  },
  {
    _id: "cmp_3",
    name: "Homebrew: The Shattered Crown",
    description:
      "Un mundo original donde el imperio cayó y la magia volvió a despertar con consecuencias impredecibles.",
    DM: "user_1",
    players: [],
    characters: [],
    sessions: [],
    inviteCode: "CROWN",
    createdAt: "2025-03-01T12:00:00.000Z",
    updatedAt: "2025-03-01T12:00:00.000Z",
  },
];
