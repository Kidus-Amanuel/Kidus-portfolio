export interface IcsEvent {
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  url?: string;
  start: Date;
  end: Date;
  organizerName?: string;
  organizerEmail?: string;
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Build a calendar invite (.ics) used as the fallback for the Google Calendar
 * API — attaching it to the confirmation email gives both sides a real
 * calendar entry (and therefore a reminder) without any Google credentials.
 */
export function buildIcs(event: IcsEvent): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kidus Amanuel//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(event.start)}`,
    `DTEND:${toIcsDate(event.end)}`,
    `SUMMARY:${escapeText(event.summary)}`,
  ];

  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.url) lines.push(`URL:${event.url}`);
  if (event.organizerName && event.organizerEmail) {
    lines.push(`ORGANIZER;CN=${escapeText(event.organizerName)}:mailto:${event.organizerEmail}`);
  }

  // 24h and 1h reminders — mirrors the Google Calendar default reminders.
  lines.push("BEGIN:VALARM", "TRIGGER:-PT24H", "ACTION:DISPLAY", `DESCRIPTION:${escapeText(event.summary)}`, "END:VALARM");
  lines.push("BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", `DESCRIPTION:${escapeText(event.summary)}`, "END:VALARM");

  lines.push("END:VEVENT", "END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
