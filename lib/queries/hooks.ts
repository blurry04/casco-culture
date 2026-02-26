'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EventItem } from '@/lib/types';
import { fetchEventById, fetchEvents, fetchSavedEvents, toggleSaved, type EventFilters } from '@/lib/queries/api';

const localKey = 'pulsetonight:saved';

function getLocalSavedIds() {
  if (typeof window === 'undefined') return [] as string[];
  try {
    return JSON.parse(localStorage.getItem(localKey) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function setLocalSavedIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(localKey, JSON.stringify(ids));
}

export function useEvents(filters: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters)
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id),
    enabled: Boolean(id)
  });
}

export function useSavedEvents() {
  return useQuery({
    queryKey: ['saved-events'],
    queryFn: fetchSavedEvents,
    retry: 1,
    placeholderData: []
  });
}

export function useToggleSaved() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => toggleSaved(eventId),
    onMutate: async (eventId) => {
      await queryClient.cancelQueries({ queryKey: ['saved-events'] });
      const previous = queryClient.getQueryData<EventItem[]>(['saved-events']) ?? [];
      const isSaved = previous.some((event) => event.id === eventId);
      const next = isSaved ? previous.filter((event) => event.id !== eventId) : previous;
      queryClient.setQueryData(['saved-events'], next);

      const localIds = getLocalSavedIds();
      if (isSaved) {
        setLocalSavedIds(localIds.filter((id) => id !== eventId));
      } else {
        setLocalSavedIds(Array.from(new Set([...localIds, eventId])));
      }

      return { previous };
    },
    onError: (_error, _eventId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['saved-events'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] });
    }
  });
}

export function useLocalSavedIds() {
  return getLocalSavedIds();
}
