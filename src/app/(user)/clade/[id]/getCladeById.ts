import { createClient } from '~/lib/utils/supabase/server';
import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';
import findImagesByName from '~/lib/utils/wiki/findImagesByName';

const getCladeById = async (id: string) => {
  const supabase = await createClient();
  const details = await getCladeDetails(supabase, id);
  if (!details) return null;

  const images = await findImagesByName(details.name);

  return {
    ...details,
    image: images[0]?.url,
  };
};

export default getCladeById;
