import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';
import findImagesByName from '~/lib/utils/wiki/findImagesByName';

const getCladeById = async (id: string) => {
  const details = await getCladeDetails(id);
  if (!details) return null;

  const images = await findImagesByName(details.name);

  return {
    ...details,
    image: images[0]?.url,
  };
};

export default getCladeById;
