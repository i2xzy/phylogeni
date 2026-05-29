'use client';

import {
  Box,
  Flex,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  CheckboxCheckedChangeDetails,
} from '@chakra-ui/react';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationPageText,
  PaginationRoot,
} from 'components/ui/pagination';
import { useMemo, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { Checkbox } from '~/components/ui/checkbox';
import { InputGroup } from '~/components/ui/input-group';
import { SegmentedControl } from '~/components/ui/segmented-control';
import { useSearchParams, useRouter } from 'next/navigation';
import { RevisionMode, RevisionWithUser } from '~/types/database';
import RevisionFeedItem from './RevisionFeedItem';

const MODE_FILTERS: Array<'All' | RevisionMode> = [
  'All',
  'CREATE',
  'UPDATE',
  'DELETE',
  'MOVE',
  'MERGE',
];

export const CladeHistoryTable = ({
  rows,
  cladeId,
  cladeName,
}: {
  rows: RevisionWithUser[];
  cladeId: string;
  cladeName: string | undefined;
}) => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [modeFilter, setModeFilter] = useState<'All' | RevisionMode>('All');
  const [checked, setChecked] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const rowsPerPage = 18;

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

  const currentRows = useMemo(
    () =>
      filteredRows.slice(
        (page - 1) * rowsPerPage,
        (page - 1) * rowsPerPage + rowsPerPage
      ),
    [filteredRows, page]
  );

  const handleChecked = (e: CheckboxCheckedChangeDetails) => {
    const value: boolean = !!e.checked;
    setChecked(value);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('include_children', value ? 'true' : 'false');
    router.push(`/clade/${cladeId}/revisions?${newSearchParams.toString()}`);
  };

  return (
    <Stack width="full" gap="6">
      <Stack gap="1">
        <Heading size="xl">Clade Revision History</Heading>
        <Text fontSize="sm" fontWeight="medium" color="fg.muted">
          {`${rows.length} ${rows.length === 1 ? 'change' : 'changes'} made to `}
          <Text as="span" color="teal.fg">
            {cladeName}
          </Text>
        </Text>
      </Stack>

      <Flex gap="3" align="center" justify="space-between" wrap="wrap">
        <Flex gap="3" align="center" wrap="wrap">
          <Box maxW="full" overflowX="auto">
            <SegmentedControl
              size="sm"
              defaultValue="All"
              items={MODE_FILTERS as unknown as string[]}
              value={modeFilter}
              onValueChange={(e) =>
                setModeFilter((e.value ?? 'All') as 'All' | RevisionMode)
              }
            />
          </Box>

          <Checkbox
            checked={checked}
            onCheckedChange={handleChecked}
            fontWeight="light"
            color="gray"
          >
            Show child nodes
          </Checkbox>
        </Flex>

        <InputGroup
          flex="1"
          minW="14rem"
          maxW="20rem"
          endElement={<RiSearchLine />}
        >
          <Input
            placeholder="Search editor, clade name..."
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </InputGroup>
      </Flex>

      {currentRows.length > 0 ? (
        <Stack gap="0">
          {currentRows.map((item) => (
            <RevisionFeedItem key={item.id} revision={item} />
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

      {filteredRows.length > rowsPerPage && (
        <PaginationRoot
          count={filteredRows.length}
          pageSize={rowsPerPage}
          variant="solid"
          onPageChange={(e) => setPage(e.page)}
          page={page}
        >
          <HStack wrap="wrap">
            <PaginationPageText color="fg.muted" format="long" flex="1" />
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      )}
    </Stack>
  );
};
