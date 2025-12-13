import axios from "axios";

const dndClient = axios.create({
  baseURL: "https://www.dnd5eapi.co/api/2014",
  timeout: 10_000,
});

export async function dndGet<T>(path: string): Promise<T> {
  const res = await dndClient.get<T>(path);
  return res.data;
}
