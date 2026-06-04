import { Container, Heading, Stack } from '@chakra-ui/react';
import { Metadata } from 'next';

import { createClient } from '~/lib/utils/supabase/server';

import CreateCladeForm from './create-clade-form';

export const metadata: Metadata = {
  title: 'Add a clade',
};

export default async function AddCladePage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string | string[] }>;
}) {
  const { parent } = await searchParams;
  const parentId = typeof parent === 'string' ? Number(parent) : NaN;

  let initialParent: { id: number; name: string } | null = null;
  if (!Number.isNaN(parentId)) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('taxa')
      .select('id, name')
      .eq('id', parentId)
      .maybeSingle();
    if (data) initialParent = { id: data.id, name: data.name };
  }

  return (
    <Container display="flex" maxW="8xl">
      <Stack
        width="full"
        flex="1"
        minHeight="var(--content-height)"
        overflow="auto"
        p={8}
        gap={6}
      >
        <Heading size="lg">Add a clade</Heading>
        <CreateCladeForm initialParent={initialParent} />
      </Stack>
    </Container>
  );
}
