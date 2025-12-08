import { Heading, Stack, StackSeparator, Text } from '@chakra-ui/react';
import { Metadata } from 'next';

import { getSpecies as getGbifData } from '~/lib/utils/gbif';
import { getNodeDetails as getOttData } from '~/lib/utils/ott';

import GbifResultCard from './GbifResultCard';
import NodeDetails from './NodeDetails';
import OttResultCard from './OttResultCard';
import getCladeById from './getCladeById';

export const metadata: Metadata = {
  title: 'Node details',
};

const Page = async ({ searchParams }: PageProps<'/node-details'>) => {
  const { id, ott_id } = await searchParams;
  // console.log(id, ott_id);

  const openTreeResult = await getOttData(ott_id as string);

  // console.log(openTreeResult);

  const gbifId = openTreeResult?.sources?.find((s) => s.name === 'gbif')?.id;

  // console.log(gbifId);

  const gbifResult = await getGbifData(gbifId);

  // console.log(gbifResult);

  // const queryResult = !id ? await queryByOttId(openTreeResult?.id) : null;

  // console.log(queryResults);

  const result = id ? await getCladeById(id as string) : null;
  // console.log(result);

  // const children = result?.id ? await getNodeChildren(result.id) : null;
  // const children = null;

  // const lineage = result?.id ? await getNodeLineage(result.id) : null;
  // const lineage = null;
  // console.log(lineage);

  return (
    <Stack
      p={8}
      direction={['column', 'row']}
      gap={8}
      separator={<StackSeparator />}
    >
      <NodeDetails
        databaseResult={result}
        lineage={result?.lineage}
        directChildren={result?.children}
        openTreeResult={openTreeResult}
      />
      <Stack w="full" gap={8}>
        <Heading size="lg">Open Tree of Life result</Heading>
        {!openTreeResult && <Text>No result</Text>}
        {openTreeResult && (
          <OttResultCard
            databaseResult={result}
            openTreeResult={openTreeResult}
          />
        )}
        <Heading size="lg">GBIF result</Heading>
        {!gbifResult && <Text>No result</Text>}
        {gbifResult && <GbifResultCard {...gbifResult} />}
      </Stack>
    </Stack>
  );
};

export default Page;
