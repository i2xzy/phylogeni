import type { User } from '@supabase/supabase-js';

import { createClient } from '~/lib/utils/supabase/server';

const EDIT_ROLES = ['editor', 'curator', 'admin'];

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type EditorAuth =
  | { ok: true; user: User; supabase: SupabaseServerClient }
  | { ok: false; error: string };

// Gate for clade-editing server actions. Returns the signed-in user and a
// Supabase client to reuse, or an error. NOTE: this runs under the anon key, so
// it is only a real boundary if RLS on taxa/clade_revisions also restricts
// writes to these roles (and profiles.role isn't self-updatable).
export async function requireEditor(): Promise<EditorAuth> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You must be signed in to edit.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile || !EDIT_ROLES.includes(profile.role ?? '')) {
    return { ok: false, error: 'You need editor access to make changes.' };
  }

  return { ok: true, user, supabase };
}
