import { Database } from './supabase';

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
