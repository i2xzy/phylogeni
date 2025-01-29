import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { Json } from '~/types/supabase';

function CladeChangeBox({ obj, name }: { obj: Json; name: string }) {
  return (
    <Box maxWidth={'47%'}>
      <Text marginBottom={'.8em'}>{name}</Text>
      <Box
        fontWeight={'light'}
        background={'gray.900'}
        padding={2}
        border={'solid'}
        borderWidth={1}
        borderColor={'gray.800'}
        borderRadius={'2px'}
      >
        {obj &&
          Object.entries(obj).map((entry) => (
            <>
              <Text fontWeight={'medium'}>{`${entry[0]}:`}</Text>{' '}
              <Text>
                {entry[1] === null ? 'NULL' : JSON.stringify(entry[1])}
              </Text>
            </>
          ))}
      </Box>
    </Box>
  );
}

export default CladeChangeBox;
