import type { EventItem, Timeframe } from '@/lib/types';

export type EventFilters = {
  timeframe: Timeframe;
  category?: string;
  q?: string;
  price?: 'free' | 'paid';
  from?: string;
  to?: string;
};

function queryString(filters: EventFilters) {
  const params = new URLSearchParams();
  params.set('timeframe', filters.timeframe);
  if (filters.category) params.set('category', filters.category);
  if (filters.q) params.set('q', filters.q);
  if (filters.price) params.set('price', filters.price);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  return params.toString();
}

export async function fetchEvents(filters: EventFilters) {
  const res = await fetch(`/api/events?${queryString(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return (await res.json()) as EventItem[];
}

export async function fetchEventById(id: string) {
  const res = await fetch(`/api/events/${id}`);
  if (!res.ok) throw new Error('Failed to fetch event');
  return (await res.json()) as { event: EventItem; related: EventItem[] };
}

export async function fetchSavedEvents() {
  const res = await fetch('/api/saved', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch saved events');
  return (await res.json()) as EventItem[];
}

export async function toggleSaved(eventId: string) {
  const res = await fetch('/api/saved', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ eventId })
  });
  if (!res.ok) throw new Error('Failed to save event');
  return (await res.json()) as { saved: boolean };
}
