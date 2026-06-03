import { createClient } from '~/lib/utils/supabase/server';

// A stored avatar is either an uploaded file (storage path) or an external
// provider URL (e.g. Google). Only the latter should be auto-synced.
const isUrl = (value: string) => /^https?:\/\//i.test(value);

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const errorUrl = new URL('/auth/error', req.url);
      errorUrl.searchParams.set('error', error.message);
      return Response.redirect(errorUrl);
    }

    // Keep the profile photo in sync with the provider (e.g. Google) avatar on
    // each sign-in, unless the user has uploaded their own image.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const providerAvatar: string | undefined =
      user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;

    if (user && providerAvatar) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      const current = profile?.avatar_url ?? '';

      // Only refresh when the user is already using their provider (Google)
      // photo. Leave custom uploads (storage paths) and an empty avatar (which
      // means the user opted out of showing one) untouched.
      if (isUrl(current) && current !== providerAvatar) {
        await supabase
          .from('profiles')
          .update({ avatar_url: providerAvatar })
          .eq('id', user.id);
      }
    }
  }

  return Response.redirect(new URL('/tree', req.url));
}
