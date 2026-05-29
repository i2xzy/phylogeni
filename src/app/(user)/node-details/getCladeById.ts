import { createClient } from '~/lib/utils/supabase/server';
import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';

const getCladeById = async (id: string) => {
  const supabase = await createClient();
  return getCladeDetails(supabase, id);
};

export default getCladeById;
