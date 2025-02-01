import { Card, DataList } from '@chakra-ui/react';
import { DataListItem } from '~/components/ui/data-list';
import React from 'react';
import { Clade } from '~/types/database';

function CladeChangeBox({ clade }: { clade: Partial<Clade> | null }) {
  return (
    <Card.Root width={'100%'}>
      {clade && (
        <Card.Body>
          <DataList.Root size={'sm'}>
            {Object.entries(clade).map((item) => (
              <DataListItem
                key={item[0]}
                label={item[0]}
                value={item[1]?.toString() || 'NULL'}
              />
            ))}
          </DataList.Root>
        </Card.Body>
      )}
    </Card.Root>
  );
}

export default CladeChangeBox;
