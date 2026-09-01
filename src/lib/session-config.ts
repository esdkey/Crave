// Shared session config/types usable both in Node (lib/session.ts) and
// Edge middleware (middleware.ts). Keep this file free of prisma and
// next/headers imports so it runs in both runtimes.

export type SessionData = {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  isLoggedIn: boolean;
};

export const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "change-me-to-a-long-random-string",
  cookieName: "crave_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};
