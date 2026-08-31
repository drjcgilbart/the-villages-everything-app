/**
 * Household seats on a Hub membership.
 *
 * Cart Path Regular = 1 login, Lanai Legend = 2, Square Royalty = 4.
 * Extra people are real Hub members with their own password and My Space
 * boards. They inherit the paying neighbor’s access while a seat is open.
 */

import crypto from "crypto";
import {
  type HouseholdInvite,
  type HouseholdState,
  type MemberSpaceRecord,
  accessPlan,
  findMemberSpace,
  getMemberSpace,
  loadMemberSpaces,
  ownerAccessPlan,
  standingPlan,
  updateMemberSpace,
} from "./memberSpace";
import {
  formatHouseholdSeats,
  getTier,
  householdSeatsForPlan,
  isPaidPlan,
} from "./membershipTiers";
import { getMemberByEmail, getMemberById, setMemberStatus } from "./yardSale";
import type {
  HouseholdClient,
  HouseholdInvitePublic,
  HouseholdPerson,
  InvitePeek,
} from "./householdTypes";

export type {
  HouseholdClient,
  HouseholdInvitePublic,
  HouseholdPerson,
  HouseholdRole,
  InvitePeek,
} from "./householdTypes";

export const HOUSEHOLD_INVITE_DAYS = 30;

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}`;
}

function plusDaysIso(days: number, from = new Date()) {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

function cleanEmail(raw: string) {
  return String(raw || "").trim().toLowerCase().slice(0, 120);
}

function inviteOpen(inv: HouseholdInvite, now = Date.now()) {
  if (inv.status !== "pending") return false;
  const ends = new Date(inv.expiresAt).getTime();
  return Number.isFinite(ends) && ends > now;
}

function householdOf(space: MemberSpaceRecord): HouseholdState {
  return {
    memberIds: [...(space.household?.memberIds || [])],
    invites: [...(space.household?.invites || [])],
  };
}

function usedSeatCount(space: MemberSpaceRecord, now = Date.now()) {
  const extras = space.household?.memberIds?.length || 0;
  const pending = (space.household?.invites || []).filter((inv) =>
    inviteOpen(inv, now)
  ).length;
  return 1 + extras + pending;
}

function personBrief(id: string): HouseholdPerson {
  const m = getMemberById(id);
  return {
    id,
    name: m?.name || "Neighbor",
    email: m?.email || "",
    status: m?.status,
  };
}

function findOwnerOfInviteToken(token: string): {
  owner: MemberSpaceRecord;
  invite: HouseholdInvite;
} | null {
  const t = String(token || "").trim();
  if (!t) return null;
  const data = loadMemberSpaces();
  for (const raw of data.spaces) {
    const invites = raw.household?.invites || [];
    const invite = invites.find((inv) => inv.token === t);
    if (!invite) continue;
    return { owner: getMemberSpace(raw.memberId), invite };
  }
  return null;
}

function findPendingInviteForEmail(email: string): {
  owner: MemberSpaceRecord;
  invite: HouseholdInvite;
} | null {
  const e = cleanEmail(email);
  if (!e) return null;
  const data = loadMemberSpaces();
  for (const raw of data.spaces) {
    const invites = raw.household?.invites || [];
    const invite = invites.find(
      (inv) => inv.email === e && inviteOpen(inv)
    );
    if (!invite) continue;
    return { owner: getMemberSpace(raw.memberId), invite };
  }
  return null;
}

export function peekHouseholdInvite(token: string): InvitePeek | null {
  const found = findOwnerOfInviteToken(token);
  if (!found) return null;
  const ownerMember = getMemberById(found.owner.memberId);
  const plan = ownerAccessPlan(found.owner);
  return {
    email: found.invite.email,
    ownerName: ownerMember?.name || "A neighbor",
    planLabel: getTier(plan).label,
    seats: householdSeatsForPlan(plan),
    expired: !inviteOpen(found.invite),
  };
}

function ownerPlanLabel(owner: MemberSpaceRecord): string {
  return getTier(ownerAccessPlan(owner)).label;
}

export function householdClientPayload(
  memberId: string,
  space: MemberSpaceRecord
): HouseholdClient {
  const inherited = accessPlan(space);
  const planLabel = getTier(inherited).label;

  if (space.householdOwnerId && space.householdOwnerId !== memberId) {
    const owner = findMemberSpace(space.householdOwnerId);
    const ownerMember = owner ? getMemberById(owner.memberId) : null;
    const ownerPlan = owner ? ownerAccessPlan(owner) : inherited;
    const seats = householdSeatsForPlan(ownerPlan);
    const extras = owner?.household?.memberIds || [];
    const idx = extras.indexOf(memberId);
    const overflow = idx < 0 || idx >= Math.max(0, seats - 1);
    const members = extras.map((id, i) => ({
      ...personBrief(id),
      overflow: i >= Math.max(0, seats - 1),
    }));
    if (owner) {
      members.unshift({
        ...personBrief(owner.memberId),
        overflow: false,
      });
    }
    return {
      role: "member",
      seats,
      used: owner ? usedSeatCount(owner) : 1,
      extraSeats: Math.max(0, seats - 1),
      openSeats: 0,
      canInvite: false,
      ownerName: ownerMember?.name || "A neighbor",
      ownerEmail: ownerMember?.email,
      planLabel: getTier(ownerPlan).label,
      members,
      invites: [],
      incoming: null,
      seatLine: formatHouseholdSeats(seats),
      note: overflow
        ? `This household is over the ${formatHouseholdSeats(seats)} on ${getTier(ownerPlan).label}. Your boards are still yours; paid tools stay locked until a seat opens or they upgrade.`
        : `You’re on ${ownerMember?.name || "a neighbor"}’s ${getTier(ownerPlan).label}. Your login and My Space boards are only yours.`,
    };
  }

  const seats = householdSeatsForPlan(inherited);
  const extraSeats = Math.max(0, seats - 1);
  const used = usedSeatCount(space);
  const openSeats = Math.max(0, seats - used);
  const extras = space.household?.memberIds || [];
  const members: HouseholdPerson[] = [
    { ...personBrief(memberId), overflow: false },
    ...extras.map((id, i) => ({
      ...personBrief(id),
      overflow: i >= extraSeats,
    })),
  ];
  const invites: HouseholdInvitePublic[] = (space.household?.invites || [])
    .filter((inv) => inviteOpen(inv))
    .map((inv) => ({
      id: inv.id,
      email: inv.email,
      name: inv.name,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt,
      joinPath: `/yard-sale/join?household=${encodeURIComponent(inv.token)}`,
    }));

  const incomingFound = findPendingInviteForEmail(
    getMemberById(memberId)?.email || ""
  );
  const incoming =
    incomingFound && incomingFound.owner.memberId !== memberId
      ? {
          ownerName:
            getMemberById(incomingFound.owner.memberId)?.name || "A neighbor",
          planLabel: ownerPlanLabel(incomingFound.owner),
          seats: householdSeatsForPlan(ownerAccessPlan(incomingFound.owner)),
        }
      : null;

  const canInvite = extraSeats > 0 && openSeats > 0;
  let note = householdSeatsForPlan(inherited) <= 1
    ? "This plan is one login — yours. Lanai Legend adds a second member; Square Royalty covers four, each with their own boards."
    : `This plan includes ${formatHouseholdSeats(seats)}. Invite a neighbor and they get their own password and My Space — not a copy of yours.`;
  if (incoming) {
    note = `${incoming.ownerName} invited you onto their ${incoming.planLabel} (${formatHouseholdSeats(incoming.seats)}). Accept below — your boards stay yours.`;
  }

  return {
    role: "owner",
    seats,
    used,
    extraSeats,
    openSeats,
    canInvite,
    planLabel,
    members,
    invites,
    incoming,
    seatLine: formatHouseholdSeats(seats),
    note,
  };
}

export function inviteHouseholdMember(
  ownerId: string,
  rawEmail: string,
  rawName?: string
): { invite: HouseholdInvite; joinPath: string } {
  const email = cleanEmail(rawEmail);
  if (!email || !email.includes("@")) {
    throw new Error("A valid email is required.");
  }
  const name = String(rawName || "").trim().slice(0, 80) || undefined;
  const owner = getMemberSpace(ownerId);
  if (owner.householdOwnerId) {
    throw new Error(
      "You’re on someone else’s household. Leave it before inviting people of your own."
    );
  }
  const ownerMember = getMemberById(ownerId);
  if (!ownerMember) throw new Error("Member not found");
  if (ownerMember.status !== "approved") {
    throw new Error("Your neighbor account must be approved before inviting.");
  }
  if (ownerMember.email === email) {
    throw new Error("That’s your own email.");
  }

  const plan = ownerAccessPlan(owner);
  const seats = householdSeatsForPlan(plan);
  if (seats <= 1) {
    throw new Error(
      `${formatHouseholdSeats(seats)} on this plan — just you. Upgrade to Lanai Legend (2) or Square Royalty (4) to add household logins.`
    );
  }

  const house = householdOf(owner);
  house.invites = house.invites.filter((inv) => inviteOpen(inv) || inv.status === "accepted");

  const alreadyMember = house.memberIds.some((id) => {
    const m = getMemberById(id);
    return m?.email === email;
  });
  if (alreadyMember) {
    throw new Error("That neighbor is already on this household.");
  }

  const existing = getMemberByEmail(email);
  if (existing) {
    if (existing.status === "rejected" || existing.status === "suspended") {
      throw new Error("That account isn’t eligible to join a household.");
    }
    const theirSpace = findMemberSpace(existing.id);
    if (theirSpace?.householdOwnerId && theirSpace.householdOwnerId !== ownerId) {
      throw new Error("That neighbor is already on another household.");
    }
    if (theirSpace && isPaidPlan(standingPlan(theirSpace))) {
      throw new Error(
        "That neighbor already has their own paid plan. They can keep it, or leave it before joining yours."
      );
    }
    const theirHouse = theirSpace?.household;
    if (
      theirHouse &&
      (theirHouse.memberIds.length > 0 ||
        theirHouse.invites.some((inv) => inviteOpen(inv)))
    ) {
      throw new Error(
        "That neighbor already has a household of their own. They need to clear it first."
      );
    }
  }

  const pendingSame = house.invites.find(
    (inv) => inv.email === email && inviteOpen(inv)
  );
  if (pendingSame) {
    return {
      invite: pendingSame,
      joinPath: `/yard-sale/join?household=${encodeURIComponent(pendingSame.token)}`,
    };
  }

  const used = 1 + house.memberIds.length + house.invites.filter((inv) => inviteOpen(inv)).length;
  if (used >= seats) {
    throw new Error(
      `No open seats. ${formatHouseholdSeats(seats)} are included with this plan.`
    );
  }

  const now = new Date();
  const invite: HouseholdInvite = {
    id: uid("inv"),
    email,
    name,
    token: crypto.randomBytes(18).toString("hex"),
    createdAt: now.toISOString(),
    expiresAt: plusDaysIso(HOUSEHOLD_INVITE_DAYS, now),
    acceptedAt: null,
    status: "pending",
  };
  house.invites.push(invite);
  updateMemberSpace(ownerId, { household: house });
  return {
    invite,
    joinPath: `/yard-sale/join?household=${encodeURIComponent(invite.token)}`,
  };
}

function linkMemberToOwner(
  owner: MemberSpaceRecord,
  memberId: string,
  invite: HouseholdInvite
) {
  const house = householdOf(owner);
  house.memberIds = [...new Set([...house.memberIds, memberId])];
  house.invites = house.invites.filter(
    (inv) => inv.id !== invite.id && inv.token !== invite.token && inviteOpen(inv)
  );
  const extraSeats = Math.max(0, householdSeatsForPlan(ownerAccessPlan(owner)) - 1);
  if (house.memberIds.length > extraSeats) {
    throw new Error(
      `No open seats. ${formatHouseholdSeats(householdSeatsForPlan(ownerAccessPlan(owner)))} are included with this plan.`
    );
  }
  updateMemberSpace(owner.memberId, { household: house });
  updateMemberSpace(memberId, {
    householdOwnerId: owner.memberId,
    householdJoinedAt: new Date().toISOString(),
    household: undefined,
  });

  const member = getMemberById(memberId);
  if (member && member.status === "pending") {
    setMemberStatus(
      memberId,
      "approved",
      `Household invite from ${getMemberById(owner.memberId)?.name || "a neighbor"}`
    );
  }
}

export function acceptHouseholdInvite(memberId: string, token?: string) {
  const member = getMemberById(memberId);
  if (!member) throw new Error("Please sign in");
  if (member.status === "rejected" || member.status === "suspended") {
    throw new Error("This account isn’t eligible to join a household.");
  }

  const space = getMemberSpace(memberId);
  if (space.householdOwnerId) {
    throw new Error("You’re already on a household.");
  }
  if (isPaidPlan(standingPlan(space))) {
    throw new Error(
      "You already have a paid plan. Stay on it, or the studio can move you if you meant to join someone else."
    );
  }
  const ownHouse = space.household;
  if (
    ownHouse &&
    (ownHouse.memberIds.length > 0 ||
      ownHouse.invites.some((inv) => inviteOpen(inv)))
  ) {
    throw new Error(
      "You already have people on your household. Clear them before joining someone else’s."
    );
  }

  const found = token
    ? findOwnerOfInviteToken(token)
    : findPendingInviteForEmail(member.email);
  if (!found) {
    throw new Error("No household invite found for this account.");
  }
  if (!inviteOpen(found.invite)) {
    throw new Error("That invite expired. Ask them to send a new one.");
  }
  if (found.invite.email !== member.email) {
    throw new Error(
      `This invite is for ${found.invite.email}. Sign in with that email, or ask them to invite ${member.email}.`
    );
  }
  if (found.owner.memberId === memberId) {
    throw new Error("That’s your own invite.");
  }

  linkMemberToOwner(found.owner, memberId, found.invite);
  return getMemberSpace(memberId);
}

export function revokeHouseholdInvite(ownerId: string, inviteId: string) {
  const owner = getMemberSpace(ownerId);
  if (owner.householdOwnerId) {
    throw new Error("Only the paying neighbor can manage invites.");
  }
  const house = householdOf(owner);
  const next = house.invites.filter((inv) => inv.id !== inviteId);
  if (next.length === house.invites.length) {
    throw new Error("Invite not found.");
  }
  house.invites = next;
  updateMemberSpace(ownerId, {
    household: house.memberIds.length || house.invites.length ? house : undefined,
  });
}

export function removeHouseholdMember(ownerId: string, memberId: string) {
  if (ownerId === memberId) {
    throw new Error("You can’t remove yourself. Downgrade or leave the extras instead.");
  }
  const owner = getMemberSpace(ownerId);
  if (owner.householdOwnerId) {
    throw new Error("Only the paying neighbor can remove household logins.");
  }
  const house = householdOf(owner);
  if (!house.memberIds.includes(memberId)) {
    throw new Error("That neighbor isn’t on this household.");
  }
  house.memberIds = house.memberIds.filter((id) => id !== memberId);
  updateMemberSpace(ownerId, {
    household: house.memberIds.length || house.invites.length ? house : undefined,
  });
  const extra = findMemberSpace(memberId);
  if (extra?.householdOwnerId === ownerId) {
    updateMemberSpace(memberId, {
      householdOwnerId: undefined,
      householdJoinedAt: null,
    });
  }
}

export function leaveHousehold(memberId: string) {
  const space = getMemberSpace(memberId);
  const ownerId = space.householdOwnerId;
  if (!ownerId) {
    throw new Error("You’re not on a household.");
  }
  removeHouseholdMember(ownerId, memberId);
}
