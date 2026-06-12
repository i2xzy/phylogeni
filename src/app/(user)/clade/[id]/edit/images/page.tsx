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

import findImagesByName from '~/lib/utils/wiki/findImagesByName';

import { getCladeName } from '../../../get-clade-name';
import ComingSoonCard from '../coming-soon-card';

export default async function CladeImagesTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const clade = await getCladeName(id);
  if (!clade) {
    return null;
  }

  const candidates = await findImagesByName(clade.name);
  const images = candidates.slice(0, 5).map((i) => i.url);

  return (
    <ComingSoonCard
      title="Images"
      helper="Choose which Wikidata image to use as this clade's cover."
    >
      <Stack gap={4}>
        <Text color="fg.muted" fontSize="sm">
          We currently use the first Wikidata result for {clade.name}. Soon you
          will be able to pick a more relevant one from the other matches.
        </Text>
        <SimpleGrid columns={{ base: 3, sm: 5 }} gap={3}>
          {(images.length ? images : Array.from({ length: 5 }, () => null)).map(
            (url, i) => (
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
                      alt={clade.name}
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
            )
          )}
        </SimpleGrid>
      </Stack>
    </ComingSoonCard>
  );
}
