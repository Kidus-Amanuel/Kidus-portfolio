import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { buildGoogleAuthUrl } from "@/lib/booking/google-calendar";

export const dynamic = "force-dynamic";

/**
 * Step 1 of the Google OAuth dance: send the admin to the consent screen.
 * The random state is stored in an httpOnly cookie and verified in the
 * callback to block CSRF on the connect flow.
 */
export async function GET(request: Request) {
  const state = randomUUID();

  cookies().set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  const authUrl = await buildGoogleAuthUrl(state);

  if (!authUrl) {
    return NextResponse.redirect(
      new URL("/admin/integrations?google=missing-client-id", request.url),
    );
  }

  return NextResponse.redirect(authUrl);
}
