import { addDays, endOfDay, endOfWeek, startOfDay } from 'date-fns';
import type { Timeframe } from '@/lib/types';

export function getTimeframeRange(timeframe: Timeframe, now = new Date()) {
  if (timeframe === 'all') {
    return { from: startOfDay(now), to: addDays(now, 30) };
  }

  if (timeframe === 'tomorrow') {
    const tomorrow = addDays(now, 1);
    return { from: startOfDay(tomorrow), to: endOfDay(tomorrow) };
  }

  if (timeframe === 'weekend') {
    const from = startOfDay(now);
    const to = endOfWeek(now, { weekStartsOn: 1 });
    return { from, to };
  }

  return { from: now, to: endOfDay(now) };
}
