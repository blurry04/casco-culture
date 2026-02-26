import { EventDetailView } from '@/components/events/event-detail-view';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return <EventDetailView id={params.id} />;
}
