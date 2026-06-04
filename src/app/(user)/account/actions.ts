'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '~/lib/utils/supabase/server';
import { hasDisallowedNameChars } from '~/lib/utils/name';

export type SaveProfileInput = {
  fullName: string;
  // Already-renderable URL: a provider photo, our storage public URL, or ''.
  avatarUrl: string;
};

export async function saveProfile(
  input: SaveProfileInput
): Promise<{ error: string } | void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in.' };

  const fullName = input.fullName.trim();
  if (!fullName) return { error: 'Full name is required.' };
  if (hasDisallowedNameChars(fullName))
    return { error: 'Please use letters only.' };

  const avatarUrl = input.avatarUrl.trim();
  if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
    return { error: 'Invalid avatar URL.' };
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: fullName,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };

  revalidatePath('/account');
}
