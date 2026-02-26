'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarPlus, ExternalLink, Heart, MapPin, Ticket } from 'lucide-react';
import { useEvent, useSavedEvents, useToggleSaved } from '@/lib/queries/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EventSkeleton } from '@/components/events/event-skeleton';
import { formatEventTime, formatPrice, mapsUrl } from '@/lib/utils/event';
import { MiniMap } from '@/components/map/mini-map';
import { EmptyState } from '@/components/events/empty-state';

export function EventDetailView({ id }: { id: string }) {
  const query = useEvent(id);
  const saved = useSavedEvents();
  const toggle = useToggleSaved();

  if (query.isLoading) {
    return (
      <div className='container space-y-4 py-8'>
        <EventSkeleton />
        <EventSkeleton />
      </div>
    );
  }

  if (!query.data) {
    return (
      <div className='container py-8'>
        <EmptyState title='Event not found' description='This event may have moved or been removed.' />
      </div>
    );
  }

  const { event, related } = query.data;
  const isSaved = (saved.data ?? []).some((item) => item.id === event.id);

  return (
    <div className='container space-y-8 py-8'>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='overflow-hidden rounded-3xl border border-border'>
        <img src={event.image_url ?? 'https://images.unsplash.com/photo-1496024840928-4c417adf211d'} alt={event.title} className='h-[360px] w-full object-cover' />
      </motion.div>

      <section className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='space-y-5'>
          <div className='space-y-2'>
            <Badge>{event.category}</Badge>
            <h1 className='text-4xl font-semibold'>{event.title}</h1>
            <p className='text-muted-foreground'>{event.artist?.name ?? 'Featured lineup'}</p>
            <p className='text-muted-foreground'>{formatEventTime(event)}</p>
            <p className='text-muted-foreground'>{formatPrice(event)}</p>
          </div>
          <p className='leading-relaxed text-muted-foreground'>{event.description}</p>
          <div className='flex flex-wrap gap-2'>
            <Button variant={isSaved ? 'default' : 'secondary'} onClick={() => toggle.mutate(event.id)}>
              <Heart className='mr-2 h-4 w-4' />
              Save
            </Button>
            {event.ticket_url ? (
              <Button asChild>
                <a href={event.ticket_url} target='_blank' rel='noreferrer'>
                  <Ticket className='mr-2 h-4 w-4' />
                  Tickets
                </a>
              </Button>
            ) : null}
            <Button asChild variant='outline'>
              <a href={`/api/events/${event.id}/ics`}>
                <CalendarPlus className='mr-2 h-4 w-4' />
                Add to Calendar
              </a>
            </Button>
          </div>

          <Card>
            <CardContent className='space-y-2 p-5'>
              <h2 className='text-lg font-semibold'>Venue</h2>
              <p className='text-muted-foreground'>{event.venue.name}</p>
              <p className='text-sm text-muted-foreground'>
                {event.venue.address}, {event.venue.city}, {event.venue.state}
              </p>
              <div className='flex gap-2'>
                <Button asChild variant='outline'>
                  <a href={mapsUrl(event.venue.lat, event.venue.lng)} target='_blank' rel='noreferrer'>
                    <MapPin className='mr-2 h-4 w-4' />
                    Open in Maps
                  </a>
                </Button>
                {event.venue.website_url ? (
                  <Button asChild variant='secondary'>
                    <a href={event.venue.website_url} target='_blank' rel='noreferrer'>
                      <ExternalLink className='mr-2 h-4 w-4' />
                      Venue Site
                    </a>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='space-y-4'>
          <MiniMap events={[event]} />
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Related Events</h2>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {related.map((item) => (
            <Card key={item.id} className='overflow-hidden'>
              <img src={item.image_url ?? 'https://images.unsplash.com/photo-1496024840928-4c417adf211d'} alt={item.title} className='h-36 w-full object-cover' />
              <CardContent className='space-y-2 p-4'>
                <h3 className='line-clamp-1 font-medium'>{item.title}</h3>
                <p className='text-xs text-muted-foreground'>{formatEventTime(item)}</p>
                <Button asChild variant='secondary' className='w-full'>
                  <Link href={`/event/${item.id}`}>View Event</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
