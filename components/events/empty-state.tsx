import { Compass } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className='flex min-h-64 flex-col items-center justify-center space-y-3 p-6 text-center'>
        <div className='rounded-full bg-secondary p-3'>
          <Compass className='h-5 w-5 text-primary' />
        </div>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <p className='max-w-sm text-sm text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}
