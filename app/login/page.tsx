'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`
      }
    });
    setLoading(false);
    setStatus(error ? error.message : 'Check your email for a secure magic link.');
  };

  return (
    <div className='container flex min-h-[70vh] items-center justify-center py-10'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Login to PulseTonight</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Input type='email' value={email} onChange={(event) => setEmail(event.target.value)} placeholder='you@example.com' aria-label='Email address' />
          <Button className='w-full' onClick={signIn} disabled={!email || loading}>
            {loading ? 'Sending link...' : 'Send Magic Link'}
          </Button>
          {status ? <p className='text-sm text-muted-foreground'>{status}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
