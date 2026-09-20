"use client";

import { HubMemberTools } from "@/components/HubMemberTools";
import { MySpaceInvestmentsBoard } from "@/components/MySpaceInvestmentsBoard";
import { MySpaceCalendarBoard, MySpaceHealthLog } from "@/components/MySpaceModules";
import {
  MySpaceEntertainmentBoard,
  MySpaceGolfLogBoard,
  MySpaceNewsBoard,
  MySpacePickleballLogBoard,
} from "@/components/MySpaceNextBoards";
import { HUB_MEMBER_SLOTS } from "@/lib/hubMemberBridges";

export function GolfHubMemberTools() {
  return (
    <HubMemberTools slot={HUB_MEMBER_SLOTS.golf}>
      <MySpaceGolfLogBoard />
    </HubMemberTools>
  );
}

export function PickleballHubMemberTools() {
  return (
    <HubMemberTools slot={HUB_MEMBER_SLOTS.pickleball}>
      <MySpacePickleballLogBoard />
    </HubMemberTools>
  );
}

export function HealthHubMemberTools() {
  return (
    <HubMemberTools slot={HUB_MEMBER_SLOTS.health}>
      <MySpaceHealthLog />
    </HubMemberTools>
  );
}

export function WealthHubMemberTools() {
  return (
    <HubMemberTools slot={HUB_MEMBER_SLOTS.wealth}>
      <MySpaceInvestmentsBoard />
    </HubMemberTools>
  );
}

export function NewsHubMemberTools() {
  return (
    <HubMemberTools slot={HUB_MEMBER_SLOTS.news}>
      <MySpaceNewsBoard />
    </HubMemberTools>
  );
}

export function CalendarHubMemberTools() {
  return (
    <HubMemberTools slot={HUB_MEMBER_SLOTS.calendar}>
      <MySpaceCalendarBoard />
    </HubMemberTools>
  );
}

export function EntertainmentHubMemberTools() {
  return (
    <HubMemberTools slot={HUB_MEMBER_SLOTS.entertainment}>
      <MySpaceEntertainmentBoard />
    </HubMemberTools>
  );
}
