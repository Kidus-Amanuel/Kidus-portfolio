/**
 * Timezone helpers built on Intl only — no extra dependency.
 *
 * The booking form lets a visitor pick a wall-clock time in *their* timezone,
 * but everything is stored as a UTC instant. Converting wall-clock -> UTC
 * needs the zone offset *at that instant*, which is what
 * `zoneOffsetMs` computes and `zonedDateTimeToUtc` resolves (with one
 * refinement pass for DST boundaries).
 */

export const HOST_TIME_ZONE = "Africa/Nairobi";

export const COMMON_TIME_ZONES = [
  "Africa/Nairobi",
  "Africa/Addis_Ababa",
  "Africa/Johannesburg",
  "Africa/Cairo",
  "Africa/Lagos",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Stockholm",
  "Europe/Dublin",
  "Europe/Istanbul",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Pacific/Auckland",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Sao_Paulo",
  "UTC",
] as const;

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Offset of `timeZone` from UTC, in milliseconds, at the given instant. */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(instant)) {
    if (part.type !== "literal") parts[part.type] = part.value;
  }

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );

  return asUtc - instant.getTime();
}

/**
 * Convert a wall-clock date/time in an IANA zone to the matching UTC instant.
 * `date` is "YYYY-MM-DD", `time` is "HH:MM".
 */
export function zonedDateTimeToUtc(date: string, time: string, timeZone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error("Invalid date or time value.");
  }

  const wallClock = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  const firstOffset = zoneOffsetMs(new Date(wallClock), timeZone);
  let instant = wallClock - firstOffset;

  // One refinement pass: the offset used above may have been the one *before*
  // a DST transition, which would shift the result by an hour.
  const refinedOffset = zoneOffsetMs(new Date(instant), timeZone);
  if (refinedOffset !== firstOffset) {
    instant = wallClock - refinedOffset;
  }

  return new Date(instant);
}

export function formatInTimeZone(
  instant: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, ...options }).format(instant);
}

export function formatDateTimeInZone(instant: Date, timeZone: string): string {
  return formatInTimeZone(instant, timeZone, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatTimeInZone(instant: Date, timeZone: string): string {
  return formatInTimeZone(instant, timeZone, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** "2026-11-12" for use in <input type="date"> (host timezone). */
export function dateInputValue(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const map: Record<string, string> = {};
  for (const part of parts) if (part.type !== "literal") map[part.type] = part.value;
  return `${map.year}-${map.month}-${map.day}`;
}

/** "14:30" for use in <input type="time"> (host timezone). */
export function timeInputValue(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(instant);
  const map: Record<string, string> = {};
  for (const part of parts) if (part.type !== "literal") map[part.type] = part.value;
  return `${map.hour}:${map.minute}`;
}
