'use server';

import { revalidatePath } from 'next/cache';

import {
  isValidRank,
  nomenclatureForLineage,
  rankAllowedUnder,
  requiresBinomial,
  isBinomialName,
} from '~/lib/constants/ranks';
import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';

import { requireEditor } from '../require-editor';

export type CreateCladeInput = {
  name: string;
  parentId: number;
  rank: string | null;
  extant: boolean | null;
  common_names: string[];
};

export async function createClade(
  input: CreateCladeInput
): Promise<{ id: number } | { error: string }> {
  const auth = await requireEditor();
  if (!auth.ok) return { error: auth.error };
  const { user, supabase } = auth;

  const name = input.name.trim();
  if (!name) return { error: 'Name is required.' };

  const parent = await getCladeDetails(String(input.parentId));
  if (!parent) return { error: 'Parent clade not found.' };

  const rank = input.rank || null;
  if (rank !== null && !isValidRank(rank)) {
    return { error: 'Invalid rank.' };
  }

  // The new clade sits under the parent, so its rank must be finer than the
  // parent's and every ancestor's.
  const nomenclature = nomenclatureForLineage([
    parent.name,
    ...parent.lineage.map((a) => a.name),
  ]);
  const ancestorRanks = [
    parent.rank,
    ...parent.lineage.map((a) => a.rank),
  ].filter((r): r is string => Boolean(r));

  if (!rankAllowedUnder(rank, nomenclature, ancestorRanks)) {
    return {
      error: 'Rank must be finer than the parent clade and its ancestors.',
    };
  }
  if (requiresBinomial(rank, nomenclature) && !isBinomialName(name)) {
    return { error: 'A species needs a binomial name, e.g. "Homo sapiens".' };
  }

  const { data: created, error: insertError } = await supabase
    .from('taxa')
    .insert({
      name,
      parent_id: input.parentId,
      rank,
      extant: input.extant,
      common_names: input.common_names,
    })
    .select('id, name, parent_id, rank, extant, common_names')
    .single();
  if (insertError || !created) {
    return { error: insertError?.message ?? 'Could not create clade.' };
  }

  const { error: revisionError } = await supabase
    .from('clade_revisions')
    .insert({
      clade_id: created.id,
      target_clade_id: input.parentId,
      user_id: user.id,
      mode: 'CREATE',
      changed_fields: [],
      before: null,
      after: {
        id: created.id,
        name: created.name,
        parent_id: created.parent_id,
        rank: created.rank,
        extant: created.extant,
        common_names: created.common_names,
      },
    });
  if (revisionError) {
    // The clade was created; a missing revision shouldn't block the user.
    console.error('Failed to record clade revision', revisionError);
  }

  revalidatePath(`/clade/${input.parentId}`);
  revalidatePath('/tree');
  return { id: created.id };
}
