import { createClient } from '~/lib/utils/supabase/server';
import resolveCladeId from '~/lib/utils/supabase/queries/resolveCladeId';
import findImagesByName from '~/lib/utils/wiki/findImagesByName';

import ImagesPanel from './images-panel';

export default async function CladeImagesTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const cladeId = await resolveCladeId(supabase, id);
  if (cladeId == null) {
    return null;
  }

  const { data: clade } = await supabase
    .from('taxa')
    .select('name')
    .eq('id', cladeId)
    .maybeSingle();
  if (!clade) {
    return null;
  }

  const candidates = await findImagesByName(clade.name);
  const images = candidates.slice(0, 5).map((i) => i.url);

  return <ImagesPanel cladeName={clade.name} images={images} />;
}
