# PulseTonight

PulseTonight is an event-first discovery app for Portland, Maine built with Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui (Radix), Framer Motion, Mapbox GL JS, Supabase, TanStack Query, and Zod.

## Tech Stack

- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS + CSS variable design system (dark-first)
- shadcn/ui-style Radix components
- Framer Motion
- Mapbox GL JS
- Supabase Postgres + Auth (magic link)
- TanStack Query
- Zod
- ESLint + Prettier

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set values:

- `NEXT_PUBLIC_SUPABASE_URL` (or `SUPABASE_URL`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `SUPABASE_ANON_KEY`)
- `NEXT_PUBLIC_MAPBOX_TOKEN` (or `MAPBOX_TOKEN`)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a Supabase project.
2. Install the Supabase CLI if needed.
3. Link project:

```bash
supabase link --project-ref <your-project-ref>
```

4. Run migration:

```bash
supabase db push
```

5. Seed data (15 venues, 30 artists, 60 events):

```bash
supabase db execute --file supabase/seed.sql
```

## Database Contents

- `public.venues`
- `public.artists`
- `public.events`
- `public.saved_events`

Includes:

- enum constraints for category and price type
- indexes on `events(start_time)`, `events(category)`, `events(venue_id)`
- RLS on all tables
- public read policies for venues/artists/events
- authenticated per-user read/write policies for saved_events

## API Routes

- `GET /api/events?timeframe=tonight|tomorrow|weekend|all&category=&q=&price=&from=&to=`
- `GET /api/events/:id`
- `GET /api/saved`
- `POST /api/saved` (toggle save)
- `GET /api/events/:id/ics` (calendar download)

## Key Pages

- `/` Home (event-first list + map split)
- `/event/[id]` Event detail
- `/map` Full-screen event map with bottom sheet previews
- `/login` Magic link login
- `/saved` Saved events with optimistic + local fallback behavior

## Deploy to Vercel

1. Push this repo to Git provider.
2. Import into Vercel.
3. Add env vars from `.env.example`.
4. Deploy.

After deployment, ensure Supabase Auth redirect URL includes:

- `https://<your-domain>/auth/callback`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run format`
