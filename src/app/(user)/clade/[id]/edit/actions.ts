'use server';

import { revalidatePath } from 'next/cache';

import { Clade, CladeSnapshot } from '~/types/database';
import {
  isValidRank,
  nomenclatureForLineage,
  rankAllowedUnder,
  requiresBinomial,
  isBinomialName,
} from '~/lib/constants/ranks';
import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';

import { requireEditor } from '../../require-editor';

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

export type DeleteCladeInput = {
  id: number;
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
  const auth = await requireEditor();
  if (!auth.ok) return { error: auth.error };
  const { user, supabase } = auth;

  const name = input.name.trim();
  if (!name) return { error: 'Name is required.' };

  const before = await getCladeDetails(String(input.id));
  if (!before) return { error: 'Clade not found.' };

  const rank = input.rank || null;
  if (rank !== null && !isValidRank(rank)) {
    return { error: 'Invalid rank.' };
  }

  const nomenclature = nomenclatureForLineage([
    before.name,
    ...before.lineage.map((a) => a.name),
  ]);
  const ancestorRanks = before.lineage
    .map((a) => a.rank)
    .filter((r): r is string => Boolean(r));

  if (!rankAllowedUnder(rank, nomenclature, ancestorRanks)) {
    return { error: 'Rank must be finer than its ancestors.' };
  }
  if (requiresBinomial(rank, nomenclature) && !isBinomialName(name)) {
    return { error: 'A species needs a binomial name, e.g. "Homo sapiens".' };
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
  const auth = await requireEditor();
  if (!auth.ok) return { error: auth.error };
  const { user, supabase } = auth;

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

  const newParent = await getCladeDetails(String(input.newParentId));
  if (!newParent) return { error: 'New parent clade not found.' };

  // Cycle guard: if the clade appears in the new parent's lineage, the move
  // would put it beneath its own descendant. (One RPC, fails closed; DB-level
  // enforcement is the robust long-term fix for the concurrent case.)
  const newParentAncestorIds = newParent.lineage.map((a) => Number(a.id));
  if (newParentAncestorIds.includes(input.id)) {
    return {
      error: 'Cannot move a clade beneath one of its own descendants.',
    };
  }

  // The clade must stay finer-ranked than its new ancestors.
  const nomenclature = nomenclatureForLineage([
    newParent.name,
    ...newParent.lineage.map((a) => a.name),
  ]);
  const newAncestorRanks = [
    newParent.rank,
    ...newParent.lineage.map((a) => a.rank),
  ].filter((r): r is string => Boolean(r));
  if (!rankAllowedUnder(before.rank, nomenclature, newAncestorRanks)) {
    return {
      error:
        "This clade's rank isn't finer than the new parent's. Pick a different parent or change the rank first.",
    };
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

export async function deleteClade(
  input: DeleteCladeInput
): Promise<{ error: string } | void> {
  const auth = await requireEditor();
  if (!auth.ok) return { error: auth.error };
  const { user, supabase } = auth;

  const { data: clade } = await supabase
    .from('taxa')
    .select('*')
    .eq('id', input.id)
    .maybeSingle();
  if (!clade) return { error: 'Clade not found.' };

  // Children are promoted one level up (reparented to this clade's parent), so
  // a root with children can't be deleted — it would orphan them into roots.
  const { data: children } = await supabase
    .from('taxa')
    .select('*')
    .eq('parent_id', input.id);
  const childRows = children ?? [];
  if (clade.parent_id == null && childRows.length > 0) {
    return {
      error:
        'This is a root clade with children. Move or delete its children before deleting it.',
    };
  }

  // Reparent the children first so they survive the delete; only then is the
  // clade childless and safe to remove.
  if (childRows.length > 0) {
    const { error: reparentError } = await supabase
      .from('taxa')
      .update({ parent_id: clade.parent_id })
      .eq('parent_id', input.id);
    if (reparentError) return { error: reparentError.message };
  }

  const { data: deleted, error: deleteError } = await supabase
    .from('taxa')
    .delete()
    .eq('id', input.id)
    .select('id');
  if (deleteError) return { error: deleteError.message };
  // RLS blocks silently (no error, zero rows). The row existed above, so an
  // empty result means the delete policy denied it.
  if (!deleted || deleted.length === 0) {
    return { error: 'You need editor access to delete this clade.' };
  }

  // Record the deletion (clade_id is null — the row is gone — so the feed reads
  // the name from the `before` snapshot) plus a MOVE for each promoted child.
  const revisions = [
    {
      clade_id: null,
      target_clade_id: clade.parent_id,
      user_id: user.id,
      mode: 'DELETE' as const,
      changed_fields: [],
      before: snapshot(clade),
      after: null,
    },
    ...childRows.map((child) => ({
      clade_id: child.id,
      target_clade_id: clade.parent_id,
      user_id: user.id,
      mode: 'MOVE' as const,
      changed_fields: ['parent_id'],
      before: snapshot(child),
      after: snapshot({ ...child, parent_id: clade.parent_id }),
    })),
  ];
  const { error: revisionError } = await supabase
    .from('clade_revisions')
    .insert(revisions);
  if (revisionError) {
    // The delete succeeded; a missing revision shouldn't block the user.
    console.error('Failed to record clade revision', revisionError);
  }

  if (clade.parent_id != null) revalidatePath(`/clade/${clade.parent_id}`);
  childRows.forEach((child) => revalidatePath(`/clade/${child.id}`));
  revalidatePath('/tree');
}
