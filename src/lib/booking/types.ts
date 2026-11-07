export const PLATFORMS = ["GOOGLE_MEET", "ZOOM", "WHATSAPP", "TELEGRAM"] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  GOOGLE_MEET: "Google Meet",
  ZOOM: "Zoom",
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
};

export const PLATFORM_DESCRIPTIONS: Record<Platform, string> = {
  GOOGLE_MEET: "A video room created automatically inside the Google Calendar invite.",
  ZOOM: "A scheduled Zoom meeting with a join link and waiting room.",
  WHATSAPP: "Chat with me on WhatsApp at the agreed time.",
  TELEGRAM: "Join my Telegram chat — I post the room there.",
};

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  ACCEPTING: "ACCEPTING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export function isPlatform(value: unknown): value is Platform {
  return typeof value === "string" && (PLATFORMS as readonly string[]).includes(value);
}

export function platformLabel(value: string): string {
  return isPlatform(value) ? PLATFORM_LABELS[value] : value;
}

export const DURATIONS = [30, 45, 60, 90] as const;

/** Minimum lead time before a proposed meeting may start. */
export const MIN_LEAD_MINUTES = 60;
/** How far ahead visitors may propose a meeting. */
export const MAX_ADVANCE_DAYS = 180;
