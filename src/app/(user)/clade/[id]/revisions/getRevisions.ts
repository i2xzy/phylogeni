import { createClient } from '~/lib/utils/supabase/server';
import { CladeSnapshot, RevisionWithUser } from '~/types/database';

const getRevisions = async (cladeId: string): Promise<RevisionWithUser[]> => {
  const id = Number(cladeId);
  if (Number.isNaN(id)) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('clade_revisions')
    .select(
      `
      *,
      profiles (id, username, full_name, avatar_url)
    `
    )
    .or(`clade_id.eq.${id},target_clade_id.eq.${id}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    clade_id: row.clade_id,
    target_clade_id: row.target_clade_id,
    mode: row.mode,
    changed_fields: row.changed_fields,
    summary: row.summary,
    created_at: row.created_at,
    before: (row.before as CladeSnapshot | null) ?? null,
    after: (row.after as CladeSnapshot | null) ?? null,
    user: row.profiles,
  }));
};

export default getRevisions;
