'use client';

import { HStack, Stack, Text } from '@chakra-ui/react';
import { Fragment } from 'react';

import { Avatar } from '~/components/ui/avatar';
import { formatDateTime } from '~/lib/utils/date';

import { CladeRef, UserRef } from './RevisionFeedItem';
import { RevisionGroup, subjectKey } from './groupRevisions';

type Subject = { id: number | null; name: string | null };

// Distinct subject clades, newest-first (the feed order), deduped.
const groupSubjects = (group: RevisionGroup): Subject[] => {
  const seen = new Set<string>();
  const subjects: Subject[] = [];
  for (const r of group.revisions) {
    const key = subjectKey(r);
    if (seen.has(key)) continue;
    seen.add(key);
    subjects.push({
      id: r.clade_id,
      name: r.after?.name ?? r.before?.name ?? null,
    });
  }
  return subjects;
};

// Render the clades as "A", "A and B", or "A, B and C" (no Oxford comma). Long
// lists just wrap to multiple lines.
const SubjectList = ({ subjects }: { subjects: Subject[] }) => (
  <>
    {subjects.map((s, i) => (
      <Fragment key={i}>
        {i > 0 && (i === subjects.length - 1 ? ' and ' : ', ')}
        <CladeRef id={s.id} fallbackName={s.name} />
      </Fragment>
    ))}
  </>
);

const GroupSentence = ({ group }: { group: RevisionGroup }) => {
  const { mode, user, revisions } = group;
  const list = <SubjectList subjects={groupSubjects(group)} />;
  const by = (
    <>
      {' '}
      by <UserRef user={user} />.
    </>
  );

  // Name the shared destination only when every revision points at the same one.
  const commonTarget =
    new Set(revisions.map((r) => r.target_clade_id)).size === 1
      ? revisions[0].target_clade_id
      : null;
  const target = (
    <CladeRef id={commonTarget} fallbackName={revisions[0].target_name} />
  );

  switch (mode) {
    case 'CREATE':
      return (
        <Text>
          {list} were created
          {commonTarget != null && <> as children of {target}</>}
          {by}
        </Text>
      );
    case 'DELETE':
      return (
        <Text>
          {list} were deleted{by}
        </Text>
      );
    case 'MOVE':
      return (
        <Text>
          {list} were moved
          {commonTarget != null && <> to be children of {target}</>}
          {by}
        </Text>
      );
    case 'MERGE':
      return (
        <Text>
          {list} were merged
          {commonTarget != null && <> into {target}</>}
          {by}
        </Text>
      );
    case 'UPDATE':
    default: {
      const fields = Array.from(
        new Set(revisions.flatMap((r) => r.changed_fields))
      ).join(', ');
      return (
        <Text>
          {list} were updated{by}
          {fields && (
            <>
              {' '}
              <Text as="span" color="fg.muted">
                {fields}
              </Text>
            </>
          )}
        </Text>
      );
    }
  }
};

const RevisionGroupItem = ({ group }: { group: RevisionGroup }) => {
  const { user, revisions } = group;
  const userLabel = user?.username ?? user?.full_name ?? '?';

  return (
    <HStack
      align="flex-start"
      gap="3"
      paddingY="3"
      borderBottom="1px solid"
      borderColor="border"
      _last={{ borderBottom: 'none' }}
    >
      <Avatar size="sm" name={userLabel} src={user?.avatar_url ?? undefined} />
      <Stack gap="1" flex="1" fontSize={{ base: 'sm', md: 'md' }}>
        <GroupSentence group={group} />
        <Text color="fg.muted" fontSize="xs">
          {formatDateTime(revisions[0].created_at)}
        </Text>
      </Stack>
    </HStack>
  );
};

export default RevisionGroupItem;
