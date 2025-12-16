import { api } from "./urlBase";
import type { CharacterDTO } from "../types/characterTypes";

export async function listCampaignCharacters(campaignId: string) {
  const res = await api.get<CharacterDTO[]>(`/api/campaigns/${campaignId}/characters`);
  return res.data;
}

export async function assignCharacterToCampaign(campaignId: string, characterId: string) {
  const res = await api.post<CharacterDTO>(`/campaigns/${campaignId}/characters/${characterId}`);
  return res.data;
}

export async function removeCharacterFromCampaign(campaignId: string, characterId: string) {
  const res = await api.delete<{ ok: true }>(`/campaigns/${campaignId}/characters/${characterId}`);
  return res.data;
}
