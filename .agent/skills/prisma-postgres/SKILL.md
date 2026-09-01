---
name: prisma-postgres
description: Prisma Postgres setup and operations guidance across Console, create-db CLI, Management API, and Management API SDK. Use when creating Prisma Postgres databases, working in Prisma Console, provisioning with create-db/create-pg/create-postgres, or integrating programmatic provisioning with service tokens or OAuth.
license: MIT
metadata:
  author: prisma
  version: "7.9.1"
---

# Prisma Postgres

Guide for setting up and using PostgreSQL with Prisma, including Railway-hosted PostgreSQL.

## When to Apply

Use when:
- Connecting Prisma to a PostgreSQL database
- Setting up Railway PostgreSQL
- Configuring connection pooling for serverless/edge
- Provisioning a new database

## Quick Reference

| Task | Command/Action |
|---|---|
| Railway PostgreSQL URL | `postgresql://USER:PASS@HOST:PORT/DB` |
| Migrate schema | `npx prisma migrate dev` |
| Push schema (no migration) | `npx prisma db push` |
| Open Prisma Studio | `npx prisma studio` |

## Core Workflows

### 1. Railway PostgreSQL Setup

1. Create a new PostgreSQL service on [Railway](https://railway.app)
2. Copy the `DATABASE_URL` from Railway's PostgreSQL service variables
3. Add to `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/railway"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

### 2. Schema Setup

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 3. Connection Pooling for Vercel (Serverless)

For Vercel Edge/Serverless, use PgBouncer or Prisma Accelerate to avoid connection exhaustion:

```env
DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DB?pgbouncer=true&connection_limit=1"
```

Or use Prisma Accelerate:

```bash
npm install @prisma/extension-accelerate
```

```typescript
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
```

### 4. Production Migrations

Never use `migrate dev` in production. Use:

```bash
npx prisma migrate deploy
```

Add to your Vercel build command or Railway deploy script.

### 5. Prisma Studio (Local DB Management)

```bash
npx prisma studio
```

Opens a web UI at `localhost:5555` to browse and edit data.

## Troubleshooting

- **P1001**: Can't connect → check `DATABASE_URL` and network access
- **P2002**: Unique constraint violation → duplicate record
- **P2025**: Record not found → check `where` clause
