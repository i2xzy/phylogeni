import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '~/lib/utils/supabase/server';
import resolveCladeId from '~/lib/utils/supabase/queries/resolveCladeId';
import findImagesByName from '~/lib/utils/wiki/findImagesByName';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const cladeId = await resolveCladeId(supabase, id);

  if (cladeId == null) {
    return NextResponse.json({ error: 'Clade not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('taxa')
    .select('*')
    .eq('id', cladeId)
    .maybeSingle();

  if (error) {
    console.error('error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Clade not found' }, { status: 404 });
  }

  const [images, { data: lastRevision }] = await Promise.all([
    findImagesByName(data.name),
    supabase
      .from('clade_revisions')
      .select('created_at')
      .eq('clade_id', cladeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    ...data,
    image: images[0]?.url,
    last_edited: lastRevision?.created_at ?? null,
  });
}
