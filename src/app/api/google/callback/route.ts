import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeAuthorizationCode } from "@/lib/booking/google-calendar";
import { setSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

/**
 * Step 2 of the Google OAuth dance: swap the authorization code for a refresh
 * token and store it. With a refresh token the app can create calendar events
 * (and send invitations) on the host's real calendar without asking again.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value;

  cookies().delete("google_oauth_state");

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/admin/integrations?google=${reason}`, url.origin));

  if (!code) return fail("error");
  if (!state || !storedState || state !== storedState) return fail("state-mismatch");

  const refreshToken = await exchangeAuthorizationCode(code);
  if (!refreshToken) return fail("token-error");

  await setSetting("GOOGLE_REFRESH_TOKEN", refreshToken);

  return NextResponse.redirect(new URL("/admin/integrations?google=connected", url.origin));
}
