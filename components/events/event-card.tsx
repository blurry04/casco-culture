'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Heart, Ticket } from 'lucide-react';
import type { EventItem } from '@/lib/types';
import { formatEventTime, formatPrice } from '@/lib/utils/event';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToggleSaved } from '@/lib/queries/hooks';

type EventCardProps = {
  event: EventItem;
  isSaved?: boolean;
};

export function EventCard({ event, isSaved }: EventCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const toggle = useToggleSaved();

  return (
    <motion.div whileHover={shouldReduceMotion ? undefined : { y: -2 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
      <Card className='overflow-hidden'>
        <div className='relative h-40 w-full'>
          <img src={event.image_url ?? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'} alt={event.title} className='h-full w-full object-cover' />
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent' />
          <div className='absolute left-3 top-3 flex gap-2'>
            <Badge>{event.category}</Badge>
            <Badge variant='secondary'>{formatPrice(event)}</Badge>
          </div>
        </div>
        <CardContent className='space-y-3 p-4'>
          <div>
            <p className='text-sm text-muted-foreground'>{formatEventTime(event)}</p>
            <h3 className='line-clamp-1 text-lg font-semibold'>{event.title}</h3>
            <p className='line-clamp-1 text-sm text-muted-foreground'>
              {event.artist?.name ?? 'Curated lineup'} • {event.venue.name}
            </p>
          </div>
          <TooltipProvider>
            <div className='flex items-center gap-2'>
              <Button asChild className='flex-1'>
                <Link href={`/event/${event.id}`}>View Details</Link>
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSaved ? 'default' : 'secondary'}
                    size='icon'
                    aria-label='Save event'
                    onClick={() => toggle.mutate(event.id)}
                    disabled={toggle.isPending}
                  >
                    <Heart className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isSaved ? 'Saved' : 'Save event'}</TooltipContent>
              </Tooltip>
              {event.ticket_url ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant='outline' size='icon'>
                      <a href={event.ticket_url} target='_blank' rel='noreferrer' aria-label='Get tickets'>
                        <Ticket className='h-4 w-4' />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Get tickets</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant='outline' size='icon'>
                      <Link href={`/event/${event.id}`} aria-label='Open event'>
                        <ExternalLink className='h-4 w-4' />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Open event</TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </motion.div>
  );
}
