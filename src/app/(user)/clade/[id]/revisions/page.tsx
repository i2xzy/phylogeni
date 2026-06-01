import { Box } from '@chakra-ui/react';

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
    <Box
      mdDown={{ paddingX: '0.8rem' }}
      paddingX="6rem"
      paddingTop={6}
      paddingBottom={16}
    >
      <CladeHistoryTable rows={revisions} clade={clade} />
    </Box>
  );
}
