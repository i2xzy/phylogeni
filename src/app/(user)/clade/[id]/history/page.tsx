import { CladeHistoryTable } from '~/lib/components/CladeHistoryTable/CladeHistoryTable';
import { Box } from '@chakra-ui/react';
import getCladeById from '../getCladeById';
import getRevisions from './getRevisions';

export default async function CladeEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ include_children: boolean }>;
}) {
  const { id } = await params;

  const { include_children } = (await searchParams) || false;

  if (include_children) {
    //TODO: Get history from all child nodes
  }

  const txsWithUsers = await getRevisions(id);

  const cladeName = await getCladeById(id);

  return (
    <Box mdDown={{ paddingX: '0.8rem' }} paddingX="6rem" marginTop={6}>
      <Box>
        {txsWithUsers && (
          <CladeHistoryTable
            rows={txsWithUsers}
            cladeName={cladeName?.name}
            cladeId={id}
          />
        )}
      </Box>
    </Box>
  );
}
