import { createClient } from '~/lib/utils/supabase/server';
import getTaxaDetails from '~/lib/utils/supabase/queries/getTaxaDetails';

const getCladeById = async (id: string) => {
  const supabase = await createClient();
  return getTaxaDetails(supabase, id);
};

export default getCladeById;
