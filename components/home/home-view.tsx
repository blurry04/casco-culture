'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map } from 'lucide-react';
import type { EventItem } from '@/lib/types';
import { useEvents, useSavedEvents } from '@/lib/queries/hooks';
import { Button } from '@/components/ui/button';
import { Filters, type FiltersState } from '@/components/home/filters';
import { EventCard } from '@/components/events/event-card';
import { EventSkeleton } from '@/components/events/event-skeleton';
import { EmptyState } from '@/components/events/empty-state';
import { MiniMap } from '@/components/map/mini-map';

const defaultFilters: FiltersState = {
  timeframe: 'tonight'
};

function getDateRange(selectedDate?: string) {
  if (!selectedDate) return { from: undefined, to: undefined };
  const from = new Date(`${selectedDate}T00:00:00`);
  const to = new Date(`${selectedDate}T23:59:59`);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function HomeView() {
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [showMap, setShowMap] = useState(false);

  const customDateRange = getDateRange(filters.selectedDate);
  const eventsQuery = useEvents({
    timeframe: filters.timeframe,
    category: filters.category,
    q: filters.q,
    price: filters.price,
    from: customDateRange.from,
    to: customDateRange.to
  });
  const savedQuery = useSavedEvents();

  const savedIds = useMemo(() => new Set((savedQuery.data ?? []).map((event) => event.id)), [savedQuery.data]);
  const events = (eventsQuery.data ?? []) as EventItem[];

  const hasActiveFilters = Boolean(filters.category || filters.price || filters.q || filters.selectedDate);

  return (
    <div className='container space-y-8 py-8'>
      <section className='space-y-2'>
        <p className='text-sm uppercase tracking-[0.2em] text-primary'>PulseTonight</p>
        <h1 className='text-4xl font-semibold tracking-tight md:text-5xl'>Tonight in Portland</h1>
        <p className='max-w-2xl text-muted-foreground'>An event-first guide to discover live sets, food pop-ups, movement classes, and community gatherings around Portland, Maine.</p>
      </section>

      <Filters value={filters} onChange={setFilters} />

      <section className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-sm text-muted-foreground'>
          {eventsQuery.isLoading ? 'Loading events...' : `${events.length} event${events.length === 1 ? '' : 's'} found`}
        </p>
        {hasActiveFilters ? (
          <Button variant='ghost' onClick={() => setFilters(defaultFilters)}>
            Reset filters
          </Button>
        ) : null}
      </section>

      <section className='grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='space-y-4'>
          <Button variant='outline' className='lg:hidden' onClick={() => setShowMap((prev) => !prev)}>
            <Map className='mr-2 h-4 w-4' />
            {showMap ? 'Hide map' : 'Show map'}
          </Button>
          <AnimatePresence mode='popLayout'>
            {eventsQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <EventSkeleton key={index} />)}
            {!eventsQuery.isLoading && events.length === 0 && <EmptyState title='No events match these filters' description='Try switching timeframe, clearing category, or using Reset filters.' />}
            {!eventsQuery.isLoading &&
              events.map((event) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <EventCard event={event} isSaved={savedIds.has(event.id)} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <div className={showMap ? 'block' : 'hidden lg:block'}>
          <MiniMap events={events} />
        </div>
      </section>
    </div>
  );
}
