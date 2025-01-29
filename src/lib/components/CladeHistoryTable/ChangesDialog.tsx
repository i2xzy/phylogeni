'use client';

import { Box, Badge } from '@chakra-ui/react';
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
import { TransactionWithUser, Status } from '~/types/database';

const ChangesDialog = ({
  item,
  text,
}: {
  item: TransactionWithUser;
  text: string;
}) => {
  const colorsStatus: Record<Status, string> = {
    DONE: 'green',
    FAILED: 'red',
    REVIEW: 'yellow',
  };

  return (
    <DialogRoot
      key={item.id}
      placement={'center'}
      motionPreset="slide-in-bottom"
      size={'lg'}
    >
      <DialogTrigger asChild>
        <Button unstyled _hover={{ color: 'teal' }}>
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent width={''}>
        <DialogHeader display={'flex'} gap={'.8rem'} alignItems={'center'}>
          <DialogTitle>{`Changes by ${item.user}`}</DialogTitle>
          <Badge
            size={'lg'}
            colorPalette={colorsStatus[item.status]}
            variant={'outline'}
          >
            {item.status}
          </Badge>{' '}
          :
        </DialogHeader>
        <DialogBody display={'flex'} justifyContent={'center'}>
          {JSON.stringify(item.before) !== '{}' && (
            <CladeChangeBox name={'Clade before'} obj={item.before} />
          )}

          {JSON.stringify(item.before) !== '{}' &&
            JSON.stringify(item.after) !== '{}' && (
              <Box
                paddingY={4}
                display={'flex'}
                justifyContent={'center'}
                alignContent={'center'}
                alignItems={'center'}
              >
                <FaCaretRight size={30} />
              </Box>
            )}

          {JSON.stringify(item.after) !== '{}' && (
            <CladeChangeBox name={'Clade after'} obj={item.after} />
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
