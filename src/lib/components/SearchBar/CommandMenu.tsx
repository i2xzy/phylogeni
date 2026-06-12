'use client';

import { ReactNode, useEffect, useState } from 'react';
import useSWR from 'swr';
import { Combobox, createListCollection } from '@ark-ui/react';
import { useRouter } from 'next/navigation';
import { Center, DialogTrigger, Input, Text, chakra } from '@chakra-ui/react';

import { postFetcher } from '~/lib/utils/swr/fetchers';
import { rankLabel } from '~/lib/constants/ranks';
import { DialogContent, DialogRoot } from 'components/ui/dialog';
import { ComboboxItem } from './ComboboxItem';

const ComboboxRoot = chakra(Combobox.Root, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1',
  },
});
const ComboboxControl = chakra(Combobox.Control);
const ComboboxInput = chakra(Combobox.Input, {}, { forwardAsChild: true });
const ComboboxContent = chakra(Combobox.Content, {
  base: { borderRadius: 'md' },
});
const ComboboxList = chakra(Combobox.List, { base: { h: '100%' } });
const ComboboxItemGroup = chakra(Combobox.ItemGroup);
const ComboboxItemGroupLabel = chakra(Combobox.ItemGroupLabel, {
  base: {
    p: '2',
    color: 'fg.subtle',
  },
});

interface Item {
  label: string;
  value: string;
  category?: string | null;
}

const initialItems: Item[] = [
  {
    value: '20716',
    label: 'Homininae',
    category: 'Great apes and humans',
  },
  {
    value: '2672',
    label: 'Archosauria',
    category: 'Dinosaurs, birds and crocodiles',
  },
  {
    value: '134',
    label: 'Felidae',
    category: 'Cats',
  },
  {
    value: '990',
    label: 'Canidae',
    category: 'Dogs',
  },
  {
    value: '994',
    label: 'Ursidae',
    category: 'Bears',
  },
];

interface Props {
  trigger: ReactNode;
  disableHotkey?: boolean;
}

type SearchResult = {
  id: number;
  name: string;
  extant: boolean | null;
  rank: string | null;
};

export const CommandMenu = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR<SearchResult[]>(
    inputValue ? ['/api/search', { query: inputValue }] : null,
    postFetcher
  );

  const results =
    data?.map((item) => ({
      value: item.id.toString(),
      label: `${item.extant === false ? '†' : ''}${item.name}`,
      category: item.rank ? rankLabel(item.rank) : null,
    })) || [];

  const collection = createListCollection({ items: results });

  useHotkey(setOpen, { disable: props.disableHotkey });

  return (
    <DialogRoot
      placement="center"
      motionPreset="slide-in-bottom"
      open={open}
      onOpenChange={(event) => {
        setOpen(event.open);
        if (!event.open) mutate(undefined, false);
      }}
    >
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent p="2" width={{ base: '100%', sm: 'lg' }}>
        <ComboboxRoot
          open
          disableLayer
          inputBehavior="autohighlight"
          placeholder="Search the tree"
          selectionBehavior="clear"
          loopFocus={false}
          collection={collection}
          onValueChange={(e) => {
            setOpen(false);
            router.push(`tree?node_id=${e.value}`);
            mutate(undefined, false);
          }}
          onInputValueChange={({ inputValue }) => setInputValue(inputValue)}
        >
          <ComboboxControl>
            <ComboboxInput asChild>
              <Input />
            </ComboboxInput>
          </ComboboxControl>
          <ComboboxContent
            boxShadow="none"
            px="0"
            py="0"
            overflow="auto"
            h="50vh"
            overscrollBehavior="contain"
          >
            <ComboboxList>
              {isLoading && results.length === 0 && (
                <Center p="3" h="100%">
                  <Text color="fg.muted" textStyle="sm">
                    Loading...
                  </Text>
                </Center>
              )}
              {!isLoading && inputValue && results.length === 0 && (
                <Center p="3" h="100%">
                  <Text color="fg.muted" textStyle="sm">
                    No results found for <Text as="strong">{inputValue}</Text>
                  </Text>
                </Center>
              )}
              {!inputValue && results.length === 0 && (
                <ComboboxItemGroup>
                  <ComboboxItemGroupLabel>Suggestions</ComboboxItemGroupLabel>
                  {initialItems.map((item) => (
                    <ComboboxItem key={item.value} item={item} />
                  ))}
                </ComboboxItemGroup>
              )}
              {results.map((item) => (
                <ComboboxItem key={item.value} item={item} />
              ))}
            </ComboboxList>
          </ComboboxContent>
        </ComboboxRoot>
      </DialogContent>
    </DialogRoot>
  );
};

const useHotkey = (
  setOpen: (open: boolean) => void,
  options: { disable?: boolean }
) => {
  const { disable } = options;

  useEffect(() => {
    if (disable) return;

    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform);
    const hotkey = isMac ? 'metaKey' : 'ctrlKey';

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key?.toLowerCase() === 'k' && event[hotkey]) {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeydown, true);

    return () => {
      document.removeEventListener('keydown', handleKeydown, true);
    };
  }, [setOpen, disable]);
};
