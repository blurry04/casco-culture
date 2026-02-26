import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseEnv } from '@/lib/supabase/env';

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = cookies();
  type CookieOptions = Parameters<typeof cookieStore.set>[2];

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set(name, '', options);
      }
    }
  });
}
