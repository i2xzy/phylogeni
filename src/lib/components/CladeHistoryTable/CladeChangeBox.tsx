import { Card, DataList } from '@chakra-ui/react';
import { DataListItem } from '~/components/ui/data-list';
import { CladeSnapshot } from '~/types/database';

const formatValue = (
  value: string | number | boolean | string[] | null | undefined
): string => {
  if (value == null) return '—';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

type FieldName = keyof Omit<CladeSnapshot, 'id'>;

const FIELD_LABELS: Record<FieldName, string> = {
  name: 'Name',
  rank: 'Rank',
  extant: 'Extant',
  parent_id: 'Parent',
  common_names: 'Common names',
  description: 'Description',
};

const CladeChangeBox = ({
  snapshot,
  other,
  changedFields,
}: {
  snapshot: CladeSnapshot;
  other?: CladeSnapshot | null;
  changedFields?: string[];
}) => {
  const fields = Object.keys(FIELD_LABELS) as FieldName[];
  const isChanged = (field: string) =>
    changedFields ? changedFields.includes(field) : !!other;

  return (
    <Card.Root width="100%">
      <Card.Body>
        <DataList.Root size="sm">
          {fields.map((field) => {
            const value = snapshot[field];
            const otherValue = other?.[field];
            const changed = isChanged(field) && value !== otherValue;
            return (
              <DataListItem
                key={field}
                borderRadius="4px"
                padding="8px"
                border={changed ? 'teal 1px dashed' : ''}
                label={FIELD_LABELS[field]}
                value={formatValue(value)}
              />
            );
          })}
        </DataList.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default CladeChangeBox;
