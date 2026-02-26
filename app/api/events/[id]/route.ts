import { NextResponse } from 'next/server';
import { getEventById } from '@/lib/supabase/queries';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await getEventById(params.id);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  } catch {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
}
