'use server';

import type { Provider } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '~/lib/utils/supabase/server';

// Absolute origin of the current request. Vercel sets x-forwarded-proto/host;
// fall back to http only for local dev. Supabase redirect targets must be
// absolute and exactly match an allowlisted URL — hardcoding http:// makes the
// production target miss the allowlist, so Supabase falls back to the Site URL
// and the auth code lands on `/` instead of /auth/callback.
async function getOrigin() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto =
    h.get('x-forwarded-proto') ??
    (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function signInWithOAuth(
  _: { message: string },
  formData: FormData
) {
  const origin = await getOrigin();
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    provider: formData.get('provider') as Provider,
  };

  const { data: response, error } = await supabase.auth.signInWithOAuth({
    provider: data.provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { message: error.message };
  }

  if (response.url) {
    redirect(response.url);
  }

  return { message: 'Success!' };
}

export async function signInWithOtp(
  _: { message: string },
  formData: FormData
) {
  const origin = await getOrigin();
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
  };

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { message: error.message };
  }

  return { message: 'Success! Check your email.' };
}
