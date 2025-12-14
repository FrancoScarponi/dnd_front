import type { CampaignDTO } from "../../types/campaignTypes";
import type { CharacterDTO } from "../../types/characterTypes";
import { db, sleep } from "./mockDb";

function getCampaignOrThrow(id: string) {
  const c = db.campaigns.find((x) => x._id === id);
  if (!c) throw new Error("Campaña no encontrada");
  return c;
}

function getCharacterOrThrow(id: string) {
  const ch = db.characters.find((x) => x._id === id);
  if (!ch) throw new Error("Personaje no encontrado");
  return ch;
}

export async function getCampaignMock(id: string): Promise<CampaignDTO> {
  await sleep();
  return structuredClone(getCampaignOrThrow(id));
}

export async function listAllCharactersMock(): Promise<CharacterDTO[]> {
  await sleep();
  return structuredClone(db.characters);
}

export async function listCampaignCharactersMock(campaignId: string): Promise<CharacterDTO[]> {
  await sleep();
  const camp = getCampaignOrThrow(campaignId);
  const ids = new Set(camp.characters ?? []);
  return structuredClone(db.characters.filter((ch) => ids.has(ch._id)));
}

export async function addCharacterToCampaignMock(campaignId: string, characterId: string) {
  await sleep();
  const camp = getCampaignOrThrow(campaignId);
  const ch = getCharacterOrThrow(characterId);

  if (!camp.characters) camp.characters = [];
  if (!camp.characters.includes(characterId)) camp.characters.push(characterId);

  ch.campaign = campaignId;

  return { ok: true };
}

export async function removeCharacterFromCampaignMock(campaignId: string, characterId: string) {
  await sleep();
  const camp = getCampaignOrThrow(campaignId);
  const ch = getCharacterOrThrow(characterId);

  camp.characters = (camp.characters ?? []).filter((id) => id !== characterId);
  if (ch.campaign === campaignId) ch.campaign = null;

  return { ok: true };
}
