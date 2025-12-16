import { api } from "./urlBase";
import type { SessionDTO } from "../types/sessionTypes";

export async function listCampaignSessions(campaignId: string) {
  const res = await api.get<SessionDTO[]>(`/api/campaigns/${campaignId}/sessions`);
  return res.data;
}

export type CreateSessionPayload = {
  title: string;
  description?: string;
  startDate?: string;
  notesDM?: string;
  notesPlayers?: string;
};

export async function createCampaignSession(
  campaignId: string,
  payload: CreateSessionPayload
) {
  console.log(payload)
  const res = await api.post<SessionDTO>(
    `/api/campaigns/${campaignId}/sessions`,
    payload
  );
  return res.data;
}

export async function getSession(campaignId: string, sessionId: string) {
  const res = await api.get<SessionDTO>(
    `/campaigns/${campaignId}/sessions/${sessionId}`
  );
  return res.data;
}

export async function updateSession(
  campaignId: string,
  sessionId: string,
  payload: Partial<CreateSessionPayload>
) {
  const res = await api.patch<SessionDTO>(
    `/campaigns/${campaignId}/sessions/${sessionId}`,
    payload
  );
  return res.data;
}

export async function deleteSession(campaignId: string, sessionId: string) {
  const res = await api.delete<{ ok: true }>(
    `/campaigns/${campaignId}/sessions/${sessionId}`
  );
  return res.data;
}
