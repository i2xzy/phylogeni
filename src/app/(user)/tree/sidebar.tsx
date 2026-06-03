'use client';

import useSWR from 'swr';
import { Box, Flex, Icon, Image, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import { RiAddLargeFill, RiEdit2Fill, RiProfileLine } from 'react-icons/ri';
import { LuImage } from 'react-icons/lu';
import { TbBinaryTree } from 'react-icons/tb';

import { fetcher } from '~/lib/utils/swr/fetchers';
import { formatDate } from '~/lib/utils/date';
import { EmptyState } from '~/components/ui/empty-state';
import { CloseButton } from '~/components/ui/close-button';
import SidebarButton from '~/lib/components/CladeSidebar/SidebarButton';
import SidebarSkeleton from './sidebar-skeleton';

import type { Clade } from '~/types/database';

type CladeWithImage = Clade & {
  image?: string;
  last_edited?: string | null;
};

interface Props {
  nodeId: string | null;
  onClose: () => void;
}

export default function Sidebar({ nodeId, onClose }: Props) {
  const { data, isLoading } = useSWR<CladeWithImage>(
    nodeId ? `/api/clade/${nodeId}` : null,
    fetcher
  );

  if (!nodeId) {
    return null;
  }

  if (isLoading || !data) {
    return (
      <>
        <CloseButton pos="absolute" top="2" right="2" onClick={onClose} />
        <SidebarSkeleton />
      </>
    );
  }

  return (
    <>
      <CloseButton pos="absolute" top="2" right="2" onClick={onClose} />
      <Box w="100%" paddingInline="6" pt="6" pb="4">
        <Text as="h2" fontSize="lg" fontWeight="bold">
          {data?.name || 'Clade details'}
        </Text>
      </Box>

      {data.image ? (
        <Image asChild alt={data.name} width="320px" height="320px" fit="cover">
          <NextImage
            src={data.image}
            alt={data.name}
            width={320}
            height={320}
          />
        </Image>
      ) : (
        <EmptyState
          title="No image"
          description="No image available"
          icon={<LuImage />}
          h="320px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        />
      )}

      <Box paddingInline="6" pt="4" pb="2" flex={1} overflow="auto">
        <Stack gap={4}>
          <Flex justify="space-between">
            <SidebarButton text="Tree" href={`/tree?node_id=${data.id}`}>
              <Icon transform="rotate(-90deg)" h={5} w={5}>
                <TbBinaryTree />
              </Icon>
            </SidebarButton>
            <SidebarButton text="View" href={`/clade/${data.id}`}>
              <RiProfileLine />
            </SidebarButton>
            <SidebarButton text="Edit" href={`/clade/${data.id}/edit`}>
              <RiEdit2Fill />
            </SidebarButton>
            <SidebarButton text="Add" href={'/clade/add'}>
              <RiAddLargeFill />
            </SidebarButton>
          </Flex>

          {data.common_names && data.common_names.length > 0 && (
            <>
              <Text as="h3" fontSize="sm" fontWeight="bold">
                Common names
              </Text>
              <Text>{data.common_names.join(', ')}</Text>
            </>
          )}

          {data.rank && (
            <>
              <Text as="h3" fontSize="sm" fontWeight="bold">
                Rank
              </Text>
              <Text>{data.rank}</Text>
            </>
          )}
        </Stack>
      </Box>
      {data.last_edited && (
        <Flex paddingInline="6" pt="4" pb="6" justify="end">
          <Text fontSize="sm" color="subtle">
            Last edited {formatDate(data.last_edited)}
          </Text>
        </Flex>
      )}
    </>
  );
}
