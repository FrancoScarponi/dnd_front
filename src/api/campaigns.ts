import { api } from "./urlBase";
import type { CampaignDTO } from "../types/campaignTypes";

export async function listMyCampaigns() {
  const res = await api.get<CampaignDTO[]>("/campaigns");
  return res.data;
}

export async function createCampaign(body: { name: string; description?: string }) {
  const res = await api.post<CampaignDTO>("/campaigns", body);
  return res.data;
}

export async function getCampaign(id: string) {
  const res = await api.get<CampaignDTO>(`/campaigns/${id}`);
  return res.data;
}
