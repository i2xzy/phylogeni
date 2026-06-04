import { Container, Heading, Stack } from '@chakra-ui/react';
import { Metadata } from 'next';
import NextLink from 'next/link';

import { createClient } from '~/lib/utils/supabase/server';
import resolveCladeId from '~/lib/utils/supabase/queries/resolveCladeId';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '~/components/ui/breadcrumb';

import CladeEditForm from './clade-edit-form';

export const metadata: Metadata = {
  title: 'Edit Clade info',
};

export default async function CladeEditPage({
  params,
}: PageProps<'/clade/[id]/edit'>) {
  const { id } = await params;

  const supabase = await createClient();
  const cladeId = await resolveCladeId(supabase, id);

  if (cladeId == null) {
    return null;
  }

  const { data: clade, error } = await supabase
    .from('taxa')
    .select('*')
    .eq('id', cladeId)
    .maybeSingle();

  if (error) {
    console.error('error', error);
    return null;
  }

  if (!clade) {
    return null;
  }

  let parentName: string | null = null;
  if (clade.parent_id != null) {
    const { data: parent } = await supabase
      .from('taxa')
      .select('name')
      .eq('id', clade.parent_id)
      .maybeSingle();
    parentName = parent?.name ?? null;
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
        <Stack gap={2}>
          <BreadcrumbRoot>
            <BreadcrumbLink asChild>
              <NextLink href={`/clade/${clade.id}`}>{clade.name}</NextLink>
            </BreadcrumbLink>
            <BreadcrumbCurrentLink>Edit</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
          <Heading size="lg">Editing {clade.name}</Heading>
        </Stack>
        <CladeEditForm clade={clade} parentName={parentName} />
      </Stack>
    </Container>
  );
}
