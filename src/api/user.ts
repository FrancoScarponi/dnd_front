import { User } from "../types/userTypes";
import { api } from "./urlBase";

export const fetchBackendUser = async (token: string): Promise<User> => {
  const res = await api.get("/api/auth/login", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const registerBackendUser = async (
  token: string,
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const res = await api.post(
    "/auth/register",
    { email, password, displayName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
