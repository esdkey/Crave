---
name: prisma-database-setup
description: Guides for configuring Prisma with different database providers (PostgreSQL, MySQL, SQLite, MongoDB, etc.). Use when setting up a new project, changing databases, or troubleshooting connection issues. Triggers on "configure postgres", "connect to mysql", "setup mongodb", "sqlite setup".
license: MIT
metadata:
  author: prisma
  version: "7.6.0"
---

# Prisma Database Setup

Complete guide for setting up Prisma ORM with various database providers.

## When to Apply

Use this skill when:
- Setting up Prisma in a new project
- Connecting to a specific database provider
- Troubleshooting database connection issues
- Changing database providers
- Configuring connection pooling

## System Prerequisites

```bash
npm install prisma @prisma/client
npx prisma init
```

## Supported Databases

| Database | Provider String | Notes |
|---|---|---|
| PostgreSQL | `postgresql` | Recommended for production |
| MySQL | `mysql` | |
| SQLite | `sqlite` | Local dev only |
| MongoDB | `mongodb` | Requires replica set |
| SQL Server | `sqlserver` | |
| CockroachDB | `cockroachdb` | |

## Configuration Files

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### `.env`

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

## PostgreSQL Setup (Recommended for Crave)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Railway PostgreSQL URL format:**
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```

## Prisma Client Setup (Required)

After schema changes, always run:

```bash
npx prisma generate      # Regenerate client
npx prisma migrate dev   # Apply migrations (dev)
npx prisma migrate deploy # Apply migrations (production)
```

## Driver Adapters

For edge environments (Vercel Edge, Cloudflare Workers), use a driver adapter:

```bash
npm install @prisma/adapter-neon
```

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}
```

## How to Use

1. Install Prisma: `npm install prisma @prisma/client`
2. Initialize: `npx prisma init`
3. Set `DATABASE_URL` in `.env`
4. Define schema in `prisma/schema.prisma`
5. Run `npx prisma migrate dev --name init`
6. Import and use: `import { PrismaClient } from '@prisma/client'`
