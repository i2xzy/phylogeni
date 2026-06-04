'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import { Button, Input, Stack, Text } from '@chakra-ui/react';

import { postFetcher } from '~/lib/utils/swr/fetchers';

type CladeResult = {
  id: number;
  name: string;
  extant: boolean | null;
  rank: string | null;
};

export type SelectedClade = { id: number; name: string };

// A debounced typeahead for picking a clade by name (backed by /api/search).
// Used for choosing a new parent when moving or creating a clade.
export default function CladeSearchSelect({
  value,
  onChange,
  excludeId,
  placeholder = 'Search for a clade…',
}: {
  value: SelectedClade | null;
  onChange: (clade: SelectedClade | null) => void;
  excludeId?: number;
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 250);

  const { data, isLoading } = useSWR<CladeResult[]>(
    debouncedQuery ? ['/api/search', { query: debouncedQuery }] : null,
    postFetcher
  );
  const options = (data ?? []).filter((r) => r.id !== excludeId);

  return (
    <Stack gap={1}>
      <Input
        placeholder={placeholder}
        value={value ? value.name : query}
        onChange={(e) => {
          onChange(null);
          setQuery(e.target.value);
        }}
        onKeyDown={(e) => {
          // Don't submit a surrounding form while searching.
          if (e.key === 'Enter') e.preventDefault();
        }}
      />
      {!value && debouncedQuery && (
        <Stack gap={1} maxH="3xs" overflowY="auto">
          {isLoading && options.length === 0 && (
            <Text fontSize="sm" color="fg.muted">
              Searching…
            </Text>
          )}
          {!isLoading && options.length === 0 && (
            <Text fontSize="sm" color="fg.muted">
              No clades found.
            </Text>
          )}
          {options.map((option) => (
            <Button
              key={option.id}
              type="button"
              variant="ghost"
              size="sm"
              justifyContent="flex-start"
              onClick={() => {
                onChange({ id: option.id, name: option.name });
                setQuery('');
              }}
            >
              {option.extant === false ? '† ' : ''}
              {option.name}
              {option.rank ? ` · ${option.rank}` : ''}
            </Button>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
