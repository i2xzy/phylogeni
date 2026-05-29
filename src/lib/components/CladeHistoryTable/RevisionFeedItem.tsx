'use client';

import { HStack, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Avatar } from '~/components/ui/avatar';
import { RevisionWithUser } from '~/types/database';
import ChangesDialog from './ChangesDialog';

const formatTimestamp = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const CladeRef = ({
  id,
  fallbackName,
}: {
  id: number | null;
  fallbackName?: string | null;
}) => {
  const label = fallbackName ?? (id != null ? `clade ${id}` : 'unknown clade');
  if (id == null) {
    return (
      <Text as="span" fontWeight="medium">
        {label}
      </Text>
    );
  }
  return (
    <NextLink href={`/clade/${id}`}>
      <Text as="span" color="teal.300" fontWeight="medium">
        {label}
      </Text>
    </NextLink>
  );
};

const UserRef = ({ user }: { user: RevisionWithUser['user'] }) => {
  if (!user) {
    return (
      <Text as="span" color="gray.400">
        [deleted user]
      </Text>
    );
  }
  const label = user.username ?? user.full_name ?? 'someone';
  return (
    <NextLink href={`/user/${user.username ?? user.id}`}>
      <Text as="span" color="teal.300" fontWeight="medium">
        {label}
      </Text>
    </NextLink>
  );
};

const RevisionSentence = ({ revision }: { revision: RevisionWithUser }) => {
  const cladeName = revision.before?.name ?? revision.after?.name;
  const targetName = revision.after?.name; // for MERGE/MOVE, after.parent context isn't enough; rely on a future denorm
  const fieldList = revision.changed_fields.length
    ? revision.changed_fields.join(', ')
    : null;

  switch (revision.mode) {
    case 'CREATE':
      return (
        <Text>
          <CladeRef id={revision.clade_id} fallbackName={cladeName} /> was
          created by <UserRef user={revision.user} />.
        </Text>
      );
    case 'UPDATE':
      return (
        <Text>
          <CladeRef id={revision.clade_id} fallbackName={cladeName} /> was
          updated by <UserRef user={revision.user} />
          {fieldList && (
            <>
              .{' '}
              <Text as="span" color="gray.400">
                {fieldList}
              </Text>
            </>
          )}
          {!fieldList && '.'}
        </Text>
      );
    case 'DELETE':
      return (
        <Text>
          <CladeRef id={revision.clade_id} fallbackName={cladeName} /> was
          deleted by <UserRef user={revision.user} />.
        </Text>
      );
    case 'MOVE':
      return (
        <Text>
          <CladeRef id={revision.clade_id} fallbackName={cladeName} /> was moved
          under{' '}
          <CladeRef id={revision.target_clade_id} fallbackName={targetName} />{' '}
          by <UserRef user={revision.user} />.
        </Text>
      );
    case 'MERGE':
      return (
        <Text>
          <CladeRef id={revision.clade_id} fallbackName={cladeName} /> was
          merged into{' '}
          <CladeRef id={revision.target_clade_id} fallbackName={targetName} />{' '}
          by <UserRef user={revision.user} />.
        </Text>
      );
  }
};

const RevisionFeedItem = ({ revision }: { revision: RevisionWithUser }) => {
  const userLabel = revision.user?.username ?? revision.user?.full_name ?? '?';
  return (
    <HStack
      align="flex-start"
      gap="3"
      paddingY="3"
      borderBottom="1px solid"
      borderColor="gray.700"
      _last={{ borderBottom: 'none' }}
    >
      <Avatar
        size="sm"
        name={userLabel}
        src={revision.user?.avatar_url ?? undefined}
      />
      <Stack gap="1" flex="1">
        <RevisionSentence revision={revision} />
        <HStack gap="2" color="gray.400" fontSize="xs">
          <Text>{formatTimestamp(revision.created_at)}</Text>
          {revision.mode === 'UPDATE' && (
            <>
              <Text>·</Text>
              <ChangesDialog revision={revision} />
            </>
          )}
        </HStack>
      </Stack>
    </HStack>
  );
};

export default RevisionFeedItem;
