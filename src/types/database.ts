import { Database } from './supabase';

/** A canonical clade row (currently backed by the `taxa` table). */
export type Clade = Database['public']['Tables']['taxa']['Row'];

/** A clade as it appears in a lineage/breadcrumb trail. */
export type LineageNode = Pick<Clade, 'name' | 'rank' | 'parent_id'> & {
  id: string;
};

/** A direct child of a clade. */
export type ChildNode = Pick<Clade, 'name' | 'rank' | 'extant'> & {
  id: string;
};

/** A clade plus its resolved lineage and direct children, for detail views. */
export type CladeDetails = Clade & {
  description: string | null;
  parent: string | null;
  lineage: LineageNode[];
  children: ChildNode[];
};

export type RevisionMode = Database['public']['Enums']['revision_mode'];

export type CladeSnapshot = {
  id: number;
  name: string;
  parent_id: number | null;
  rank: string | null;
  extant: boolean | null;
  common_names: string[] | null;
  description?: string | null;
};

export type ProfileRef = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'username' | 'full_name' | 'avatar_url'
>;

export type Revision = Omit<
  Database['public']['Tables']['clade_revisions']['Row'],
  'before' | 'after'
> & {
  before: CladeSnapshot | null;
  after: CladeSnapshot | null;
};

export interface RevisionWithUser extends Omit<Revision, 'user_id'> {
  user: ProfileRef | null;
}
