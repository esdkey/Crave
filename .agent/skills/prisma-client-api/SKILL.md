---
name: prisma-client-api
description: Prisma Client API reference covering model queries, filters, operators, and client methods. Use when writing database queries, using CRUD operations, filtering data, or configuring Prisma Client. Triggers on "prisma query", "findMany", "create", "update", "delete", "$transaction".
license: MIT
metadata:
  author: prisma
  version: "7.9.1"
---

# Prisma Client API Reference

Complete reference for Prisma Client query API.

## When to Apply

Use when:
- Writing database queries with Prisma
- Performing CRUD operations
- Filtering or sorting data
- Using transactions
- Configuring Prisma Client instantiation

## Client Instantiation

```typescript
// lib/prisma.ts — singleton pattern for Next.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Model Query Methods

| Method | Description |
|---|---|
| `findUnique` | Find single record by unique field |
| `findFirst` | Find first matching record |
| `findMany` | Find multiple records |
| `create` | Create single record |
| `createMany` | Create multiple records |
| `update` | Update single record |
| `updateMany` | Update multiple records |
| `upsert` | Create or update |
| `delete` | Delete single record |
| `deleteMany` | Delete multiple records |
| `count` | Count matching records |
| `aggregate` | Aggregate operations |

## Quick Examples

### Find records

```typescript
// Find all products
const products = await prisma.product.findMany({
  where: { isAvailable: true },
  orderBy: { createdAt: 'desc' },
})

// Find one by ID
const product = await prisma.product.findUnique({
  where: { id: productId },
  include: { orders: true },
})
```

### Create records

```typescript
const order = await prisma.order.create({
  data: {
    customerName: 'Ahmed',
    phone: '01012345678',
    address: 'Cairo, Egypt',
    paymentMethod: 'COD',
    productId: 'product-id',
  },
})
```

### Update records

```typescript
await prisma.order.update({
  where: { id: orderId },
  data: { status: 'SHIPPED' },
})
```

### Delete records

```typescript
await prisma.product.delete({ where: { id } })
```

### Transactions

```typescript
const [order, _] = await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.product.update({ where: { id }, data: { internalStock: { decrement: 1 } } }),
])
```

## Query Options

- `where` — filter conditions
- `select` — pick specific fields
- `include` — include relations
- `orderBy` — sort results
- `skip` / `take` — pagination
- `distinct` — distinct values

## Filter Operators

```typescript
where: {
  price: { gte: 100, lte: 500 },
  nameAr: { contains: 'عود', mode: 'insensitive' },
  status: { in: ['PROCESSING', 'SHIPPED'] },
  createdAt: { gte: new Date('2024-01-01') },
}
```
