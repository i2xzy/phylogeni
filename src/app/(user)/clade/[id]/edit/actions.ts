'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '~/lib/utils/supabase/server';
import { Clade, CladeSnapshot } from '~/types/database';
import { NO_RANK, isValidRank } from '~/lib/constants/ranks';

const EDIT_ROLES = ['editor', 'curator', 'admin'];

export type UpdateCladeInput = {
  id: number;
  name: string;
  rank: string | null;
  extant: boolean | null;
  common_names: string[];
};

export type MoveCladeInput = {
  id: number;
  newParentId: number;
};

const snapshot = (row: Clade): CladeSnapshot => ({
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

  const rank = input.rank && input.rank !== NO_RANK ? input.rank : null;
  if (rank !== null && !isValidRank(rank)) {
    return { error: 'Invalid rank.' };
  }

  const next = {
    name,
    rank,
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

export async function moveClade(
  input: MoveCladeInput
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

  if (input.newParentId === input.id) {
    return { error: 'A clade cannot be its own parent.' };
  }

  const { data: before } = await supabase
    .from('taxa')
    .select('*')
    .eq('id', input.id)
    .maybeSingle();
  if (!before) return { error: 'Clade not found.' };

  if (before.parent_id === input.newParentId) {
    // Already a child of this parent — nothing to do.
    return;
  }

  const { data: newParent } = await supabase
    .from('taxa')
    .select('id, parent_id')
    .eq('id', input.newParentId)
    .maybeSingle();
  if (!newParent) return { error: 'New parent clade not found.' };

  // Cycle guard: walk up from the new parent. If we reach the clade being
  // moved, the move would put a clade beneath its own descendant.
  let ancestorId = newParent.parent_id;
  let steps = 0;
  while (ancestorId != null && steps < 10000) {
    if (ancestorId === input.id) {
      return {
        error: 'Cannot move a clade beneath one of its own descendants.',
      };
    }
    const { data: ancestor } = await supabase
      .from('taxa')
      .select('parent_id')
      .eq('id', ancestorId)
      .maybeSingle();
    ancestorId = ancestor?.parent_id ?? null;
    steps += 1;
  }

  const { error: updateError } = await supabase
    .from('taxa')
    .update({ parent_id: input.newParentId })
    .eq('id', input.id);
  if (updateError) return { error: updateError.message };

  const { error: revisionError } = await supabase
    .from('clade_revisions')
    .insert({
      clade_id: input.id,
      target_clade_id: input.newParentId,
      user_id: user.id,
      mode: 'MOVE',
      changed_fields: ['parent_id'],
      before: snapshot(before),
      after: snapshot({ ...before, parent_id: input.newParentId }),
    });
  if (revisionError) {
    // The move succeeded; a missing revision shouldn't block the user.
    console.error('Failed to record clade revision', revisionError);
  }

  revalidatePath(`/clade/${input.id}`);
  revalidatePath(`/clade/${input.id}/revisions`);
  if (before.parent_id != null) revalidatePath(`/clade/${before.parent_id}`);
  revalidatePath(`/clade/${input.newParentId}`);
  revalidatePath('/tree');
}
