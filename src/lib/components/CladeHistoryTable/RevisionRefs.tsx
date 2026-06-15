import { Text } from '@chakra-ui/react';

import { TextLink } from '~/components/ui/text-link';
import { RevisionWithUser } from '~/types/database';

// A clade reference: links to the clade when we have its id, otherwise renders
// the name as plain text (e.g. a deleted clade, whose id is gone).
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

// The user who made a revision; "[deleted user]" when the account is gone.
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
