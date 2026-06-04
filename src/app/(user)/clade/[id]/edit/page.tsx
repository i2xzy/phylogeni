import { Container, Heading, Stack } from '@chakra-ui/react';
import { Metadata } from 'next';
import NextLink from 'next/link';

import { createClient } from '~/lib/utils/supabase/server';
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
  // children (which can't be the new parent) come from the same RPC. Index
  // ancestors by id so we can walk the parent chain regardless of RPC order.
  const ancestorById = new Map(clade.lineage.map((a) => [Number(a.id), a]));

  const parentName =
    clade.parent_id != null
      ? ancestorById.get(clade.parent_id)?.name ?? null
      : null;

  // Suggest sensible new parents up front: recently-added siblings first (a
  // common flow is creating a new sibling, then moving this clade into it),
  // then the nearest ancestors *above* the current parent (moving up the tree),
  // capped at 5 so deep lineages don't flood the list.
  const ancestors: SelectedClade[] = [];
  let cursorId =
    clade.parent_id != null
      ? ancestorById.get(clade.parent_id)?.parent_id ?? null
      : null;
  let guard = 0;
  while (cursorId != null && ancestors.length < 5 && guard < 100) {
    const node = ancestorById.get(cursorId);
    if (!node) break;
    ancestors.push({ id: Number(node.id), name: node.name });
    cursorId = node.parent_id;
    guard += 1;
  }

  let siblings: SelectedClade[] = [];
  if (clade.parent_id != null) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('taxa')
      .select('id, name')
      .eq('parent_id', clade.parent_id)
      .neq('id', clade.id)
      .order('created_at', { ascending: false })
      .limit(8);
    siblings = (data ?? []).map((s) => ({ id: s.id, name: s.name }));
  }

  const suggestions = [...siblings, ...ancestors];

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
          childClades={clade.children}
        />
      </Stack>
    </Container>
  );
}
