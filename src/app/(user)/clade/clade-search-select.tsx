'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';

import { postFetcher } from '~/lib/utils/swr/fetchers';
import { rankLabel } from '~/lib/constants/ranks';

type CladeResult = {
  id: number;
  name: string;
  extant: boolean | null;
  rank: string | null;
};

export type SelectedClade = { id: number; name: string };

// A debounced typeahead for picking a clade by name (backed by /api/search).
// Used for choosing a new parent when moving or creating a clade. Results show
// in a floating dropdown so they don't reflow the surrounding form.
export default function CladeSearchSelect({
  value,
  onChange,
  excludeIds,
  suggestions = [],
  placeholder = 'Search for a clade…',
}: {
  value: SelectedClade | null;
  onChange: (clade: SelectedClade | null) => void;
  // Clades that can't be picked (e.g. self, current parent, direct children).
  excludeIds?: number[];
  // Sensible defaults shown when the field is empty (e.g. ancestors to move up).
  suggestions?: SelectedClade[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 250);
  const [focused, setFocused] = useState(false);

  const { data, isLoading } = useSWR<CladeResult[]>(
    debouncedQuery ? ['/api/search', { query: debouncedQuery }] : null,
    postFetcher
  );

  const exclude = new Set(excludeIds ?? []);
  const options = (data ?? []).filter((r) => !exclude.has(r.id));

  const showSearch = debouncedQuery.length > 0;
  const showSuggestions = !showSearch && suggestions.length > 0;
  const open = focused && !value && (showSearch || showSuggestions);

  const pick = (clade: SelectedClade) => {
    onChange(clade);
    setQuery('');
  };

  return (
    <Box position="relative" width="full">
      <Input
        placeholder={placeholder}
        value={value ? value.name : query}
        onChange={(e) => {
          onChange(null);
          setQuery(e.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          // Don't submit a surrounding form while searching.
          if (e.key === 'Enter') e.preventDefault();
        }}
      />

      {open && (
        <Stack
          position="absolute"
          insetInline={0}
          top="100%"
          mt={1}
          zIndex="dropdown"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          rounded="md"
          shadow="md"
          gap={0}
          maxH="3xs"
          overflowY="auto"
          p={1}
        >
          {showSearch ? (
            <>
              {isLoading && options.length === 0 && (
                <Text fontSize="sm" color="fg.muted" p={2}>
                  Searching…
                </Text>
              )}
              {!isLoading && options.length === 0 && (
                <Text fontSize="sm" color="fg.muted" p={2}>
                  No clades found.
                </Text>
              )}
              {options.map((option) => (
                <CladeOption
                  key={option.id}
                  label={`${option.extant === false ? '† ' : ''}${option.name}${
                    option.rank ? ` · ${rankLabel(option.rank)}` : ''
                  }`}
                  onPick={() => pick({ id: option.id, name: option.name })}
                />
              ))}
            </>
          ) : (
            <>
              <Text fontSize="xs" color="fg.subtle" px={2} py={1}>
                Suggestions
              </Text>
              {suggestions.map((option) => (
                <CladeOption
                  key={option.id}
                  label={option.name}
                  onPick={() => pick(option)}
                />
              ))}
            </>
          )}
        </Stack>
      )}
    </Box>
  );
}

const CladeOption = ({
  label,
  onPick,
}: {
  label: string;
  onPick: () => void;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    justifyContent="flex-start"
    // Keep focus on the input so onBlur doesn't close the list before onClick.
    onMouseDown={(e) => e.preventDefault()}
    onClick={onPick}
  >
    {label}
  </Button>
);
