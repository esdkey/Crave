import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session-config";

// Protected dashboard routes (both languages). Redirects unauthenticated
// visitors to the login page for their current locale.
export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.isLoggedIn) {
    const { pathname } = req.nextUrl;
    const lang = pathname.startsWith("/en/") ? "en" : "ar";
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}/login`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/ar/dashboard/:path*", "/en/dashboard/:path*"],
};
