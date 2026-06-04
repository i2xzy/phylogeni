import { Container, Heading, Stack } from '@chakra-ui/react';
import { Metadata } from 'next';
import NextLink from 'next/link';

import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '~/components/ui/breadcrumb';

import type { SelectedClade } from '../../clade-search-select';
import CladeEditForm from './clade-edit-form';

export const metadata: Metadata = {
  title: 'Edit Clade info',
};

export default async function CladeEditPage({
  params,
}: PageProps<'/clade/[id]/edit'>) {
  const { id } = await params;

  const clade = await getCladeDetails(id);
  if (!clade) {
    return null;
  }

  // Ancestors (for the current parent name + "move up" suggestions) and direct
  // children (which can't be the new parent) come from the same RPC.
  const lineage: SelectedClade[] = clade.lineage.map((a) => ({
    id: Number(a.id),
    name: a.name,
  }));

  const parentName =
    clade.parent_id != null
      ? lineage.find((a) => a.id === clade.parent_id)?.name ?? null
      : null;

  // Suggest ancestors above the current parent (moving up the tree); the
  // current parent itself would be a no-op.
  const suggestions = lineage.filter(
    (a) => a.id !== clade.id && a.id !== clade.parent_id
  );

  // Can't reparent under self, the current parent (no-op), or a direct child.
  const excludeIds = [
    clade.id,
    ...(clade.parent_id != null ? [clade.parent_id] : []),
    ...clade.children.map((c) => Number(c.id)),
  ];

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
        <CladeEditForm
          clade={clade}
          parentName={parentName}
          excludeIds={excludeIds}
          suggestions={suggestions}
        />
      </Stack>
    </Container>
  );
}
