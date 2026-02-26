create extension if not exists "pgcrypto";

create type event_category as enum (
  'Music',
  'Food',
  'Dance',
  'Comedy',
  'Yoga',
  'Workshop',
  'Networking',
  'Other'
);

create type price_type as enum ('free', 'paid');

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null default 'Portland',
  state text not null default 'ME',
  lat double precision not null,
  lng double precision not null,
  website_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  genre text,
  instagram_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category event_category not null,
  start_time timestamptz not null,
  end_time timestamptz,
  price_type price_type not null,
  price_min numeric(8,2),
  price_max numeric(8,2),
  ticket_url text,
  image_url text,
  venue_id uuid not null references public.venues(id) on delete cascade,
  artist_id uuid references public.artists(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint events_price_check check (
    (price_type = 'free' and (price_min is null or price_min = 0) and (price_max is null or price_max = 0))
    or (price_type = 'paid')
  )
);

create table if not exists public.saved_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

create index if not exists idx_events_start_time on public.events (start_time);
create index if not exists idx_events_category on public.events (category);
create index if not exists idx_events_venue_id on public.events (venue_id);

alter table public.venues enable row level security;
alter table public.artists enable row level security;
alter table public.events enable row level security;
alter table public.saved_events enable row level security;

create policy "Public read venues" on public.venues for select using (true);
create policy "Public read artists" on public.artists for select using (true);
create policy "Public read events" on public.events for select using (true);

create policy "Users read own saves" on public.saved_events for select using (auth.uid() = user_id);
create policy "Users insert own saves" on public.saved_events for insert with check (auth.uid() = user_id);
create policy "Users delete own saves" on public.saved_events for delete using (auth.uid() = user_id);
