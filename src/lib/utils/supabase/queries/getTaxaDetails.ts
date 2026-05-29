import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';
import resolveTaxaId from './resolveTaxaId';

type TaxaRow = Database['public']['Tables']['taxa']['Row'];

export type LineageNode = Pick<TaxaRow, 'name' | 'rank' | 'parent_id'> & {
  id: string;
};

export type ChildNode = Pick<TaxaRow, 'name' | 'rank' | 'extant'> & {
  id: string;
};

export type TaxaDetails = TaxaRow & {
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

const getTaxaDetails = async (
  supabase: SupabaseClient<Database>,
  idParam: string
): Promise<TaxaDetails | null> => {
  const taxaId = await resolveTaxaId(supabase, idParam);
  if (taxaId == null) return null;

  const { data: taxon, error } = await supabase
    .from('taxa')
    .select('*')
    .eq('id', taxaId)
    .maybeSingle();

  if (error || !taxon) {
    if (error) console.error('getTaxaDetails', error);
    return null;
  }

  const [{ data: children }, lineage] = await Promise.all([
    supabase
      .from('taxa')
      .select('id, name, rank, extant')
      .eq('parent_id', taxaId)
      .order('name'),
    fetchLineage(supabase, taxon.parent_id),
  ]);

  return {
    ...taxon,
    description: null,
    parent: taxon.parent_id != null ? String(taxon.parent_id) : null,
    lineage,
    children: (children ?? []).map((c) => ({
      id: String(c.id),
      name: c.name,
      rank: c.rank,
      extant: c.extant,
    })),
  };
};

export default getTaxaDetails;
