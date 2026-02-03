import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Site-wide password gate
  const sitePassword = process.env.SITE_PASSWORD?.trim();
  if (sitePassword) {
    const authCookie = request.cookies.get("site-auth")?.value;
    if (authCookie !== sitePassword && !request.nextUrl.pathname.startsWith("/gate")) {
      return NextResponse.redirect(new URL("/gate", request.url));
    }
  }

  const { supabaseResponse, user } = await updateSession(request);

  // All routes are accessible without login
  // Authentication is only required for data persistence
  // No route protection needed - just refresh the session

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|api/tracker|api/oracle|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
