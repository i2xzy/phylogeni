'use client';

import { createListCollection, Stack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from '~/components/ui/select';
import { SegmentedControl } from '~/components/ui/segmented-control';
import {
  ranksForCode,
  NO_RANK,
  type NomenclatureCode,
} from '~/lib/constants/ranks';

const ALL = 'all';

// Rank dropdown whose options follow the clade's nomenclatural code. When the
// code is ambiguous (null — neither ICN-governed nor zoological-safe), all
// ranks show and a toggle lets the user narrow to zoological or botanical.
export default function RankSelect({
  code,
  value,
  onChange,
}: {
  code: NomenclatureCode | null;
  value: string;
  onChange: (value: string) => void;
}) {
  const [override, setOverride] = useState<string>(ALL);
  const effectiveCode =
    code ?? (override === ALL ? null : (override as NomenclatureCode));

  const ranks = useMemo(
    () =>
      createListCollection({
        items: [
          { value: NO_RANK, label: NO_RANK },
          ...ranksForCode(effectiveCode),
        ],
      }),
    [effectiveCode]
  );

  return (
    <Stack gap={2} width="full">
      {code === null && (
        <SegmentedControl
          alignSelf="flex-start"
          size="xs"
          value={override}
          onValueChange={(e) => setOverride(e.value ?? ALL)}
          items={[
            { value: ALL, label: 'All' },
            { value: 'zoological', label: 'Zoological' },
            { value: 'botanical', label: 'Botanical' },
          ]}
        />
      )}
      <SelectRoot
        width="full"
        collection={ranks}
        value={[value]}
        onValueChange={(e) => onChange(e.value[0])}
      >
        <SelectTrigger>
          <SelectValueText placeholder="Select rank" />
        </SelectTrigger>
        <SelectContent>
          {ranks.items.map((item) => (
            <SelectItem item={item} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Stack>
  );
}
