import "server-only";
import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { Role } from "@/generated/prisma/client";
import { sessionOptions, type SessionData } from "@/lib/session-config";

type ServerSessionData = SessionData & { role?: Role };

export { sessionOptions };

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<ServerSessionData>(
    cookieStore,
    sessionOptions,
  );
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  return session as IronSession<ServerSessionData> & ServerSessionData;
}
