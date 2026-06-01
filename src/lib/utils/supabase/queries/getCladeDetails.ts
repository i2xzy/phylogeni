import { CladeDetails, ChildNode, LineageNode } from '~/types/database';
import { createClient } from '~/lib/utils/supabase/server';
import resolveCladeId from './resolveCladeId';

type LineageAndChildren = {
  lineage: Array<{
    id: number;
    name: string;
    rank: string | null;
    parent_id: number | null;
  }>;
  children: Array<{
    id: number;
    name: string;
    rank: string | null;
    extant: boolean | null;
  }>;
};

const getCladeDetails = async (
  idParam: string
): Promise<CladeDetails | null> => {
  const supabase = await createClient();
  const cladeId = await resolveCladeId(supabase, idParam);
  if (cladeId == null) return null;

  // The node's own fields come from a plain select (auto-adapts as the schema
  // grows); the recursive lineage + children come from the RPC.
  const [{ data: clade, error }, { data: rel, error: relError }] =
    await Promise.all([
      supabase.from('taxa').select('*').eq('id', cladeId).maybeSingle(),
      supabase.rpc('get_clade_details', { clade_id: cladeId }),
    ]);

  if (error || relError) {
    console.error('getCladeDetails', error ?? relError);
  }
  if (!clade) return null;

  const { lineage, children } = (rel as LineageAndChildren | null) ?? {
    lineage: [],
    children: [],
  };

  return {
    ...clade,
    description: null,
    parent: clade.parent_id != null ? String(clade.parent_id) : null,
    lineage: lineage.map(
      (a): LineageNode => ({
        id: String(a.id),
        name: a.name,
        rank: a.rank,
        parent_id: a.parent_id,
      })
    ),
    children: children.map(
      (c): ChildNode => ({
        id: String(c.id),
        name: c.name,
        rank: c.rank,
        extant: c.extant,
      })
    ),
  };
};

export default getCladeDetails;
