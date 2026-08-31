/** Client-safe household payload (no Node/crypto). */

export type HouseholdRole = "owner" | "member" | "none";

export type HouseholdPerson = {
  id: string;
  name: string;
  email: string;
  status?: string;
  overflow?: boolean;
};

export type HouseholdInvitePublic = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  expiresAt: string;
  joinPath: string;
};

export type HouseholdClient = {
  role: HouseholdRole;
  seats: number;
  used: number;
  extraSeats: number;
  openSeats: number;
  canInvite: boolean;
  ownerName?: string;
  ownerEmail?: string;
  planLabel: string;
  members: HouseholdPerson[];
  invites: HouseholdInvitePublic[];
  incoming?: {
    ownerName: string;
    planLabel: string;
    seats: number;
  } | null;
  seatLine: string;
  note: string;
};

export type InvitePeek = {
  email: string;
  ownerName: string;
  planLabel: string;
  seats: number;
  expired: boolean;
};
