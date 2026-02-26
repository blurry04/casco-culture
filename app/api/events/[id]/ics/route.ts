import { NextResponse } from 'next/server';
import { getEventById } from '@/lib/supabase/queries';
import { eventToICS } from '@/lib/utils/ics';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { event } = await getEventById(params.id);
    const ics = eventToICS(event);

    return new NextResponse(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics"`
      }
    });
  } catch {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
}
