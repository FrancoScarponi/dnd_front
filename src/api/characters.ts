import { api } from "./urlBase";
import type { CharacterDTO, CharacterUpsertInput } from "../types/characterTypes";

export async function listCharacters() {
  const res = await api.get<CharacterDTO[]>("/characters");
  return res.data;
}

export async function createCharacter(body: CharacterUpsertInput) {
  const res = await api.post<CharacterDTO>("/characters", body);
  return res.data;
}

export async function getCharacter(id: string) {
  const res = await api.get<CharacterDTO>(`/characters/${id}`);
  return res.data;
}

export async function updateCharacter(id: string, body: CharacterUpsertInput) {
  const res = await api.put<CharacterDTO>(`/characters/${id}`, body);
  return res.data;
}
