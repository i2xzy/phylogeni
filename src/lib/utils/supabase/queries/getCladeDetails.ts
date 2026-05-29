import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';
import resolveCladeId from './resolveCladeId';

type CladeRow = Database['public']['Tables']['taxa']['Row'];

export type LineageNode = Pick<CladeRow, 'name' | 'rank' | 'parent_id'> & {
  id: string;
};

export type ChildNode = Pick<CladeRow, 'name' | 'rank' | 'extant'> & {
  id: string;
};

export type CladeDetails = CladeRow & {
  description: string | null;
  parent: string | null;
  lineage: LineageNode[];
  children: ChildNode[];
};

const MAX_LINEAGE_DEPTH = 64;

const fetchLineage = async (
  supabase: SupabaseClient<Database>,
  startParentId: number | null
): Promise<LineageNode[]> => {
  const lineage: LineageNode[] = [];
  let currentId = startParentId;
  let hops = 0;

  while (currentId != null && hops < MAX_LINEAGE_DEPTH) {
    const { data, error } = await supabase
      .from('taxa')
      .select('id, name, parent_id, rank')
      .eq('id', currentId)
      .maybeSingle();
    if (error || !data) break;
    lineage.push({
      id: String(data.id),
      name: data.name,
      parent_id: data.parent_id,
      rank: data.rank,
    });
    currentId = data.parent_id;
    hops += 1;
  }

  return lineage;
};

const getCladeDetails = async (
  supabase: SupabaseClient<Database>,
  idParam: string
): Promise<CladeDetails | null> => {
  const cladeId = await resolveCladeId(supabase, idParam);
  if (cladeId == null) return null;

  const { data: clade, error } = await supabase
    .from('taxa')
    .select('*')
    .eq('id', cladeId)
    .maybeSingle();

  if (error || !clade) {
    if (error) console.error('getCladeDetails', error);
    return null;
  }

  const [{ data: children }, lineage] = await Promise.all([
    supabase
      .from('taxa')
      .select('id, name, rank, extant')
      .eq('parent_id', cladeId)
      .order('name'),
    fetchLineage(supabase, clade.parent_id),
  ]);

  return {
    ...clade,
    description: null,
    parent: clade.parent_id != null ? String(clade.parent_id) : null,
    lineage,
    children: (children ?? []).map((c) => ({
      id: String(c.id),
      name: c.name,
      rank: c.rank,
      extant: c.extant,
    })),
  };
};

export default getCladeDetails;
