'use client';

import { Card, Heading, Stack, Link, StackSeparator } from '@chakra-ui/react';
import NextLink from 'next/link';

import DescriptionList from '~/lib/components/DescriptionList';
import { Database } from '~/types/supabase';
import type { OttNodeDetails } from '~/types/ott';

import MatchText from './MatchText';

type Clade = Database['public']['Tables']['clades']['Row'];

type Props = {
  openTreeResult: OttNodeDetails;
  databaseResult?: Clade | null;
};

const OttResultCard = ({ databaseResult, openTreeResult }: Props) => {
  return (
    <Card.Root>
      <Card.Body>
        <Stack separator={<StackSeparator />}>
          <DescriptionList
            items={[
              { key: 'Node ID', value: openTreeResult.id },
              {
                key: 'Name',
                value: openTreeResult.name && (
                  <MatchText match={databaseResult?.name}>
                    {openTreeResult.name}
                  </MatchText>
                ),
              },
              { key: 'Synonyms', value: openTreeResult.synonyms?.join(', ') },
              { key: 'Unique name', value: openTreeResult.unique_name },
              // {
              //   key: 'Rank',
              //   value: openTreeResult.rank && (
              //     <MatchText match={databaseResult?.rank}>
              //       {openTreeResult.rank}
              //     </MatchText>
              //   ),
              // },
              {
                key: 'Status',
                value: (
                  <MatchText
                    match={databaseResult?.extant ? 'Extant' : 'Extinct'}
                  >
                    {openTreeResult.extinct ? 'Extinct' : 'Extant'}
                  </MatchText>
                ),
              },
            ]}
          />

          {openTreeResult.lineage?.length && (
            <div>
              <Heading size="sm">Lineage</Heading>
              <DescriptionList
                items={openTreeResult.lineage?.map((item) => ({
                  key:
                    !item.rank || item.rank === 'no rank' ? 'Clade' : item.rank,
                  value: (
                    <Link asChild>
                      <NextLink href={`/node-details?ott_id=${item.id}`}>
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
            {openTreeResult.children && (
              <DescriptionList
                items={openTreeResult.children?.map((item, i) => ({
                  key: `${i + 1}`,
                  value: (
                    <Link asChild>
                      <NextLink href={`/node-details?ott_id=${item.id}`}>
                        {item.name}
                      </NextLink>
                    </Link>
                  ),
                }))}
              />
            )}
          </div>

          <div>
            <Heading size="sm">External Sources</Heading>
            <DescriptionList
              items={
                openTreeResult.sources?.map((source) => ({
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
          </div>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

export default OttResultCard;
