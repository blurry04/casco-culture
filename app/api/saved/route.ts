import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSavedEvents } from '@/lib/supabase/queries';
import { toggleSavedSchema } from '@/lib/validation';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json([]);
  }

  try {
    const saved = await getSavedEvents(user.id);
    return NextResponse.json(saved, {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=120'
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load saved events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = toggleSavedSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { eventId } = parsed.data;

  const { data: existing } = await supabase.from('saved_events').select('event_id').eq('user_id', user.id).eq('event_id', eventId).maybeSingle();

  if (existing) {
    await supabase.from('saved_events').delete().eq('user_id', user.id).eq('event_id', eventId);
    return NextResponse.json({ saved: false });
  }

  const { error } = await supabase.from('saved_events').insert({ user_id: user.id, event_id: eventId });

  if (error) {
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
