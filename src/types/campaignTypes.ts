export type Id = string

export type CampaignDTO = {
  _id: Id;
  name: string;
  description: string;
  DM: Id;              
  players: Id[];       
  characters: Id[];
  sessions: Id[];
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
};

export type MyCampaignsResponse = {
  DMCampaigns: CampaignDTO[];
  playerCampaigns: CampaignDTO[];
};
