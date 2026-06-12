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
  ranksForContext,
  rankLabel,
  type NomenclatureCode,
} from '~/lib/constants/ranks';

const ALL = 'all';

// Rank dropdown whose options follow the clade's nomenclatural code. When the
// nomenclature is ambiguous (null — neither ICN-governed nor zoological-safe), all
// ranks show and a toggle lets the user narrow to zoological or botanical.
// Options are also limited to ranks finer than the clade's ranked ancestors.
// A null value means the rank isn't set; clearing the select returns to null.
export default function RankSelect({
  nomenclature,
  ancestorRanks,
  value,
  onChange,
}: {
  nomenclature: NomenclatureCode | null;
  ancestorRanks: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [override, setOverride] = useState<string>(ALL);
  const effectiveNomenclature =
    nomenclature ?? (override === ALL ? null : (override as NomenclatureCode));

  const ranks = useMemo(() => {
    const allowed = ranksForContext(effectiveNomenclature, ancestorRanks);
    // Keep the current value selectable even if it's outside the allowed set
    // (e.g. legacy data), so it still displays.
    const items =
      value && !allowed.some((r) => r.value === value)
        ? [{ value, label: rankLabel(value) }, ...allowed]
        : allowed;
    return createListCollection({ items });
  }, [effectiveNomenclature, ancestorRanks, value]);

  return (
    <Stack gap={2} width="full">
      {nomenclature === null && (
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
        value={value ? [value] : []}
        onValueChange={(e) => onChange(e.value[0] ?? null)}
      >
        <SelectTrigger clearable>
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
