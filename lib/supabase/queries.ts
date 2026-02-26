import { createClient } from '@/lib/supabase/server';
import { getTimeframeRange } from '@/lib/utils/timeframe';
import type { EventCategory, Timeframe } from '@/lib/types';

type Filters = {
  timeframe: Timeframe;
  category?: EventCategory;
  q?: string;
  price?: 'free' | 'paid';
  from?: string;
  to?: string;
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
  if (!filters.q) return data;

  const q = filters.q.toLowerCase();
  return data.filter((event) => {
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

  return { event: data, related: related ?? [] };
}

export async function getSavedEvents(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('saved_events')
    .select('event:events(id,title,description,category,start_time,end_time,price_type,price_min,price_max,ticket_url,image_url,venue_id,artist_id,venue:venues(*),artist:artists(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => item.event);
}
