import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function createPrismaClient() {
  // Prisma 7 requires a driver adapter. Production uses PostgreSQL (e.g.
  // Railway); local dev falls back to SQLite when no Postgres URL is set.
  const url = process.env.DATABASE_URL;
  const isPostgres = !!url && url.startsWith("postgres");
  if (isPostgres) {
    const adapter = new PrismaPg({ connectionString: url });
    return new PrismaClient({ adapter });
  }
  const adapter = new PrismaBetterSqlite3({
    url: url ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
