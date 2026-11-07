import { getSetting } from "@/lib/settings";

export interface ZoomMeeting {
  id: string;
  joinUrl: string;
  startUrl: string;
  password?: string;
}

export interface ZoomResult {
  ok: boolean;
  meeting?: ZoomMeeting;
  error?: string;
}

/**
 * Create a scheduled Zoom meeting using a Server-to-Server OAuth app.
 *
 * Server-to-Server OAuth does not support the `me` keyword, so a user id or
 * email (the host's Zoom account) is required.
 */
export async function createZoomMeeting(input: {
  topic: string;
  start: Date;
  durationMinutes: number;
  timeZone: string;
  agenda?: string;
}): Promise<ZoomResult> {
  const [accountId, clientId, clientSecret, userId] = await Promise.all([
    getSetting("ZOOM_ACCOUNT_ID"),
    getSetting("ZOOM_CLIENT_ID"),
    getSetting("ZOOM_CLIENT_SECRET"),
    getSetting("ZOOM_USER_ID"),
  ]);

  if (!accountId || !clientId || !clientSecret || !userId) {
    return {
      ok: false,
      error: "Zoom is not configured — add the account ID, client ID, client secret and host user ID.",
    };
  }

  try {
    const tokenResponse = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        cache: "no-store",
      },
    );

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      reason?: string;
    };

    if (!tokenResponse.ok || !tokenData.access_token) {
      return {
        ok: false,
        error: `Zoom token request failed: ${tokenData.reason ?? tokenData.error ?? tokenResponse.status}`,
      };
    }

    const meetingResponse = await fetch(
      `https://api.zoom.us/v2/users/${encodeURIComponent(userId)}/meetings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: input.topic,
          type: 2,
          start_time: input.start.toISOString(),
          duration: input.durationMinutes,
          timezone: input.timeZone,
          agenda: input.agenda ?? "",
          settings: {
            host_video: true,
            participant_video: false,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
          },
        }),
        cache: "no-store",
      },
    );

    const meetingData = (await meetingResponse.json()) as {
      id?: number | string;
      join_url?: string;
      start_url?: string;
      password?: string;
      message?: string;
      code?: number;
    };

    if (!meetingResponse.ok || !meetingData.join_url) {
      return {
        ok: false,
        error: `Zoom meeting creation failed: ${meetingData.message ?? `status ${meetingResponse.status}`}`,
      };
    }

    return {
      ok: true,
      meeting: {
        id: String(meetingData.id ?? ""),
        joinUrl: meetingData.join_url,
        startUrl: meetingData.start_url ?? meetingData.join_url,
        password: meetingData.password,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Zoom error",
    };
  }
}
