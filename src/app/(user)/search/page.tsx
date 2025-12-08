import { Card, Heading, Stack, StackSeparator, Text } from '@chakra-ui/react';
import { Metadata } from 'next';
import Link from 'next/link';

import { matchName } from '~/lib/utils/ott';
import getCladesByName from '~/lib/utils/supabase/queries/getCladesByName';

import Search from './search';

export const metadata: Metadata = {
  title: 'Advanced search',
};

const Page = async ({ searchParams }: PageProps<'/search'>) => {
  const { q } = await searchParams;
  const results = await getCladesByName(q as string);

  const openTreeResults = await matchName(q as string);

  return (
    <Stack p={8} gap={8}>
      <Search placeholder="search" />
      <Stack
        direction={['column', 'row']}
        gap={8}
        separator={<StackSeparator />}
        h="full"
      >
        <Stack w="full">
          <Heading size="lg">Database results</Heading>
          {!results.length && <Text>No results</Text>}
          {results.map((item) => (
            <Link key={item.id} href={`/node-details?id=${item.id}`}>
              <Card.Root key={item.id} size="sm" w="full" variant="subtle">
                <Card.Body>
                  <Heading size="md">
                    {item.extant ? '🌱' : '🦕'} {item.name}
                  </Heading>
                  {/* <Text color="GrayText">{item.rank}</Text> */}
                </Card.Body>
              </Card.Root>
            </Link>
          ))}
        </Stack>
        <Stack w="full">
          <Heading size="lg">Open Tree of Life results</Heading>
          {!openTreeResults.length && <Text>No results</Text>}
          {openTreeResults.map((item) => (
            <Link key={item.id} href={`/node-details?ott_id=ott${item.id}`}>
              <Card.Root key={item.id} size="sm" w="full" variant="subtle">
                <Card.Body>
                  <Heading size="md">
                    {item.extant ? '🌱' : '🦕'} {item.name}
                  </Heading>
                  <Text color="GrayText">{item.rank}</Text>
                </Card.Body>
              </Card.Root>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
