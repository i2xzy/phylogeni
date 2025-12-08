import { Box, Flex } from '@chakra-ui/react';
import { Suspense } from 'react';
import { Metadata } from 'next';

import getTree from './getSubtree';
import Sidebar from './sidebar';
import SidebarSkeleton from './sidebar-skeleton';
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
      <Flex
        direction="column"
        pos="fixed"
        height="calc(100vh - 72px)"
        zIndex="modal"
        bg="bg.panel"
        boxShadow="lg"
        maxW="xs"
        data-state={selected_node_id ? 'open' : 'closed'}
        _open={{ animation: 'slide-from-left 0.5s', w: '100%' }}
        _closed={{ animation: 'slide-to-left 0.5s', w: '0' }}
      >
        <Suspense key={selected_node_id} fallback={<SidebarSkeleton />}>
          <Sidebar nodeId={selected_node_id} />
        </Suspense>
      </Flex>
      <Dendrogram data={data} />
    </Box>
  );
}
