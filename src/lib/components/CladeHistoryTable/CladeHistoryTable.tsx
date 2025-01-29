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
import { Mode, Status, TransactionWithUser } from '~/types/database';

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
      tx.user?.username?.includes(value);
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

  const colorsMode: Record<Mode, string> = {
    CREATE: 'green',
    DESTROY: 'red',
    UPDATE: 'blue',
  };

  const colorsStatus: Record<Status, string> = {
    DONE: 'green',
    FAILED: 'red',
    REVIEW: 'yellow',
  };

  return (
    <Stack width="full" gap="5">
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <div>
          <Heading size="xl">Clade Revision History</Heading>
          <Box display={'flex'} gap={'4px'}>
            <Text
              color={'rgba(255,255,255,.5)'}
              fontWeight={'medium'}
              fontSize={15}
            >
              {rows.length} changes made to
            </Text>
            <Text color={'teal'} fontWeight={'medium'} fontSize={15}>
              {cladeName}
            </Text>
          </Box>
        </div>

        <Box alignContent={'center'}>
          <SegmentedControl
            size={'md'}
            defaultValue="All"
            items={['All', 'CREATE', 'UPDATE', 'DESTROY']}
            value={changeTypeFilter}
            onValueChange={(e) => handleModeFilter(e.value)}
          />
        </Box>

        <Box
          gap={'2rem'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Checkbox
            checked={checked}
            onCheckedChange={handleChecked}
            fontWeight={'light'}
            color={'gray'}
          >
            Show child nodes
          </Checkbox>

          <InputGroup width={'18rem'} endElement={<RiSearchLine />}>
            <Input
              placeholder={'Search editor, clade, organism...'}
              onChange={(e) => {
                e.preventDefault();
                handleSearch(e.target.value);
              }}
              defaultValue={''}
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
          color={'rgba(255,255,255,.7)'}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Editor</Table.ColumnHeader>
              <Table.ColumnHeader>Clade</Table.ColumnHeader>
              <Table.ColumnHeader>Change type</Table.ColumnHeader>
              <Table.ColumnHeader>Change details</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Date</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentRows?.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.user?.username}</Table.Cell>
                <Table.Cell _hover={{ color: 'teal' }}>
                  <Link href={`/clade/${item.identifier}`}>
                    {item.before?.name || item.after?.name || item.identifier}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={colorsMode[item.mode]}
                    variant={'surface'}
                  >
                    {item.mode}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {
                    <ChangesDialog
                      item={item}
                      text={
                        item.mode === 'UPDATE'
                          ? 'See changes made'
                          : `See ${item.mode === 'CREATE' ? 'created' : 'deleted'} clade`
                      }
                    ></ChangesDialog>
                  }
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={colorsStatus[item.status]}
                    variant={'outline'}
                  >
                    {item.status}
                  </Badge>
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
            color={'rgba(255,255,255,.7)'}
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
