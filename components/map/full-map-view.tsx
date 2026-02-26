'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { ArrowRight } from 'lucide-react';
import type { EventItem } from '@/lib/types';
import { getMapboxToken } from '@/lib/supabase/env';
import { useEvents } from '@/lib/queries/hooks';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatEventTime, formatPrice } from '@/lib/utils/event';

mapboxgl.accessToken = getMapboxToken();

export function FullMapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { data } = useEvents({ timeframe: 'all' });
  const [selected, setSelected] = useState<EventItem | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-70.2553, 43.6591],
      zoom: 11.5
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !data) return;
    const map = mapRef.current;
    if (!map.getContainer()) return;
    const markers: mapboxgl.Marker[] = [];

    data.forEach((event) => {
      const markerEl = document.createElement('button');
      markerEl.className = 'h-4 w-4 rounded-full bg-cyan-300 ring-4 ring-cyan-300/25';
      markerEl.addEventListener('click', () => setSelected(event));

      const marker = new mapboxgl.Marker(markerEl).setLngLat([event.venue.lng, event.venue.lat]).addTo(map);
      markers.push(marker);
    });

    return () => markers.forEach((marker) => marker.remove());
  }, [data]);

  return (
    <div className='relative h-[calc(100vh-4rem)] w-full'>
      <div ref={mapContainer} className='h-full w-full' />
      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected ? (
            <div className='space-y-3'>
              <img src={selected.image_url ?? 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7'} alt={selected.title} className='h-44 w-full rounded-xl object-cover' />
              <div className='space-y-1'>
                <Badge>{selected.category}</Badge>
                <h2 className='text-xl font-semibold'>{selected.title}</h2>
                <p className='text-sm text-muted-foreground'>{formatEventTime(selected)}</p>
                <p className='text-sm text-muted-foreground'>
                  {selected.venue.name} • {formatPrice(selected)}
                </p>
              </div>
              <Button asChild className='w-full'>
                <Link href={`/event/${selected.id}`}>
                  Open event
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
