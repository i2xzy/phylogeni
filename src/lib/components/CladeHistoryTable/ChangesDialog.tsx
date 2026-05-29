'use client';

import { Badge, Box, Stack, Text } from '@chakra-ui/react';
import { FaCaretRight } from 'react-icons/fa';
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
import CladeChangeBox from './CladeChangeBox';
import { RevisionMode, RevisionWithUser } from '~/types/database';

const MODE_COLORS: Record<RevisionMode, string> = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
  MOVE: 'purple',
  MERGE: 'orange',
};

const ChangesDialog = ({ revision }: { revision: RevisionWithUser }) => {
  const cladeName =
    revision.before?.name ??
    revision.after?.name ??
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
        <Button unstyled _hover={{ color: 'teal' }} fontSize="xs">
          view
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Stack paddingX=".6rem">
            <DialogTitle>{`Changes by ${userLabel}`}</DialogTitle>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap=".5rem">
                <Badge
                  size="lg"
                  colorPalette={MODE_COLORS[revision.mode]}
                  variant="subtle"
                  marginRight=".5rem"
                >
                  {revision.mode}
                </Badge>
                <Text fontSize="md" fontWeight="light" color="gray.400">
                  {cladeName}
                </Text>
              </Box>
              <Text color="gray.400">
                {new Date(revision.created_at).toLocaleString()}
              </Text>
            </Box>
          </Stack>
        </DialogHeader>
        <DialogBody display="flex" justifyContent="center" gap="3">
          {revision.before && <CladeChangeBox snapshot={revision.before} />}
          {revision.before && revision.after && (
            <Box
              paddingY={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FaCaretRight size={30} />
            </Box>
          )}
          {revision.after && (
            <CladeChangeBox
              snapshot={revision.after}
              other={revision.before}
              changedFields={revision.changed_fields}
            />
          )}
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ChangesDialog;
