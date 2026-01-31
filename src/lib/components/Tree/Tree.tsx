'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import TreeComponent from 'react-d3-tree';
import type { RawNodeDatum } from 'react-d3-tree';

import type { Node as NodeType } from '~/types/tree';

import Node from './Node';

interface TreeProps {
  data: NodeType;
  isVertical?: boolean;
  onClickNode: (id: string) => void;
  selectedNodeId?: string;
}

const BASE_WIDTH = 1200;

const Tree = ({ data, isVertical, onClickNode, selectedNodeId }: TreeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [translate, setTranslate] = useState({ x: 200, y: 300 });
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      // Root closer to left on small screens
      const xOffset = width < 768 ? width / 8 : width / 4;
      setTranslate({ x: xOffset, y: height / 2 });
    };

    // Calculate initial zoom and dimensions on mount
    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width, height });
    const isSmall = width < 768;
    const xOffset = isSmall ? width / 8 : width / 4;
    setTranslate({ x: xOffset, y: height / 2 });
    // Slightly higher zoom on small screens since root is closer to left
    const baseZoom = width / BASE_WIDTH;
    const adjustedZoom = isSmall ? baseZoom * 1.3 : baseZoom;
    setZoom(Math.max(0.3, Math.min(1.5, adjustedZoom)));

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateDimensions);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Responsive layout based on screen width
  const isSmallScreen = dimensions.width < 768;
  const nodeSize = isSmallScreen
    ? { x: 350, y: 28 } // Taller nodes on small screens
    : { x: 350, y: 24 };
  const separation = isSmallScreen
    ? { siblings: 1.5, nonSiblings: 2.5 } // More vertical space on small screens
    : { siblings: 1, nonSiblings: 2 };

  return (
    <Box id="treeWrapper" width="100%" height="100%" ref={containerRef}>
      <TreeComponent
        zoomable
        data={data as RawNodeDatum}
        dimensions={dimensions}
        translate={translate}
        zoom={zoom}
        scaleExtent={{ min: 0.3, max: 2 }}
        nodeSize={nodeSize}
        separation={separation}
        orientation={isVertical ? 'vertical' : 'horizontal'}
        onUpdate={({ zoom: newZoom, translate: newTranslate }) => {
          setZoom(newZoom);
          setTranslate(newTranslate);
        }}
        onNodeClick={({ data: nodeData }) => {
          const id = nodeData.attributes?.id.toString();
          if (id) onClickNode(id);
        }}
        renderCustomNodeElement={(nodeProps) => (
          <Node
            {...nodeProps}
            nodeSize={nodeSize}
            rootId={data.id}
            selectedNodeId={selectedNodeId}
          />
        )}
        initialDepth={2}
      />
    </Box>
  );
};

export default Tree;
