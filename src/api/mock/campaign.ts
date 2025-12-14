import type { CampaignDTO } from "../../types/campaignTypes";
import { db, sleep } from "./mockDb";

export async function listMyCampaigns(): Promise<CampaignDTO[]> {
  await sleep();
  return structuredClone(db.campaigns);
}

export async function getCampaign(id: string): Promise<CampaignDTO> {
  await sleep();

  const found = db.campaigns.find((c) => c._id === id);
  if (!found) throw new Error("Campaña no encontrada");

  return structuredClone(found);
}

export async function createCampaign(body: {
  name: string;
  description?: string;
}): Promise<CampaignDTO> {
  await sleep();

  const name = body.name.trim();
  if (!name) throw new Error("El nombre es obligatorio");

  const now = new Date().toISOString();

  const newCampaign: CampaignDTO = {
    _id: `cmp_${crypto.randomUUID().slice(0, 8)}`,
    name,
    description: body.description?.trim() ?? "",
    DM: "user_1",
    players: [],
    characters: [],
    sessions: [],
    inviteCode: Math.random().toString(36).substring(2, 7).toUpperCase(),
    createdAt: now,
    updatedAt: now,
  };

  db.campaigns.unshift(newCampaign);
  return structuredClone(newCampaign);
}
