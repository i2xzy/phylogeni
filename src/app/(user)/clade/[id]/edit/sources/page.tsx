import { createClient } from '~/lib/utils/supabase/server';
import resolveCladeId from '~/lib/utils/supabase/queries/resolveCladeId';

import SourcesPanel from './sources-panel';

export default async function CladeSourcesTab({
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

  return <SourcesPanel cladeName={clade.name} />;
}
