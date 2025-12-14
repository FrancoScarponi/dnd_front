import type { CharacterDTO, CharacterUpsertInput } from "../../types/characterTypes";
import { db, sleep } from "./mockDb";

export async function listCharacters(): Promise<CharacterDTO[]> {
  await sleep();
  return structuredClone(db.characters);
}

export async function getCharacter(id: string): Promise<CharacterDTO> {
  await sleep();
  const found = db.characters.find((c) => c._id === id);
  if (!found) throw new Error("Personaje no encontrado");
  return structuredClone(found);
}

export async function createCharacter(body: CharacterUpsertInput): Promise<CharacterDTO> {
  await sleep();

  const now = new Date().toISOString();
  const newChar: CharacterDTO = {
    ...body,
    _id: `char_${crypto.randomUUID().slice(0, 8)}`,
    owner: "user_1",
    createdAt: now,
    updatedAt: now,
  };

  db.characters.unshift(newChar);
  return structuredClone(newChar);
}

export async function updateCharacter(id: string, body: CharacterUpsertInput): Promise<CharacterDTO> {
  await sleep();

  const idx = db.characters.findIndex((c) => c._id === id);
  if (idx === -1) throw new Error("No existe");

  db.characters[idx] = {
    ...db.characters[idx],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return structuredClone(db.characters[idx]);
}
