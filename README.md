# PulseTonight

**Your nightly guide to the best events in Portland, Maine.**

PulseTonight is an event-first discovery app to quickly find what to do tonight, tomorrow, or this weekend.

## Highlights

- Discover events by timeframe: Tonight, Tomorrow, Weekend, or All.
- Filter fast by category, price, date, and search.
- Save favorites, get tickets, and add events to calendar (.ics).
- Browse in both list and map views.

## Tech

Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui (Radix), Framer Motion, Mapbox GL, Supabase, TanStack Query, Zod.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env.local
```

3. Set required env vars in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

4. Apply DB schema:
- Run `supabase/migrations/202602260001_init.sql` in Supabase SQL Editor.

5. Seed data:
- Run `supabase/seed.sql` in Supabase SQL Editor.

6. Start app:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Core Routes

- `/` Home
- `/event/[id]` Event details
- `/map` Full map view
- `/login` Magic link login
- `/saved` Saved events

## Deploy

Deploy to Vercel and add the same env vars. In Supabase Auth settings, add:
- `http://localhost:3000/auth/callback`
- `https://<your-domain>/auth/callback`
