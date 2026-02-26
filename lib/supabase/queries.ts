import { createClient } from '@/lib/supabase/server';
import { getTimeframeRange } from '@/lib/utils/timeframe';
import type { Artist, EventCategory, EventItem, Timeframe, Venue } from '@/lib/types';

type Filters = {
  timeframe: Timeframe;
  category?: EventCategory;
  q?: string;
  price?: 'free' | 'paid';
  from?: string;
  to?: string;
};

type RawEventRecord = Omit<EventItem, 'venue' | 'artist'> & {
  venue: Venue | Venue[] | null;
  artist: Artist | Artist[] | null;
};

type SavedEventRow = {
  event: RawEventRecord | RawEventRecord[] | null;
};

const eventSelect = `
  id,
  title,
  description,
  category,
  start_time,
  end_time,
  price_type,
  price_min,
  price_max,
  ticket_url,
  image_url,
  venue_id,
  artist_id,
  venue:venues(*),
  artist:artists(*)
`;

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function normalizeEvent(record: RawEventRecord): EventItem {
  const venue = firstOrNull<Venue>(record.venue);
  const artist = firstOrNull<Artist>(record.artist);

  if (!venue) {
    throw new Error('Event is missing venue relation');
  }

  return {
    ...record,
    venue,
    artist
  } as EventItem;
}

export async function getEvents(filters: Filters) {
  const supabase = createClient();
  const baseRange = getTimeframeRange(filters.timeframe);
  const from = filters.from ? new Date(filters.from) : baseRange.from;
  const to = filters.to ? new Date(filters.to) : baseRange.to;

  let query = supabase.from('events').select(eventSelect).gte('start_time', from.toISOString()).lte('start_time', to.toISOString()).order('start_time', { ascending: true }).limit(120);

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.price) query = query.eq('price_type', filters.price);
  const { data, error } = await query;
  if (error) throw error;
  const normalized = ((data ?? []) as RawEventRecord[]).map(normalizeEvent);
  if (!filters.q) return normalized;

  const q = filters.q.toLowerCase();
  return normalized.filter((event) => {
    const haystack = [event.title, event.description, event.venue?.name ?? '', event.artist?.name ?? ''].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export async function getEventById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from('events').select(eventSelect).eq('id', id).single();
  if (error) throw error;

  const { data: related } = await supabase
    .from('events')
    .select(eventSelect)
    .neq('id', id)
    .or(`venue_id.eq.${data.venue_id},category.eq.${data.category}`)
    .order('start_time', { ascending: true })
    .limit(6);

  return {
    event: normalizeEvent(data as RawEventRecord),
    related: ((related ?? []) as RawEventRecord[]).map(normalizeEvent)
  };
}

export async function getSavedEvents(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('saved_events')
    .select('event:events(id,title,description,category,start_time,end_time,price_type,price_min,price_max,ticket_url,image_url,venue_id,artist_id,venue:venues(*),artist:artists(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return ((data ?? []) as SavedEventRow[])
    .map((item) => firstOrNull(item.event))
    .filter((event): event is RawEventRecord => Boolean(event))
    .map((event) => normalizeEvent(event));
}
