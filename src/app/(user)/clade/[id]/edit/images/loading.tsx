import { AspectRatio, Center, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { LuImage } from 'react-icons/lu';

import ComingSoonCard from '../coming-soon-card';

export default function Loading() {
  return (
    <ComingSoonCard
      title="Images"
      helper="Choose which Wikidata image to use as this clade's cover."
    >
      <Stack gap={4}>
        <Text color="fg.muted" fontSize="sm">
          Loading images from Wikidata…
        </Text>
        <SimpleGrid columns={{ base: 3, sm: 5 }} gap={3}>
          {Array.from({ length: 5 }).map((_, i) => (
            <AspectRatio key={i} ratio={1}>
              <Center
                borderWidth="1px"
                borderColor="border"
                rounded="md"
                bg="bg.muted"
                color="fg.subtle"
              >
                <LuImage />
              </Center>
            </AspectRatio>
          ))}
        </SimpleGrid>
      </Stack>
    </ComingSoonCard>
  );
}
