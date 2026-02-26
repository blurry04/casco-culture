import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/supabase/queries';
import { eventsQuerySchema } from '@/lib/validation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = eventsQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  try {
    const events = await getEvents(parsed.data);
    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  }
}
