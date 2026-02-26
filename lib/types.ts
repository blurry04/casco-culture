export const EVENT_CATEGORIES = [
  'Music',
  'Food',
  'Dance',
  'Comedy',
  'Yoga',
  'Workshop',
  'Networking',
  'Other'
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type EventItem = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  start_time: string;
  end_time: string | null;
  price_type: 'free' | 'paid';
  price_min: number | null;
  price_max: number | null;
  ticket_url: string | null;
  image_url: string | null;
  venue_id: string;
  artist_id: string | null;
  venue: Venue;
  artist: Artist | null;
};

export type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  website_url: string | null;
  created_at: string;
};

export type Artist = {
  id: string;
  name: string;
  genre: string | null;
  instagram_url: string | null;
  created_at: string;
};

export type Timeframe = 'tonight' | 'tomorrow' | 'weekend' | 'all';
