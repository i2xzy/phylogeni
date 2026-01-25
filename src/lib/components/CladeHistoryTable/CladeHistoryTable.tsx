'use client';

import {
  Badge,
  Box,
  HStack,
  Heading,
  Input,
  Stack,
  Table,
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
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { Checkbox } from '~/components/ui/checkbox';
import { InputGroup } from '~/components/ui/input-group';
import { SegmentedControl } from '~/components/ui/segmented-control';
import ChangesDialog from './ChangesDialog';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Clade, Mode, TransactionWithUser } from '~/types/database';

export const CladeHistoryTable = ({
  rows,
  cladeId,
  cladeName,
}: {
  rows: TransactionWithUser[];
  cladeId: string;
  cladeName: string | undefined;
}) => {
  const [page, setPage] = useState(1);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [currentRows, setCurrentRows] = useState<TransactionWithUser[]>([]);
  const [checked, setChecked] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [changeTypeFilter, setChangeTypeFilter] = useState('All');
  const searchParams = useSearchParams();

  const newSearchParams = new URLSearchParams(searchParams);
  const router = useRouter();
  const rowsPerPage = 18;

  useEffect(() => {
    setCurrentRows(
      filteredRows.slice(
        (page - 1) * rowsPerPage,
        (page - 1) * rowsPerPage + rowsPerPage
      )
    );
  }, [rows, filteredRows, page]);

  const handleSearch = (value: string) => {
    const filterRows = (tx: TransactionWithUser) =>
      tx.user?.id?.includes(value) ||
      tx.identifier?.includes(value) ||
      tx.user?.username?.toLowerCase().includes(value.toLowerCase()) ||
      tx.after?.name?.toLowerCase().includes(value.toLowerCase()) ||
      tx.after?.otherNames?.toLowerCase().includes(value.toLowerCase());
    setSearchText(value);
    setFilteredRows(rows.filter(filterRows));
  };

  const handleModeFilter = (mode: string) => {
    const filterRows = (tx: TransactionWithUser) =>
      mode === 'All' ? tx : tx.mode === mode;
    setChangeTypeFilter(mode);
    setFilteredRows(rows.filter(filterRows));
  };

  const handleChecked = (e: CheckboxCheckedChangeDetails) => {
    const value: boolean = !!e.checked;
    setChecked(value);
    newSearchParams.set('include_children', value ? 'true' : 'false');
    router.push(`/clade/${cladeId}/revisions?${newSearchParams.toString()}`);
  };

  const CladeDiff = (
    clade1: Partial<Clade> | null,
    clade2: Partial<Clade> | null
  ) => {
    const result: Record<string, string | boolean | null> = {};
    if (clade1 && clade2) {
      const c1 = Object(clade1);
      const c2 = Object.entries(clade2);

      c2.map(([k, v]) => {
        if (c1[k] !== v) {
          result[k] = v;
        }
      });
    }

    return result;
  };

  const colorsMode: Record<Mode, string> = {
    CREATE: 'green',
    DESTROY: 'red',
    UPDATE: 'blue',
  };

  return (
    <Stack width="full" gap="5">
      <Box
        display="flex"
        xlDown={{ display: 'block' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box xlDown={{ marginBottom: '1.8rem' }}>
          <Heading size="xl">Clade Revision History</Heading>
          <Box display="flex" gap="4px">
            <Text
              _dark={{ color: 'rgba(255,255,255,.5)' }}
              _light={{ color: 'rgba(20,20,20,0.5)' }}
              fontWeight="medium"
              fontSize={15}
            >
              {`${rows.length} ${rows.length === 1 ? 'change' : 'changes'} made to`}
            </Text>
            <Text color="teal" fontWeight="medium" fontSize={15}>
              {cladeName}
            </Text>
          </Box>
        </Box>

        <Box
          xlDown={{ justifyContent: 'space-between' }}
          display="flex"
          lgDown={{ display: 'block' }}
          alignItems="center"
          gap="2rem"
          mdDown={{ gap: '.5rem' }}
        >
          <Box
            display="flex"
            lgDown={{ justifyContent: 'space-between', gap: '.5rem' }}
            gap="2rem"
          >
            <SegmentedControl
              size="md"
              defaultValue="All"
              items={['All', 'CREATE', 'UPDATE', 'DESTROY']}
              value={changeTypeFilter}
              onValueChange={(e) => handleModeFilter(e.value)}
            />

            <Checkbox
              checked={checked}
              onCheckedChange={handleChecked}
              fontWeight="light"
              color="gray"
            >
              Show child nodes
            </Checkbox>
          </Box>

          <InputGroup
            width="18rem"
            endElement={<RiSearchLine />}
            lgDown={{ marginTop: '1rem', width: 'full' }}
            mdDown={{ width: 'full' }}
          >
            <Input
              placeholder={'Search editor, clade, organism...'}
              onChange={(e) => {
                e.preventDefault();
                handleSearch(e.target.value);
              }}
              defaultValue=""
              value={searchText}
            />
          </InputGroup>
        </Box>
      </Box>
      {currentRows.length > 0 ? (
        <Table.Root
          size="sm"
          variant="outline"
          interactive
          _dark={{ color: 'rgba(255,255,255,.7)' }}
          _light={{ color: 'rgba(20,20,20,.7)' }}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Editor</Table.ColumnHeader>
              <Table.ColumnHeader>Clade</Table.ColumnHeader>
              <Table.ColumnHeader>Change type</Table.ColumnHeader>
              <Table.ColumnHeader>Change details</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Date</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentRows?.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Text
                    _hover={{ color: 'teal' }}
                    cursor="pointer"
                    onClick={() =>
                      item.user?.username && handleSearch(item.user?.username)
                    }
                  >
                    {item.user?.username}
                  </Text>
                </Table.Cell>
                <Table.Cell _hover={{ color: 'teal' }}>
                  <Link href={`/clade/${item.identifier}`}>
                    {item.before?.name || item.after?.name || item.identifier}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={colorsMode[item.mode]} variant="outline">
                    {item.mode}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <ChangesDialog
                    item={item}
                    text={
                      item.mode === 'UPDATE'
                        ? `See ${Object.keys(CladeDiff(item.after, item.before)).length} changes to ${Object.keys(CladeDiff(item.after, item.before))}`
                        : `See ${item.mode === 'CREATE' ? 'created' : 'deleted'} clade`
                    }
                  ></ChangesDialog>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  {item.created && new Date(item.created).toDateString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <>No data</>
      )}

      <PaginationRoot
        count={rowsPerPage * Math.ceil(filteredRows.length / rowsPerPage)}
        pageSize={rowsPerPage}
        variant="solid"
        onPageChange={(e) => {
          setPage(e.page);
        }}
        page={page}
      >
        <HStack wrap="wrap">
          <PaginationPageText
            color="rgba(255,255,255,.7)"
            format="long"
            flex="1"
          />
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </Stack>
  );
};
