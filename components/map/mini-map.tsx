'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { EventItem } from '@/lib/types';
import { getMapboxToken } from '@/lib/supabase/env';
import { Card } from '@/components/ui/card';

mapboxgl.accessToken = getMapboxToken();

export function MiniMap({ events }: { events: EventItem[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-70.2553, 43.6591],
      zoom: 11
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.getContainer()) return;
    const markers: mapboxgl.Marker[] = [];

    events.forEach((event) => {
      const popup = new mapboxgl.Popup({ offset: 14 }).setHTML(`<div style="padding:2px"><a href="/event/${event.id}" style="color:white;text-decoration:none;font-weight:600">${event.title}</a><p style="margin-top:2px;color:#9ca3af;font-size:12px">${event.venue.name}</p></div>`);
      const marker = new mapboxgl.Marker({ color: '#2dd4bf' });
      marker.setLngLat([event.venue.lng, event.venue.lat]).setPopup(popup);
      marker.addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [events]);

  return (
    <Card className='sticky top-20 overflow-hidden'>
      <div ref={mapContainer} className='h-[540px] w-full' />
      <div className='border-t border-border p-3 text-sm text-muted-foreground'>Prefer a full-screen map? <Link href='/map' className='text-primary underline-offset-4 hover:underline'>Open map view</Link></div>
    </Card>
  );
}
