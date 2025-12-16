import { api } from "./urlBase";
import type { CampaignDTO, MyCampaignsResponse } from "../types/campaignTypes";
import { store } from "../redux/store";

export async function listMyCampaigns() {
  const firebaseId = store.getState().auth.user?.firebaseId;
  const res = await api.get<MyCampaignsResponse>("/api/campaigns/my", {
    params: { firebaseId },
  });
  console.log(res.data)
  return res.data;
}

export async function createCampaign(body: { name: string; description?: string }) {
  const res = await api.post<CampaignDTO>("/api/campaigns", body);
  return res.data;
}

export async function getCampaign(id: string) {
  const res = await api.get<CampaignDTO>(`/api/campaigns/${id}`);
  console.log(res.data)
  return res.data;
}

export async function joinCampaign(inviteCode: string): Promise<CampaignDTO> {
  const res = await api.post<CampaignDTO>("/api/campaigns/join", { inviteCode });
  return res.data;
}

export async function deleteCampaign(campaignId: string) {
  await api.delete(`/api/campaigns/${campaignId}`);
}

export async function leaveCampaign(campaignId: string) {
  await api.post(`/api/campaigns/${campaignId}/leave`);
}
