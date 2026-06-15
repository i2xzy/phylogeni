import { Container, Stack } from '@chakra-ui/react';

import { CladeHistoryTable } from '~/lib/components/CladeHistoryTable/CladeHistoryTable';

import getCladeById from '../getCladeById';
import getRevisions from './getRevisions';

export default async function CladeRevisionsPage({
  params,
}: PageProps<'/clade/[id]/revisions'>) {
  const { id } = await params;

  const revisions = await getRevisions(id);
  const clade = await getCladeById(id);

  return (
    <Container display="flex" maxW="8xl">
      <Stack maxW="5xl" width="full" flex="1" p={8} gap={8}>
        <CladeHistoryTable rows={revisions} clade={clade} />
      </Stack>
    </Container>
  );
}
