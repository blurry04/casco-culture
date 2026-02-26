import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function EventSkeleton() {
  return (
    <Card>
      <Skeleton className='h-40 w-full rounded-b-none rounded-t-2xl' />
      <CardContent className='space-y-3 p-4'>
        <Skeleton className='h-4 w-2/3' />
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-4 w-1/2' />
        <div className='flex gap-2'>
          <Skeleton className='h-10 flex-1' />
          <Skeleton className='h-10 w-10' />
          <Skeleton className='h-10 w-10' />
        </div>
      </CardContent>
    </Card>
  );
}
