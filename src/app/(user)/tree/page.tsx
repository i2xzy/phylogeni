import { Box } from '@chakra-ui/react';
import { Metadata } from 'next';

import getTree from './getSubtree';
import Dendrogram from './dendrogram';

export const metadata: Metadata = {
  title: 'Tree view',
};

type SearchParams = { node_id: string; selected_node_id: string };

export default async function TreePage({ searchParams }: PageProps<'/tree'>) {
  const { node_id, selected_node_id } = (await searchParams) as SearchParams;
  const data = await getTree(node_id);

  if (!data) {
    return null;
  }

  return (
    <Box
      as="main"
      width="100%"
      height="calc(100vh - 72px)"
      background={{ base: 'gray.50', _dark: 'gray.900' }}
    >
      <Dendrogram
        key={data.id}
        data={data}
        initialSelectedNodeId={selected_node_id}
      />
    </Box>
  );
}
