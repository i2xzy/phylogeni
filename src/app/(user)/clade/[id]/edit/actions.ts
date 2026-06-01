'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '~/lib/utils/supabase/server';

const EDIT_ROLES = ['editor', 'curator', 'admin'];

export type UpdateCladeInput = {
  id: number;
  name: string;
  rank: string | null;
  extant: boolean | null;
  common_names: string[];
};

type TaxaRow = {
  id: number;
  name: string;
  parent_id: number | null;
  rank: string | null;
  extant: boolean | null;
  common_names: string[] | null;
};

const snapshot = (row: TaxaRow) => ({
  id: row.id,
  name: row.name,
  parent_id: row.parent_id,
  rank: row.rank,
  extant: row.extant,
  common_names: row.common_names,
});

export async function updateClade(
  input: UpdateCladeInput
): Promise<{ error: string } | void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to edit.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile || !EDIT_ROLES.includes(profile.role ?? '')) {
    return { error: 'You need editor access to make changes.' };
  }

  const name = input.name.trim();
  if (!name) return { error: 'Name is required.' };

  const { data: before } = await supabase
    .from('taxa')
    .select('*')
    .eq('id', input.id)
    .maybeSingle();
  if (!before) return { error: 'Clade not found.' };

  const next = {
    name,
    rank: input.rank && input.rank !== 'No rank' ? input.rank : null,
    extant: input.extant,
    common_names: input.common_names,
  };

  const changed_fields: string[] = [];
  if (before.name !== next.name) changed_fields.push('name');
  if (before.rank !== next.rank) changed_fields.push('rank');
  if (before.extant !== next.extant) changed_fields.push('extant');
  // Treat null and [] as equivalent (both "no common names").
  if (
    JSON.stringify(before.common_names ?? []) !==
    JSON.stringify(next.common_names)
  ) {
    changed_fields.push('common_names');
  }

  if (changed_fields.length === 0) {
    return;
  }

  const { error: updateError } = await supabase
    .from('taxa')
    .update(next)
    .eq('id', input.id);
  if (updateError) return { error: updateError.message };

  const { error: revisionError } = await supabase
    .from('clade_revisions')
    .insert({
      clade_id: input.id,
      user_id: user.id,
      mode: 'UPDATE',
      changed_fields,
      before: snapshot(before),
      after: snapshot({ ...before, ...next }),
    });
  if (revisionError) {
    // The edit itself succeeded; a missing revision shouldn't block the user.
    console.error('Failed to record clade revision', revisionError);
  }

  revalidatePath(`/clade/${input.id}`);
  revalidatePath(`/clade/${input.id}/revisions`);
}
