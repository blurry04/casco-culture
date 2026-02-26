import { z } from 'zod';
import { EVENT_CATEGORIES } from '@/lib/types';

export const eventsQuerySchema = z.object({
  timeframe: z.enum(['tonight', 'tomorrow', 'weekend', 'all']).default('tonight'),
  category: z.enum(EVENT_CATEGORIES).optional(),
  q: z.string().trim().max(120).optional(),
  price: z.enum(['free', 'paid']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional()
});

export const toggleSavedSchema = z.object({
  eventId: z.string().uuid()
});

export const eventSchema = z.object({
  title: z.string().min(1),
  ticket_url: z.string().url().optional().nullable()
});
