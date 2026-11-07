import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect all /admin routes with Basic Auth, plus the OAuth initiation route.
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isOAuthStart = request.nextUrl.pathname === "/api/google/connect";

  if (isAdminRoute || isOAuthStart) {
    const basicAuth = request.headers.get("authorization");
    const adminPassword = process.env.ADMIN_PASSWORD ?? "kidus-admin";

    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");
      if (user === "kidus" && pwd === adminPassword) {
        return NextResponse.next();
      }
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/google/connect"],
};
