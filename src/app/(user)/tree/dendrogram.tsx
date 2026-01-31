'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { Flex } from '@chakra-ui/react';

import type { Node } from '~/types/tree';

import Sidebar from './sidebar';

const Tree = dynamic(() => import('~/lib/components/Tree'), { ssr: false });

interface Props {
  data: Node;
  initialSelectedNodeId?: string;
}

const Dendrogram = ({ data, initialSelectedNodeId }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    initialSelectedNodeId || null
  );

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);

    // Update URL without triggering Next.js navigation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('selected_node_id', id);
    window.history.replaceState(
      null,
      '',
      `${pathname}?${newSearchParams.toString()}`
    );
  };

  const handleCloseSidebar = () => {
    setSelectedNodeId(null);

    // Update URL without triggering Next.js navigation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('selected_node_id');
    window.history.replaceState(
      null,
      '',
      `${pathname}?${newSearchParams.toString()}`
    );
  };

  return (
    <>
      <Flex
        direction="column"
        pos="fixed"
        height="calc(100vh - 72px)"
        zIndex="modal"
        bg="bg.panel"
        boxShadow="lg"
        maxW="xs"
        data-state={selectedNodeId ? 'open' : 'closed'}
        _open={{ animation: 'slide-from-left 0.5s', w: '100%' }}
        _closed={{ animation: 'slide-to-left 0.5s', w: '0' }}
      >
        <Sidebar nodeId={selectedNodeId} onClose={handleCloseSidebar} />
      </Flex>
      <Tree
        data={data}
        onClickNode={handleNodeClick}
        selectedNodeId={selectedNodeId || undefined}
      />
    </>
  );
};

export default Dendrogram;
