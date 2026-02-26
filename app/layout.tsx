import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarHeart, MapPinned } from 'lucide-react';
import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'PulseTonight',
  description: 'Discover the best events happening in Portland, Maine.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark'>
      <body>
        <QueryProvider>
          <header className='sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg'>
            <div className='container flex h-16 items-center justify-between'>
              <Link href='/' className='text-lg font-semibold tracking-tight'>
                PulseTonight
              </Link>
              <nav className='flex items-center gap-2 text-sm'>
                <Link href='/map' className='rounded-lg p-2 hover:bg-secondary'>
                  <MapPinned className='h-4 w-4' />
                  <span className='sr-only'>Map</span>
                </Link>
                <Link href='/saved' className='rounded-lg p-2 hover:bg-secondary'>
                  <CalendarHeart className='h-4 w-4' />
                  <span className='sr-only'>Saved</span>
                </Link>
                <Link href='/login' className='rounded-lg px-3 py-2 hover:bg-secondary'>
                  Login
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
