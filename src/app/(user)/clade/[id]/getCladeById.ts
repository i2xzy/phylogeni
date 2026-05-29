import { createClient } from '~/lib/utils/supabase/server';
import getTaxaDetails from '~/lib/utils/supabase/queries/getTaxaDetails';
import findImagesByName from '~/lib/utils/wiki/findImagesByName';

const getCladeById = async (id: string) => {
  const supabase = await createClient();
  const details = await getTaxaDetails(supabase, id);
  if (!details) return null;

  const images = await findImagesByName(details.name);

  return {
    ...details,
    image: images[0]?.url,
  };
};

export default getCladeById;
