import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '~/lib/utils/supabase/server';
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

  const { data, error } = await supabase
    .from('clades')
    .select('*')
    .eq('id', id);

  if (error) {
    console.error('error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Clade not found' }, { status: 404 });
  }

  const item = data[0];
  const images = await findImagesByName(item.name);

  return NextResponse.json({
    ...item,
    image: images[0]?.url,
  });
}
