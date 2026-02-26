'use client';

import { useMemo } from 'react';
import { EventCard } from '@/components/events/event-card';
import { EmptyState } from '@/components/events/empty-state';
import { EventSkeleton } from '@/components/events/event-skeleton';
import { useEvents, useLocalSavedIds, useSavedEvents } from '@/lib/queries/hooks';

export default function SavedPage() {
  const savedQuery = useSavedEvents();
  const allQuery = useEvents({ timeframe: 'all' });
  const localIds = useLocalSavedIds();

  const merged = useMemo(() => {
    const remote = savedQuery.data ?? [];
    if (remote.length > 0) return remote;
    const all = allQuery.data ?? [];
    return all.filter((event) => localIds.includes(event.id));
  }, [allQuery.data, localIds, savedQuery.data]);

  return (
    <div className='container space-y-6 py-8'>
      <h1 className='text-3xl font-semibold'>Saved Events</h1>
      {savedQuery.isLoading && (
        <div className='space-y-4'>
          <EventSkeleton />
          <EventSkeleton />
        </div>
      )}
      {!savedQuery.isLoading && merged.length === 0 ? <EmptyState title='No saved events yet' description='Tap the heart icon on any event to keep your plan for later.' /> : null}
      <div className='grid gap-4 md:grid-cols-2'>{merged.map((event) => <EventCard key={event.id} event={event} isSaved />)}</div>
    </div>
  );
}
