import { createClient } from '~/lib/utils/supabase/server';
import resolveTaxaId from '~/lib/utils/supabase/queries/resolveTaxaId';
import type { Node } from '~/types/tree';

type TaxaTreeNode = {
  id: number;
  name: string;
  parent_id: number | null;
  extant: boolean | null;
  hasChildren: boolean;
  children: TaxaTreeNode[];
};

// id of the `Life` root in the canonical `taxa` table. Hardcoded to avoid an
// extra lookup on every tree page load. If the data is ever reseeded and this
// number changes, update it (or run `select id from taxa where name = 'Life'
// and parent_id is null`).
const LIFE_ROOT_ID = 27484;

const getSubtree = async (idParam?: string): Promise<Node | null> => {
  const supabase = await createClient();

  let nodeId: number | null = LIFE_ROOT_ID;

  if (idParam) {
    nodeId = await resolveTaxaId(supabase, idParam);
  }

  if (nodeId == null) return null;

  const [{ data, error }, { data: rootMeta }] = await Promise.all([
    supabase.rpc('get_taxa_tree', { node_id: nodeId, depth: 6 }),
    supabase.from('taxa').select('parent_id').eq('id', nodeId).maybeSingle(),
  ]);

  if (error) {
    console.error('error', error);
    return null;
  }

  const rootParentId = rootMeta?.parent_id ?? null;
  const item = data as TaxaTreeNode | null;

  const resolveNode = (node: TaxaTreeNode, isRoot = false): Node => {
    const parentId = isRoot ? rootParentId : node.parent_id;
    return {
      ...node,
      id: node.id.toString(),
      children: node.children?.map((c) => resolveNode(c, false)) ?? [],
      attributes: {
        id: node.id.toString(),
        extant: node.extant ?? false,
        lineage: parentId != null ? [parentId.toString()] : [],
        hasChildren: node.hasChildren,
      },
    };
  };

  return item ? resolveNode(item, true) : null;
};

export default getSubtree;
