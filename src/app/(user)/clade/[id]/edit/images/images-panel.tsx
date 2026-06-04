'use client';

import {
  AspectRatio,
  Badge,
  Center,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuImage } from 'react-icons/lu';
import useSWR from 'swr';

import { fetcher } from '~/lib/utils/swr/fetchers';

import ComingSoonCard from '../coming-soon-card';

export default function ImagesPanel({ id }: { id: string }) {
  // Wikidata image candidates (same source as the clade page). The first is the
  // one currently used as the cover.
  const { data } = useSWR<{ name?: string; images?: string[] }>(
    `/api/clade/${id}`,
    fetcher
  );
  const cladeName = data?.name ?? 'this clade';
  const imageCandidates = data?.images ?? [];

  return (
    <ComingSoonCard
      title="Images"
      helper="Choose which Wikidata image to use as this clade's cover."
    >
      <Stack gap={4}>
        <Text color="fg.muted" fontSize="sm">
          We currently use the first Wikidata result for {cladeName}. Soon you
          will be able to pick a more relevant one from the other matches.
        </Text>
        <SimpleGrid columns={{ base: 3, sm: 5 }} gap={3}>
          {(imageCandidates.length
            ? imageCandidates.slice(0, 5)
            : Array.from({ length: 5 }, () => null)
          ).map((url, i) => (
            <AspectRatio key={i} ratio={1}>
              <Center
                position="relative"
                overflow="hidden"
                borderWidth="1px"
                borderColor={i === 0 ? 'teal.solid' : 'border'}
                rounded="md"
                bg="bg.muted"
                color="fg.subtle"
              >
                {url ? (
                  <Image
                    src={url}
                    alt={cladeName}
                    objectFit="cover"
                    w="full"
                    h="full"
                  />
                ) : (
                  <LuImage />
                )}
                {i === 0 && (
                  <Badge
                    position="absolute"
                    top="1"
                    left="1"
                    size="sm"
                    colorPalette="teal"
                  >
                    Current
                  </Badge>
                )}
              </Center>
            </AspectRatio>
          ))}
        </SimpleGrid>
      </Stack>
    </ComingSoonCard>
  );
}
