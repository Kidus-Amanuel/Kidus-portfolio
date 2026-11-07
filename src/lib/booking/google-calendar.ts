import { randomUUID } from "node:crypto";
import { getAppUrl, getSetting } from "@/lib/settings";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/o2/auth";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

/**
 * Full calendar scope — required so that the event is created on the real
 * calendar *and* Google sends the invitation email to the attendee
 * (`sendUpdates=all`). The narrower `calendar.events` scope does not allow
 * guest invitations.
 */
export const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  calendarId: string;
}

export async function getGoogleConfig(): Promise<GoogleCalendarConfig | null> {
  const [clientId, clientSecret, refreshToken, calendarId] = await Promise.all([
    getSetting("GOOGLE_CLIENT_ID"),
    getSetting("GOOGLE_CLIENT_SECRET"),
    getSetting("GOOGLE_REFRESH_TOKEN"),
    getSetting("GOOGLE_CALENDAR_ID"),
  ]);

  if (!clientId || !clientSecret || !refreshToken) return null;

  return {
    clientId,
    clientSecret,
    refreshToken,
    calendarId: calendarId || "primary",
  };
}

export async function isGoogleConfigured(): Promise<boolean> {
  return (await getGoogleConfig()) !== null;
}

export async function getGoogleRedirectUri(): Promise<string> {
  const appUrl = await getAppUrl();
  return `${appUrl}/api/google/callback`;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

export async function getGoogleAccessToken(): Promise<string | null> {
  const config = await getGoogleConfig();
  if (!config) return null;

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[GOOGLE CALENDAR] Token refresh failed with status ${response.status}.`);
      return null;
    }

    const data = (await response.json()) as TokenResponse;
    return data.access_token ?? null;
  } catch (error) {
    console.error("[GOOGLE CALENDAR] Token refresh error:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Exchange the OAuth `code` from the consent screen for a refresh token. */
export async function exchangeAuthorizationCode(code: string): Promise<string | null> {
  const clientId = await getSetting("GOOGLE_CLIENT_ID");
  const clientSecret = await getSetting("GOOGLE_CLIENT_SECRET");

  if (!clientId || !clientSecret) return null;

  const redirectUri = await getGoogleRedirectUri();

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    const data = (await response.json()) as TokenResponse;

    if (!response.ok) {
      console.error(
        `[GOOGLE CALENDAR] Authorization code exchange failed: ${data.error_description ?? data.error ?? response.status}`,
      );
      return null;
    }

    return data.refresh_token ?? null;
  } catch (error) {
    console.error("[GOOGLE CALENDAR] Authorization code exchange error:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Build the Google consent-screen URL for the "Connect" button. */
export async function buildGoogleAuthUrl(state: string): Promise<string | null> {
  const clientId = await getSetting("GOOGLE_CLIENT_ID");
  if (!clientId) return null;

  const redirectUri = await getGoogleRedirectUri();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_CALENDAR_SCOPE,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export interface CalendarEventInput {
  summary: string;
  description: string;
  location?: string;
  start: Date;
  end: Date;
  timeZone: string;
  attendeeEmail: string;
  attendeeName?: string;
  /** Request a Google Meet link to be generated for this event. */
  requestMeetLink: boolean;
}

export interface CalendarEventResult {
  ok: boolean;
  eventId?: string;
  htmlLink?: string;
  meetUrl?: string;
  error?: string;
}

interface CalendarEventResponse {
  id?: string;
  htmlLink?: string;
  conferenceData?: {
    entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
  };
  error?: { message?: string };
}

/**
 * Create the event on the host's calendar with the visitor as an attendee.
 *
 * `sendUpdates=all` is what makes Google email the invitation to the visitor
 * (and therefore give both sides calendar + reminder notifications).
 * `conferenceDataVersion=1` is what makes Google generate a Meet link.
 */
export async function createCalendarEvent(input: CalendarEventInput): Promise<CalendarEventResult> {
  const config = await getGoogleConfig();
  if (!config) {
    return { ok: false, error: "Google Calendar is not connected yet." };
  }

  const token = await getGoogleAccessToken();
  if (!token) {
    return { ok: false, error: "Google Calendar authorization failed — reconnect it in Integrations." };
  }

  const body: Record<string, unknown> = {
    summary: input.summary,
    description: input.description,
    start: { dateTime: input.start.toISOString(), timeZone: input.timeZone },
    end: { dateTime: input.end.toISOString(), timeZone: input.timeZone },
    attendees: [
      {
        email: input.attendeeEmail,
        ...(input.attendeeName ? { displayName: input.attendeeName } : {}),
      },
    ],
    guestsCanModify: false,
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: false,
    reminders: { useDefault: true },
  };

  if (input.location) body.location = input.location;

  if (input.requestMeetLink) {
    body.conferenceData = {
      createRequest: {
        requestId: `meet-${randomUUID()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
  }

  try {
    const response = await fetch(
      `${CALENDAR_API}/calendars/${encodeURIComponent(config.calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = (await response.json()) as CalendarEventResponse;

    if (!response.ok) {
      return {
        ok: false,
        error: data.error?.message ?? `Google Calendar returned status ${response.status}.`,
      };
    }

    const videoEntry = data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video" && entry.uri,
    );

    return {
      ok: true,
      eventId: data.id,
      htmlLink: data.htmlLink,
      meetUrl: videoEntry?.uri,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Google Calendar error",
    };
  }
}

interface FreeBusyResponse {
  calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }>;
}

/** Check the host calendar for conflicts in a window (used as an admin warning). */
export async function checkCalendarConflicts(
  start: Date,
  end: Date,
): Promise<{ checked: boolean; busy: boolean; error?: string }> {
  const config = await getGoogleConfig();
  if (!config) return { checked: false, busy: false };

  const token = await getGoogleAccessToken();
  if (!token) return { checked: false, busy: false };

  try {
    const response = await fetch(`${CALENDAR_API}/freeBusy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: config.calendarId }],
      }),
      cache: "no-store",
    });

    if (!response.ok) return { checked: false, busy: false };

    const data = (await response.json()) as FreeBusyResponse;
    const busy = data.calendars?.[config.calendarId]?.busy ?? [];
    return { checked: true, busy: busy.length > 0 };
  } catch {
    return { checked: false, busy: false };
  }
}
