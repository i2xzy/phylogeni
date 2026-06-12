import { Container, Heading, Stack } from '@chakra-ui/react';
import { Metadata } from 'next';

import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';
import {
  nomenclatureForLineage,
  type NomenclatureCode,
} from '~/lib/constants/ranks';

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
  const parentId = typeof parent === 'string' ? parent : null;

  let initialParent: { id: number; name: string } | null = null;
  // The new clade inherits its parent's nomenclatural code and sits below the
  // parent, so derive both from the (prefilled) parent's lineage.
  let nomenclature: NomenclatureCode | null = null;
  let ancestorRanks: string[] = [];
  if (parentId) {
    const parentClade = await getCladeDetails(parentId);
    if (parentClade) {
      initialParent = { id: parentClade.id, name: parentClade.name };
      nomenclature = nomenclatureForLineage([
        parentClade.name,
        ...parentClade.lineage.map((a) => a.name),
      ]);
      ancestorRanks = [
        parentClade.rank,
        ...parentClade.lineage.map((a) => a.rank),
      ].filter((r): r is string => Boolean(r));
    }
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
        <CreateCladeForm
          initialParent={initialParent}
          nomenclature={nomenclature}
          ancestorRanks={ancestorRanks}
        />
      </Stack>
    </Container>
  );
}
