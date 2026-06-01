import { createClient } from '~/lib/utils/supabase/server';

const getCladesByName = async (q: string) => {
  const supabase = await createClient();

  const { data: exactMatches, error: exactError } = await supabase
    .from('taxa')
    .select('id, name, extant, rank')
    .ilike('name', q)
    .limit(10);

  if (exactError) {
    console.error('error', exactError);
    return [];
  }

  const { data, error } = await supabase
    .from('taxa')
    .select('id, name, extant, rank')
    .ilike('name', `%${q}%`)
    .limit(10);

  if (error) {
    console.error('error', error);
    return [];
  }

  return [
    ...exactMatches.filter((item) => item.name),
    ...data.filter(
      (item) => item.name && !exactMatches.some((exact) => exact.id === item.id)
    ),
  ];
};

export default getCladesByName;
