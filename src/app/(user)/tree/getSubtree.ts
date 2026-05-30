import { createClient } from '~/lib/utils/supabase/server';
import resolveCladeId from '~/lib/utils/supabase/queries/resolveCladeId';
import type { Node } from '~/types/tree';

type CladeTreeNode = {
  id: number;
  name: string;
  parent_id: number | null;
  extant: boolean | null;
  hasChildren: boolean;
  children: CladeTreeNode[];
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
    nodeId = await resolveCladeId(supabase, idParam);
  }

  if (nodeId == null) return null;

  const { data, error } = await supabase.rpc('get_taxa_tree', {
    node_id: nodeId,
    depth: 6,
  });

  if (error) {
    console.error('error', error);
    return null;
  }

  const item = data as CladeTreeNode | null;

  const resolveNode = (node: CladeTreeNode): Node => ({
    ...node,
    id: node.id.toString(),
    children: node.children?.map(resolveNode) ?? [],
    attributes: {
      id: node.id.toString(),
      extant: node.extant ?? false,
      lineage: node.parent_id != null ? [node.parent_id.toString()] : [],
      hasChildren: node.hasChildren,
    },
  });

  return item ? resolveNode(item) : null;
};

export default getSubtree;
