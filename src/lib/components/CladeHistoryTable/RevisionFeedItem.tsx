'use client';

import { HStack, Stack, Text } from '@chakra-ui/react';
import { Avatar } from '~/components/ui/avatar';
import { TextLink } from '~/components/ui/text-link';
import { CladeDetails, RevisionWithUser } from '~/types/database';
import { formatDateTime } from '~/lib/utils/date';
import ChangesDialog from './ChangesDialog';

export const CladeRef = ({
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
    <TextLink href={`/clade/${id}`} fontWeight="medium">
      {label}
    </TextLink>
  );
};

export const UserRef = ({ user }: { user: RevisionWithUser['user'] }) => {
  if (!user) {
    return (
      <Text as="span" color="fg.muted">
        [deleted user]
      </Text>
    );
  }
  const label = user.username ?? user.full_name ?? 'someone';
  return (
    <TextLink href={`/user/${user.username ?? user.id}`} fontWeight="medium">
      {label}
    </TextLink>
  );
};

const RevisionSentence = ({ revision }: { revision: RevisionWithUser }) => {
  const cladeName = revision.before?.name ?? revision.after?.name;
  const targetName = revision.target_name;
  const fieldList = revision.changed_fields.length
    ? revision.changed_fields.join(', ')
    : null;

  switch (revision.mode) {
    case 'CREATE':
      return (
        <Text>
          <CladeRef id={revision.clade_id} fallbackName={cladeName} /> was
          created
          {revision.target_clade_id != null && (
            <>
              {' '}
              as a child of{' '}
              <CladeRef
                id={revision.target_clade_id}
                fallbackName={targetName}
              />
            </>
          )}{' '}
          by <UserRef user={revision.user} />.
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
              <Text as="span" color="fg.muted">
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
          to be a child of{' '}
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

const RevisionFeedItem = ({
  revision,
  currentClade,
}: {
  revision: RevisionWithUser;
  currentClade: CladeDetails | null;
}) => {
  const userLabel = revision.user?.username ?? revision.user?.full_name ?? '?';
  return (
    <HStack
      align="flex-start"
      gap="3"
      paddingY="3"
      borderBottom="1px solid"
      borderColor="border"
      _last={{ borderBottom: 'none' }}
    >
      <Avatar
        size="sm"
        name={userLabel}
        src={revision.user?.avatar_url ?? undefined}
      />
      <Stack gap="1" flex="1" fontSize={{ base: 'sm', md: 'md' }}>
        <RevisionSentence revision={revision} />
        <HStack gap="2" color="fg.muted" fontSize="xs">
          <Text>{formatDateTime(revision.created_at)}</Text>
          {revision.mode === 'UPDATE' && (
            <>
              <Text>·</Text>
              <ChangesDialog revision={revision} currentClade={currentClade} />
            </>
          )}
        </HStack>
      </Stack>
    </HStack>
  );
};

export default RevisionFeedItem;
