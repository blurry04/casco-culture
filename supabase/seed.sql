truncate table public.saved_events;
truncate table public.events cascade;
truncate table public.artists cascade;
truncate table public.venues cascade;

insert into public.venues (name, address, city, state, lat, lng, website_url)
values
  ('State Theatre', '609 Congress St', 'Portland', 'ME', 43.6566, -70.2626, 'https://example.com/state-theatre'),
  ('Port City Music Hall', '504 Congress St', 'Portland', 'ME', 43.6562, -70.2610, 'https://example.com/port-city-music-hall'),
  ('Thompson''s Point', '2 Thompsons Point', 'Portland', 'ME', 43.6544, -70.2867, 'https://example.com/thompsons-point'),
  ('Merrill Auditorium', '20 Myrtle St', 'Portland', 'ME', 43.6631, -70.2557, 'https://example.com/merrill-auditorium'),
  ('Bayside Bowl', '58 Alder St', 'Portland', 'ME', 43.6666, -70.2701, 'https://example.com/bayside-bowl'),
  ('Empire Comedy Club', '575 Congress St', 'Portland', 'ME', 43.6564, -70.2620, 'https://example.com/empire'),
  ('Rigby Yard', '50 Wharf St', 'Portland', 'ME', 43.6570, -70.2489, 'https://example.com/rigby-yard'),
  ('The Press Hotel Rooftop', '119 Exchange St', 'Portland', 'ME', 43.6586, -70.2546, 'https://example.com/press-hotel'),
  ('Apres', '148 Anderson St', 'Portland', 'ME', 43.6698, -70.2535, 'https://example.com/apres'),
  ('Oxbow Blending', '49 Washington Ave', 'Portland', 'ME', 43.6680, -70.2484, 'https://example.com/oxbow'),
  ('East End Community Studio', '45 North St', 'Portland', 'ME', 43.6686, -70.2453, 'https://example.com/east-end-studio'),
  ('Back Cove Pavilion', 'Preble St Ext', 'Portland', 'ME', 43.6761, -70.2698, 'https://example.com/back-cove'),
  ('Union Hall', '72 Temple St', 'Portland', 'ME', 43.6582, -70.2572, 'https://example.com/union-hall'),
  ('Old Port Loft', '10 Moulton St', 'Portland', 'ME', 43.6575, -70.2527, 'https://example.com/old-port-loft'),
  ('Casco Bay Innovation Hub', '1 Canal Plaza', 'Portland', 'ME', 43.6578, -70.2592, 'https://example.com/casco-hub');

insert into public.artists (name, genre, instagram_url)
values
  ('Sable Harbor', 'Indie Rock', 'https://instagram.com/sableharbor'),
  ('Neon Wharf', 'Electronic', 'https://instagram.com/neonwharf'),
  ('Pine & Salt', 'Folk', 'https://instagram.com/pineandsalt'),
  ('DJ Tidal Shift', 'House', 'https://instagram.com/djtidalshift'),
  ('Rosa Vale', 'Jazz', 'https://instagram.com/rosavale'),
  ('Anchor Laughs', 'Comedy', 'https://instagram.com/anchorlaughs'),
  ('Maya Kline', 'Yoga', 'https://instagram.com/mayakline'),
  ('Studio Drift', 'Dance', 'https://instagram.com/studiodrift'),
  ('Bayside Brass', 'Brass', 'https://instagram.com/baysidebrass'),
  ('Harborline Poets', 'Spoken Word', 'https://instagram.com/harborlinepoets'),
  ('The Lanterns', 'Alt Pop', 'https://instagram.com/thelanterns'),
  ('Coastline Collective', 'Soul', 'https://instagram.com/coastlinecollective'),
  ('Kai Rowan', 'Singer-Songwriter', 'https://instagram.com/kairowan'),
  ('Luna Comet', 'Synth Pop', 'https://instagram.com/lunacomet'),
  ('Portland Pulse Crew', 'Dance', 'https://instagram.com/pdxpulsecrew'),
  ('Milo Winters', 'Acoustic', 'https://instagram.com/milowinters'),
  ('Laugh Wharf', 'Comedy', 'https://instagram.com/laughwharf'),
  ('Elena Shore', 'Yoga', 'https://instagram.com/elenashore'),
  ('Night Ferry', 'Techno', 'https://instagram.com/nightferry'),
  ('Parker Dane', 'Hip-Hop', 'https://instagram.com/parkerdane'),
  ('Ari Penn', 'Workshop Host', 'https://instagram.com/aripenn'),
  ('Mae Brook', 'Workshop Host', 'https://instagram.com/maebrook'),
  ('Cedar Sound', 'Ambient', 'https://instagram.com/cedarsound'),
  ('Nora Fields', 'Folk', 'https://instagram.com/norafields'),
  ('Skyline Dialogues', 'Networking Host', 'https://instagram.com/skylinedialogues'),
  ('Mosaic Table', 'Food Collective', 'https://instagram.com/mosaictable'),
  ('Lighthouse Lates', 'Comedy', 'https://instagram.com/lighthouselates'),
  ('Waveform Union', 'Electronic', 'https://instagram.com/waveformunion'),
  ('Atlas Circuit', 'Rock', 'https://instagram.com/atlascircuit'),
  ('Ember Circle', 'Wellness', 'https://instagram.com/embercircle');

with v as (
  select id, name from public.venues
),
a as (
  select id, name from public.artists
),
series as (
  select gs as idx from generate_series(1, 60) gs
),
constructed as (
  select
    gen_random_uuid() as id,
    concat(
      case (idx % 8)
        when 0 then 'Late Night Jam at '
        when 1 then 'Sunset Sessions: '
        when 2 then 'Community Flow with '
        when 3 then 'Open Mic Spotlight: '
        when 4 then 'Afterwork Mixer: '
        when 5 then 'Food Lab Pop-up: '
        when 6 then 'Dance Floor Ritual: '
        else 'Creative Workshop: '
      end,
      (select name from a offset (idx % 30) limit 1)
    ) as title,
    concat('A curated Portland experience featuring ', (select name from a offset (idx % 30) limit 1), '. Expect premium production, local energy, and a welcoming crowd.') as description,
    (array['Music','Food','Dance','Comedy','Yoga','Workshop','Networking','Other'])[1 + (idx % 8)]::event_category as category,
    date_trunc('hour', now()) + ((idx % 10) || ' day')::interval + (((idx % 7) + 16) || ' hour')::interval as start_time,
    date_trunc('hour', now()) + ((idx % 10) || ' day')::interval + (((idx % 7) + 19) || ' hour')::interval as end_time,
    case when idx % 3 = 0 then 'free'::price_type else 'paid'::price_type end as price_type,
    case when idx % 3 = 0 then null else (10 + (idx % 4) * 5)::numeric end as price_min,
    case when idx % 3 = 0 then null else (20 + (idx % 5) * 8)::numeric end as price_max,
    case when idx % 4 = 0 then null else concat('https://tickets.example.com/event-', idx) end as ticket_url,
    (
      array[
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80'
      ]
    )[1 + (idx % 20)] as image_url,
    (select id from v offset (idx % 15) limit 1) as venue_id,
    (select id from a offset (idx % 30) limit 1) as artist_id
  from series
)
insert into public.events (id, title, description, category, start_time, end_time, price_type, price_min, price_max, ticket_url, image_url, venue_id, artist_id)
select id, title, description, category, start_time, end_time, price_type, price_min, price_max, ticket_url, image_url, venue_id, artist_id
from constructed;
