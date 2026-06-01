'use client';

import { Badge, Box, Stack, Table, Text } from '@chakra-ui/react';
import { Button } from '~/components/ui/button';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  CladeDetails,
  CladeSnapshot,
  RevisionWithUser,
} from '~/types/database';

type FieldKey = 'name' | 'rank' | 'extant' | 'common_names';

const FIELDS: Array<{ key: FieldKey; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'rank', label: 'Rank' },
  { key: 'extant', label: 'Status' },
  { key: 'common_names', label: 'Common names' },
];

const read = (
  source: CladeDetails | CladeSnapshot | null | undefined,
  key: FieldKey
) => (source ? source[key] : null);

const format = (key: FieldKey, value: unknown): string => {
  if (key === 'extant') {
    return value === true ? 'Extant' : value === false ? 'Extinct' : '—';
  }
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (value == null || value === '') return '—';
  return String(value);
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const ChangesDialog = ({
  revision,
  currentClade,
}: {
  revision: RevisionWithUser;
  currentClade: CladeDetails | null;
}) => {
  const cladeName =
    currentClade?.name ??
    revision.after?.name ??
    revision.before?.name ??
    `clade ${revision.clade_id}`;
  const userLabel =
    revision.user?.username ?? revision.user?.full_name ?? 'unknown user';

  return (
    <DialogRoot
      key={revision.id}
      placement="center"
      motionPreset="slide-in-bottom"
      size="xl"
    >
      <DialogTrigger asChild>
        <Button unstyled color="teal.fg" fontWeight="medium" fontSize="xs">
          view
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Stack gap="2">
            <DialogTitle>Changes to {cladeName}</DialogTitle>
            <Box display="flex" alignItems="center" gap=".5rem">
              <Badge colorPalette="blue" variant="subtle">
                {revision.mode}
              </Badge>
              <Text fontSize="sm" color="fg.muted">
                by {userLabel} · {formatDate(revision.created_at)}
              </Text>
            </Box>
          </Stack>
        </DialogHeader>
        <DialogBody>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Field</Table.ColumnHeader>
                <Table.ColumnHeader>Current</Table.ColumnHeader>
                <Table.ColumnHeader>Change</Table.ColumnHeader>
                <Table.ColumnHeader>Previous</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {FIELDS.map(({ key, label }) => {
                const changed = revision.changed_fields.includes(key);
                return (
                  <Table.Row key={key}>
                    <Table.Cell fontWeight="medium">{label}</Table.Cell>
                    <Table.Cell color="fg.muted">
                      {format(key, read(currentClade, key))}
                    </Table.Cell>
                    <Table.Cell bg={changed ? 'green.subtle' : undefined}>
                      {format(key, read(revision.after, key))}
                    </Table.Cell>
                    <Table.Cell bg={changed ? 'red.subtle' : undefined}>
                      {format(key, read(revision.before, key))}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ChangesDialog;
