import type { EventItem } from '@/lib/types';

export function eventToICS(event: EventItem) {
  const start = new Date(event.start_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = (event.end_time ? new Date(event.end_time) : new Date(new Date(event.start_time).getTime() + 2 * 60 * 60 * 1000))
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PulseTonight//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@pulsetonight.local`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
    `LOCATION:${event.venue.name}, ${event.venue.address}, ${event.venue.city}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
