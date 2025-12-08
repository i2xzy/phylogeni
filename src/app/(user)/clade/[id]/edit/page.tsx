import { Container, Heading, Stack } from '@chakra-ui/react';
import { Metadata } from 'next';

import { createClient } from '~/lib/utils/supabase/server';

import CladeEditForm from './clade-edit-form';

export const metadata: Metadata = {
  title: 'Edit Clade info',
};

export default async function CladeEditPage({
  params,
}: PageProps<'/clade/[id]/edit'>) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clades')
    .select('*')
    .eq('id', id);

  if (error) {
    console.error('error', error);
    return null;
  }

  const clade = data?.[0];

  if (!clade) {
    return null;
  }

  return (
    <Container display="flex" gap="10" maxW="8xl">
      <Stack
        width="full"
        flex="1"
        minHeight="var(--content-height)"
        overflow="auto"
        p={8}
        gap={6}
      >
        <Heading size="lg">Editing {clade.name}</Heading>
        <CladeEditForm clade={clade} />
      </Stack>
    </Container>
  );
}
