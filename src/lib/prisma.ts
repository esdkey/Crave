import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
  // Prisma 7 requires a driver adapter. The Prisma schema is PostgreSQL
  // (Neon/Railway), so a PostgreSQL connection string is required.
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("postgres")) {
    throw new Error(
      "DATABASE_URL must be set to a PostgreSQL connection string (e.g. from Neon). " +
        "On Railway add DATABASE_URL to the service variables. For local dev, keep it in .env.",
    );
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
