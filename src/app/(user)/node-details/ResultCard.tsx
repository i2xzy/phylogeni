import { Card, Heading, Stack, StackSeparator, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import DescriptionList from '~/lib/components/DescriptionList';
import { Database } from '~/types/supabase';
import type { OttNodeDetails } from '~/types/ott';

import MatchText from './MatchText';

type Clade = Database['public']['Tables']['clades']['Row'];

type Props = {
  openTreeResult?: OttNodeDetails | null;
  databaseResult: Clade;
  lineage?: Clade[] | null;
  directChildren?: Clade[] | null;
};

const ResultCard = ({
  databaseResult,
  openTreeResult,
  lineage,
  directChildren,
}: Props) => {
  return (
    <Card.Root>
      <Card.Body>
        <Stack separator={<StackSeparator />}>
          <DescriptionList
            items={[
              { key: 'Node ID', value: databaseResult.id },
              {
                key: 'Name',
                value: databaseResult.name && (
                  <MatchText match={openTreeResult?.name}>
                    {databaseResult.name}
                  </MatchText>
                ),
              },
              // {
              //   key: 'Rank',
              //   value: databaseResult.rank && (
              //     <MatchText match={openTreeResult?.rank}>
              //       {databaseResult.rank}
              //     </MatchText>
              //   ),
              // },
              {
                key: 'Status',
                value: (
                  <MatchText
                    match={openTreeResult?.extinct ? 'Extinct' : 'Extant'}
                  >
                    {databaseResult.extant ? 'Extant' : 'Extinct'}
                  </MatchText>
                ),
              },
              {
                key: 'Parent',
                value: (
                  <Link asChild>
                    <NextLink
                      href={`/node-details?id=${databaseResult.parent}`}
                    >
                      {lineage?.[0]?.name}
                    </NextLink>
                  </Link>
                ),
              },
            ]}
          />

          {lineage?.length && (
            <div>
              <Heading size="sm">Lineage</Heading>
              <DescriptionList
                items={lineage
                  ?.toReversed()
                  .filter(
                    (item) =>
                      !item.name.includes('Unnamed') &&
                      !item.name.includes('+') &&
                      !item.name.includes('-')
                  )
                  .map((item) => ({
                    key: 'Clade',
                    value: (
                      <Link asChild>
                        <NextLink href={`/node-details?id=${item.id}`}>
                          {item.name}
                        </NextLink>
                      </Link>
                    ),
                  }))}
              />
            </div>
          )}

          <div>
            <Heading size="sm">Children</Heading>
            {directChildren && (
              <DescriptionList
                items={directChildren?.map((item, i) => ({
                  key: `${i + 1}`,
                  value: (
                    <Link asChild>
                      <NextLink href={`/node-details?id=${item.id}`}>
                        {item.name}
                      </NextLink>
                    </Link>
                  ),
                }))}
              />
            )}
          </div>

          {/* <div>
            <Heading size="sm">External Sources</Heading>
            <DescriptionList
              items={
                databaseResult.sources?.map((source) => ({
                  key: source.name.toUpperCase(),
                  value: source.link ? (
                    <>
                      {source.id}{' '}
                      <Link
                        color="teal.500"
                        href={source.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        See more
                      </Link>
                    </>
                  ) : (
                    source.id
                  ),
                })) || []
              }
            />
          </div> */}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

export default ResultCard;
