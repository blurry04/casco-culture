import { format } from 'date-fns';
import type { EventItem } from '@/lib/types';

export function formatEventTime(event: EventItem) {
  const start = new Date(event.start_time);
  const end = event.end_time ? new Date(event.end_time) : null;
  return `${format(start, 'EEE, MMM d')} • ${format(start, 'h:mm a')}${end ? ` - ${format(end, 'h:mm a')}` : ''}`;
}

export function formatPrice(event: EventItem) {
  if (event.price_type === 'free') {
    return 'Free';
  }
  if (event.price_min && event.price_max) {
    return `$${event.price_min}-$${event.price_max}`;
  }
  if (event.price_min) {
    return `From $${event.price_min}`;
  }
  return 'Paid';
}

export function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
