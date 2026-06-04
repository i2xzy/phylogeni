import { cache } from 'react';

import { createClient } from '~/lib/utils/supabase/server';
import resolveCladeId from '~/lib/utils/supabase/queries/resolveCladeId';

// Resolve a clade's id + name from a route param. cache()d so the edit layout
// and a tab page in the same render share a single query. Returns null if the
// clade doesn't exist.
export const getCladeName = cache(async (idParam: string) => {
  const supabase = await createClient();
  const cladeId = await resolveCladeId(supabase, idParam);
  if (cladeId == null) return null;

  const { data } = await supabase
    .from('taxa')
    .select('id, name')
    .eq('id', cladeId)
    .maybeSingle();
  return data;
});
