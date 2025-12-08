export type Campaign = {
  id: string;
  name: string;
  description: string;
  gamemaster: string;  // id de usuario (ObjectId en string)
  players: string[];   // ids de usuarios
  createdAt: string;
  updatedAt: string;
};