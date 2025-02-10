'use client';

import { Box, Badge, Text, Stack } from '@chakra-ui/react';
import React from 'react';
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
import { TransactionWithUser, Mode } from '~/types/database';

const ChangesDialog = ({
  item,
  text,
}: {
  item: TransactionWithUser;
  text: string;
}) => {
  const colorsMode: Record<Mode, string> = {
    CREATE: 'green',
    DESTROY: 'red',
    UPDATE: 'blue',
  };

  return (
    <DialogRoot
      key={item.id}
      placement="center"
      motionPreset="slide-in-bottom"
      size="xl"
    >
      <DialogTrigger asChild>
        <Button unstyled _hover={{ color: 'teal' }}>
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent width="">
        <DialogHeader>
          <Stack paddingX=".6rem">
            <Box
              display="flex"
              gap=".8rem"
              alignItems="center"
              justifyContent="space-between"
            >
              <DialogTitle>{`Changes by ${item.user?.username}`}</DialogTitle>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap=".5rem">
                <Badge
                  size="lg"
                  colorPalette={colorsMode[item.mode]}
                  variant="subtle"
                  marginRight=".5rem"
                >
                  {item.mode}
                </Badge>

                <Text fontSize="md" fontWeight="light" color="gray.400">
                  {item.before?.name} ({item.identifier})
                </Text>
              </Box>

              <Box>
                <Text color="gray.400">
                  {item.created && new Date(item.created).toDateString()}
                </Text>
              </Box>
            </Box>
          </Stack>
        </DialogHeader>
        <DialogBody display="flex" justifyContent="center">
          {JSON.stringify(item.before) !== '{}' && (
            <CladeChangeBox clade={item.before} />
          )}

          {JSON.stringify(item.before) !== '{}' &&
            JSON.stringify(item.after) !== '{}' && (
              <Box
                paddingY={4}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <FaCaretRight size={30} />
              </Box>
            )}

          {JSON.stringify(item.after) !== '{}' && (
            <CladeChangeBox
              clade={Object(item.after)}
              other={Object(item.before)}
            />
          )}
        </DialogBody>
        {/* <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <Button>Save</Button>
                </DialogFooter> */}
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ChangesDialog;
