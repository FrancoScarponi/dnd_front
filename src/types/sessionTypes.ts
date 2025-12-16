export interface SessionDTO {
  _id: string;
  campaign: string;
  sessionNumber: number;
  title: string;
  description?: string;
  startDate?: string; 
  endDate?: string;
  notesDM?: string;
  notesPlayers?: string;
  createdAt: string;
  updatedAt: string;
  status:string;
}
