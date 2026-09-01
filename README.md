# Crave — Luxury Perfume Brand

A bilingual (Arabic default + English) showcase site and admin dashboard for the **Crave** perfume brand, built with Next.js (App Router), Prisma, and Tailwind CSS.

## Features

- **Showcase site** (`/ar` default, `/en` switchable, full RTL/LTR) — home, product listing, product detail with order form, about, brand story, contact.
- **Order form** — saves orders to the database, creates an in-dashboard notification, and sends a new-order alert to the admin via a **Telegram bot**.
- **Admin dashboard** (`/{lang}/dashboard`) — protected by login with role-based access (`ADMIN`, `SHIPPING`):
  - Overview stats
  - Product management (add / edit / delete) via a no-code form (bilingual names, descriptions, stories, price, stock, availability, featured, image URL)
  - Order management with status updates (Pending → Confirmed → Processing → Shipped → Delivered / Cancelled)
  - Customer list grouped by phone with total spent
  - Notifications with read / delete

## Tech stack

- Next.js 16 (App Router, Server Actions)
- Prisma ORM + SQLite locally (PostgreSQL-ready — swap provider + driver adapter for production)
- iron-session (auth), bcryptjs, zod
- Tailwind CSS v4
- i18n via locale routing and JSON dictionaries

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:

   ```bash
   cp .env.example .env
   ```

3. Set up the database and seed the admin user + demo products:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Default admin login

After seeding, log in at `/{lang}/dashboard` with the credentials from `.env` (default `ismail@crave.com` / `crave-admin-123`). Change them in `.env` before going live.

## Telegram notifications

Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env` to receive a new-order message in the admin's chat. If either is empty, notifications are disabled and the site still works.

## Production / PostgreSQL

The app is wired for SQLite in local dev. For deployment, switch the Prisma `provider` to `postgresql` (`prisma/schema.prisma`), swap the driver adapter in `src/lib/prisma.ts`, and point `DATABASE_URL` at your Postgres instance.
