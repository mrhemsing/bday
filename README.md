# Hemsing Birthday Tracker

A polished, minimal family birthday tracker built with Next.js, TypeScript, Tailwind, and Supabase.

## What it does

- Public upcoming birthdays dashboard
- Simple admin area for adding, editing, archiving, and deleting people
- Age-on-next-birthday calculations
- Today / this week / this month groupings
- Supabase-backed persistence with SQL migration and seed data

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env.local
```

3. Fill in these variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Notes:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` come from your Supabase project settings.
- `SUPABASE_SERVICE_ROLE_KEY` is used server-side for simple phase-1 admin CRUD.
- `ADMIN_EMAIL` should match the Supabase Auth user allowed into `/admin`.
- `ADMIN_PASSWORD` is reserved for future convenience flows and can stay blank for now.

4. Create the database schema in Supabase SQL editor using:

- `supabase/migrations/001_create_people.sql`

5. Seed sample records using:

- `supabase/seed.sql`

6. Create a Supabase Auth email/password user for the admin email.

7. Run the app:

```bash
npm run dev
```

Open http://localhost:3000

## Routes

- `/` upcoming birthdays dashboard
- `/admin` admin list view
- `/admin/new` add person
- `/admin/[id]` edit person
- `/admin/login` admin sign-in

## Deployment

Deploy to Vercel or another Next.js host.

Set the same environment variables in your deployment platform, then connect the project to your Supabase instance.

## Notes on auth

Phase 1 keeps auth intentionally lightweight:
- Public home page is viewable
- Admin pages require Supabase Auth sign-in
- Admin access is limited to the configured `ADMIN_EMAIL`

## Project status

This is the polished v1 foundation. The next pass should finish:
- month-name browsing
- better loading/error states in forms
- optional archived toggle polish
- production validation and final QA
