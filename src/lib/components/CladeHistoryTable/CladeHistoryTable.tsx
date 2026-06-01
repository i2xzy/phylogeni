'use client';

import { Box, Flex, Heading, Input, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '~/components/ui/breadcrumb';
import { InputGroup } from '~/components/ui/input-group';
import { SegmentedControl } from '~/components/ui/segmented-control';
import { CladeDetails, RevisionMode, RevisionWithUser } from '~/types/database';
import RevisionFeedItem from './RevisionFeedItem';
// TODO: restore with the "show child nodes" history filter
// import { CheckboxCheckedChangeDetails } from '@chakra-ui/react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Checkbox } from '~/components/ui/checkbox';

const MODE_FILTERS: Array<'All' | RevisionMode> = [
  'All',
  'CREATE',
  'UPDATE',
  'DELETE',
  'MOVE',
  'MERGE',
];

// Display the filter values as title case (Create, Update…) while keeping the
// underlying enum value for filtering.
const MODE_FILTER_ITEMS = MODE_FILTERS.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export const CladeHistoryTable = ({
  rows,
  clade,
}: {
  rows: RevisionWithUser[];
  clade: CladeDetails | null;
}) => {
  const [searchText, setSearchText] = useState('');
  const [modeFilter, setModeFilter] = useState<'All' | RevisionMode>('All');

  // TODO: re-enable with the "show child nodes" history filter (needs a
  // `cladeId` prop to build the navigation URL).
  // const [checked, setChecked] = useState(false);
  // const searchParams = useSearchParams();
  // const router = useRouter();
  //
  // const handleChecked = (e: CheckboxCheckedChangeDetails) => {
  //   const value = !!e.checked;
  //   setChecked(value);
  //   const newSearchParams = new URLSearchParams(searchParams);
  //   newSearchParams.set('include_children', value ? 'true' : 'false');
  //   router.push(`/clade/${cladeId}/revisions?${newSearchParams.toString()}`);
  // };

  const filteredRows = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return rows.filter((tx) => {
      if (modeFilter !== 'All' && tx.mode !== modeFilter) return false;
      if (!q) return true;
      const haystack = [
        tx.user?.username,
        tx.user?.full_name,
        tx.before?.name,
        tx.after?.name,
        ...(tx.before?.common_names ?? []),
        ...(tx.after?.common_names ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, modeFilter, searchText]);

  return (
    <Stack width="full" gap="6">
      {clade && (
        <BreadcrumbRoot>
          <BreadcrumbLink asChild>
            <NextLink href={`/clade/${clade.id}`}>{clade.name}</NextLink>
          </BreadcrumbLink>
          <BreadcrumbCurrentLink>Revision history</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
      )}
      <Stack gap="1">
        <Heading size="xl">Clade Revision History</Heading>
        <Text fontSize="sm" fontWeight="medium" color="fg.muted">
          {`${rows.length} ${rows.length === 1 ? 'change' : 'changes'} made to `}
          <Text as="span" color="fg">
            {clade?.name}
          </Text>
        </Text>
      </Stack>

      <Flex
        gap="3"
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
      >
        <Box
          maxW="full"
          overflowX="auto"
          p="1"
          mx="-1"
          alignSelf={{ base: 'center', sm: 'flex-start' }}
        >
          <SegmentedControl
            size="sm"
            defaultValue="All"
            items={MODE_FILTER_ITEMS}
            value={modeFilter}
            onValueChange={(e) =>
              setModeFilter((e.value ?? 'All') as 'All' | RevisionMode)
            }
            css={{ '& [data-part="item"]': { paddingInline: '2' } }}
          />
        </Box>

        {/* TODO: re-enable when child-node history is implemented
        <Checkbox
          checked={checked}
          onCheckedChange={handleChecked}
          fontWeight="light"
          color="gray"
        >
          Show child nodes
        </Checkbox> */}

        <InputGroup
          width={{ base: 'full', sm: 'auto' }}
          flex={{ md: 1 }}
          minW={{ sm: '16rem' }}
          maxW={{ md: '20rem' }}
          endElement={<RiSearchLine />}
        >
          <Input
            placeholder="Search editor, clade name..."
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </InputGroup>
      </Flex>

      {filteredRows.length > 0 ? (
        <Stack gap="0">
          {filteredRows.map((item) => (
            <RevisionFeedItem
              key={item.id}
              revision={item}
              currentClade={clade}
            />
          ))}
        </Stack>
      ) : (
        <Box paddingY="3rem" textAlign="center" color="fg.muted">
          <Text fontSize="md">
            {rows.length === 0
              ? 'No revisions yet for this clade.'
              : 'No revisions match your filters.'}
          </Text>
        </Box>
      )}
    </Stack>
  );
};
