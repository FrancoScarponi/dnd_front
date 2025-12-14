import axios from "axios";

export const dndApi = axios.create({
  baseURL: "https://www.dnd5eapi.co/api",
  timeout: 15000,
});

export type DndListItem = { index: string; name: string; url: string };
export type DndListResponse = { count: number; results: DndListItem[] };

export async function dndList(path: string) {
  const res = await dndApi.get<DndListResponse>(path);
  return res.data.results;
}

export async function dndGet<T>(path: string) {
  const res = await dndApi.get<T>(path);
  return res.data;
}
