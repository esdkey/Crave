import "server-only";
import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { Role } from "@/generated/prisma/client";

export type SessionData = {
  userId?: string;
  name?: string;
  email?: string;
  role?: Role;
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

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions,
  );
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  return session as IronSession<SessionData> & SessionData;
}
