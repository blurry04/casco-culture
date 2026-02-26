'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { EVENT_CATEGORIES, type Timeframe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Command, CommandInput } from '@/components/ui/command';
import { cn } from '@/lib/utils/cn';

export type FiltersState = {
  timeframe: Timeframe;
  category?: string;
  q?: string;
  price?: 'free' | 'paid';
  selectedDate?: string;
};

function todayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function PriceFilters({ value, onChange }: { value: FiltersState; onChange: (next: FiltersState) => void }) {
  return (
    <div className='space-y-2 md:min-w-[360px]'>
      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Price</p>
      <div className='grid gap-2 sm:grid-cols-2 md:min-w-[360px]'>
        <Button
          className='h-9'
          variant={value.price === 'free' ? 'default' : 'secondary'}
          onClick={() => onChange({ ...value, price: value.price === 'free' ? undefined : 'free' })}
        >
          Free
        </Button>
        <Button
          className='h-9'
          variant={value.price === 'paid' ? 'default' : 'secondary'}
          onClick={() => onChange({ ...value, price: value.price === 'paid' ? undefined : 'paid' })}
        >
          Paid
        </Button>
      </div>
    </div>
  );
}

function DateFilter({ value, onChange }: { value: FiltersState; onChange: (next: FiltersState) => void }) {
  return (
    <div className='space-y-2'>
      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Date</p>
      <div className='flex gap-2'>
        <Input
          type='date'
          min={todayIsoDate()}
          value={value.selectedDate ?? ''}
          onChange={(event) => onChange({ ...value, selectedDate: event.target.value || undefined, timeframe: 'all' })}
          aria-label='Pick a date'
          className='h-9 w-full max-w-[220px] text-sm'
        />
        {value.selectedDate ? (
          <Button variant='outline' size='icon' className='h-9 w-9' aria-label='Clear date filter' onClick={() => onChange({ ...value, selectedDate: undefined })}>
            <X className='h-4 w-4' />
          </Button>
        ) : null}
      </div>
      <p className='text-xs text-muted-foreground md:hidden'>Choose one day to see events on that date. Past dates are disabled.</p>
    </div>
  );
}

export function Filters({ value, onChange }: { value: FiltersState; onChange: (next: FiltersState) => void }) {
  return (
    <section className='space-y-4'>
      <div className='space-y-2'>
        <Tabs value={value.timeframe} onValueChange={(next) => onChange({ ...value, timeframe: next as Timeframe, selectedDate: undefined })}>
          <TabsList>
            <TabsTrigger value='tonight'>Tonight</TabsTrigger>
            <TabsTrigger value='tomorrow'>Tomorrow</TabsTrigger>
            <TabsTrigger value='weekend'>This Weekend</TabsTrigger>
            <TabsTrigger value='all'>All</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className='text-xs text-muted-foreground'>Pick a timeframe, then optionally refine by category, price, or a specific date.</p>
      </div>

      <div className='grid gap-3'>
        <Command className='border border-border'>
          <CommandInput placeholder='Search events by title, artist, or venue' value={value.q ?? ''} onValueChange={(q) => onChange({ ...value, q })} />
        </Command>

        <div className='space-y-2'>
          <p className='text-xs uppercase tracking-wide text-muted-foreground'>Tap a category to filter events</p>
          <div className='flex flex-wrap gap-2'>
            {EVENT_CATEGORIES.map((category) => {
              const active = value.category === category;
              return (
                <Button
                  key={category}
                  variant={active ? 'default' : 'secondary'}
                  size='sm'
                  onClick={() => onChange({ ...value, category: active ? undefined : category })}
                  className={cn('rounded-full')}
                  aria-pressed={active}
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>

        <div className='hidden items-end gap-3 md:flex md:flex-nowrap'>
          <PriceFilters value={value} onChange={onChange} />
          <DateFilter value={value} onChange={onChange} />
        </div>

        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='secondary' className='w-full'>
                <SlidersHorizontal className='mr-2 h-4 w-4' />
                More filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <h3 className='text-lg font-semibold'>More filters</h3>
              </SheetHeader>
              <div className='mt-4 space-y-4'>
                <PriceFilters value={value} onChange={onChange} />
                <DateFilter value={value} onChange={onChange} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}
