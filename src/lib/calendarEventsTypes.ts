/** Client-safe calendar event types */

export type CalendarEventSource =
  | "villages-entertainment"
  | "entertainment-html"
  | "curated"
  | "hub";

export type CalendarEvent = {
  id: string;
  title: string;
  /** YYYY-MM-DD (America/New_York calendar day) */
  date: string;
  /** Display time e.g. "6:00 PM" or range */
  timeLabel?: string;
  startIso?: string;
  endIso?: string;
  venue?: string;
  location?: string;
  description?: string;
  url?: string;
  category: string;
  source: CalendarEventSource;
  sourceLabel: string;
};

export type CalendarEventsStore = {
  updatedAt: string | null;
  sources: string[];
  events: CalendarEvent[];
  eventCount: number;
  lastError?: string | null;
  lastRefreshSource?: string | null;
};
