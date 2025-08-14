import { Card, DataList } from '@chakra-ui/react';
import { DataListItem } from '~/components/ui/data-list';
import React from 'react';
import { Clade } from '~/types/database';

const FieldItem = ({
  fieldName,
  field,
  otherField,
}: {
  fieldName: string;
  field?: string | boolean | null;
  otherField?: string | boolean | null;
}) => (
  <DataListItem
    borderRadius="4px"
    border={otherField && field !== otherField ? 'teal 1px dashed' : ''}
    key={fieldName}
    padding="8px"
    overflowY="auto"
    overflowX={'hidden'}
    wordWrap={'break-word'}
    maxHeight="160px"
    maxWidth="100%"
    label={fieldName}
    value={field}
  />
);

function CladeChangeBox({
  clade,
  other,
}: {
  clade: Partial<Clade> | null;
  other?: Partial<Clade> | null;
}) {
  const cladeFields = {
    Name: [clade?.name, other?.name],
    Synonyms: [clade?.otherNames, other?.otherNames],
    Extant: [JSON.stringify(clade?.extant), JSON.stringify(other?.extant)],
    Parent: [clade?.parent, other?.parent],
    Description: [clade?.description, other?.description],
  };

  return (
    <Card.Root width="100%">
      {clade && (
        <Card.Body>
          <DataList.Root size="sm">
            {Object.entries(cladeFields).map(([k, v]) => (
              <FieldItem
                key={clade.id}
                fieldName={k}
                field={v[0]}
                otherField={v[1]}
              />
            ))}
          </DataList.Root>
        </Card.Body>
      )}
    </Card.Root>
  );
}

export default CladeChangeBox;
