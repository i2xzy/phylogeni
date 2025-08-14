import {
  Box,
  Container,
  Icon,
  Link,
  Stack,
  Text,
  List,
  Heading,
  Separator,
} from '@chakra-ui/react';
import { RiEdit2Fill } from 'react-icons/ri';
import { TbBinaryTree } from 'react-icons/tb';
import { RiHistoryFill } from 'react-icons/ri';
import NextLink from 'next/link';

import Markdown from '~/lib/components/Markdown';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '~/components/ui/breadcrumb';
import { DataListItem, DataListRoot } from '~/components/ui/data-list';

import getCladeById from './getCladeById';
import InfoBox from './infobox';
import NavLink from './nav-link';

export const metadata = {
  title: 'Clade info',
};

export default async function CladePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getCladeById(id);

  if (!data) {
    return null;
  }

  // console.log(data);

  return (
    <Container display="flex" gap="10" maxW="8xl">
      <Stack
        maxW="5xl"
        width="full"
        flex="1"
        minHeight="var(--content-height)"
        overflow="auto"
        p={8}
        gap={8}
      >
        <BreadcrumbRoot>
          {data.lineage
            ?.filter(
              (item) =>
                !item.name.includes('Unnamed') &&
                !item.name.includes('+') &&
                !item.name.includes('-')
            )
            .reverse()
            .map((item) => (
              <BreadcrumbLink key={item.id} asChild>
                <NextLink href={item.id}>{item.name}</NextLink>
              </BreadcrumbLink>
            ))}
          <BreadcrumbCurrentLink>{data.name}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>

        <Stack>
          <Heading size="3xl">{data.name}</Heading>
          <Separator />
        </Stack>

        {data.description && (
          <Stack gap={1}>
            <Markdown>
              {data.description.replace(
                /(\bhttps?:\/\/[^\s<]+)(?![^<]*<\/a>)/g,
                '<a href="$1">$1</a>'
              )}
            </Markdown>
          </Stack>
        )}
        {!data.description && <Text>No description</Text>}
      </Stack>

      <Box w="sm" hideBelow="md" />

      <Box pos="absolute" top="12" right="8" hideBelow="md">
        <InfoBox header={data.name} image={data.image}>
          <Stack gap="1">
            <NavLink href={`/tree?node_id=${data.id}`}>
              <Icon transform="rotate(-90deg)" h={5} w={5}>
                <TbBinaryTree />
              </Icon>{' '}
              Tree
            </NavLink>
            <NavLink href={`/clade/${data.id}/edit`}>
              <RiEdit2Fill size="1.4em" /> Edit
            </NavLink>
            <NavLink href={`/clade/${data.id}/history`}>
              <RiHistoryFill size="1.4em" /> History
            </NavLink>
          </Stack>
          <DataListRoot orientation="horizontal" gap="2">
            <DataListItem label="Name" value={data.name} />
            <DataListItem
              label="Status"
              value={data.extant ? 'Extant' : 'Extinct'}
            />
            <DataListItem
              label="Parent"
              value={
                <Link as={NextLink} href={`/node-details?id=${data.parent}`}>
                  {data.lineage?.[0]?.name}
                </Link>
              }
            />
          </DataListRoot>

          {data.children?.length && (
            <Stack gap="3">
              <Text fontWeight="medium">Children</Text>
              <List.Root>
                {data.children.map((child) => (
                  <List.Item key={child.id}>
                    <Link as={NextLink} href={child.id}>
                      {child.name}
                    </Link>
                  </List.Item>
                ))}
              </List.Root>
            </Stack>
          )}
        </InfoBox>
      </Box>
    </Container>
  );
}
