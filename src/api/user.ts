import { User } from "../types/userTypes";
import { api } from "./urlBase";

export const fetchBackendUser = async (token: string): Promise<User> => {
  const res = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const registerBackendUser = async (
  token: string,
  displayName: string
): Promise<User> => {
  const res = await api.post(
    "/auth/register",
    { displayName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
