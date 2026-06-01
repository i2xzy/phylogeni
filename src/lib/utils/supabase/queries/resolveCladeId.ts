import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';

const MONGO_OBJECT_ID = /^[0-9a-f]{24}$/i;

/**
 * Resolve a URL id parameter to the numeric clade id.
 *
 * - Numeric input (e.g. "123") is parsed and returned directly.
 * - 24-char hex input (legacy Mongo ObjectId from the original PE app) is
 *   looked up via `legacy_mongo_id` so old bookmarks / external links keep
 *   working.
 *
 * Returns `null` if the id doesn't match either format or no row exists.
 */
const resolveCladeId = async (
  supabase: SupabaseClient<Database>,
  idParam: string
): Promise<number | null> => {
  if (!idParam) return null;

  if (/^\d+$/.test(idParam)) {
    return Number(idParam);
  }

  if (MONGO_OBJECT_ID.test(idParam)) {
    const { data } = await supabase
      .from('taxa')
      .select('id')
      .eq('legacy_mongo_id', idParam)
      .maybeSingle();
    return data?.id ?? null;
  }

  return null;
};

export default resolveCladeId;
