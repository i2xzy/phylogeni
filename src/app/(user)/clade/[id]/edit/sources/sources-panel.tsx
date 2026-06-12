'use client';

import {
  Button,
  createListCollection,
  Fieldset,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';

import { Field } from '~/components/ui/field';
import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from '~/components/ui/select';

import ComingSoonCard from '../coming-soon-card';

const sources = createListCollection({
  items: [
    { value: 'OTT', label: 'OTT' },
    { value: 'GBIF', label: 'GBIF' },
  ],
});

export default function SourcesPanel({ cladeName }: { cladeName: string }) {
  return (
    <ComingSoonCard
      title="External sources & links"
      helper="Link this clade to other databases and reference pages."
    >
      <Stack gap={4}>
        <Fieldset.Root>
          <Stack>
            <Fieldset.Legend>Other phylogeny databases</Fieldset.Legend>
            <Fieldset.HelperText>
              Add other sources where this clade is found.
            </Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>
            <HStack gap={2} align="end">
              <Field label="Source">
                <SelectRoot collection={sources} defaultValue={['OTT']}>
                  <SelectTrigger>
                    <SelectValueText placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.items.map((item) => (
                      <SelectItem item={item} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field>
              <Field label="ID">
                <Input placeholder="e.g. ott12345" />
              </Field>
              <Button alignSelf="end">
                <LuPlus /> Add
              </Button>
            </HStack>
          </Fieldset.Content>
        </Fieldset.Root>
        <Fieldset.Root>
          <Stack>
            <Fieldset.Legend>Links</Fieldset.Legend>
            <Fieldset.HelperText>
              Add web links to other pages like Wikipedia or scientific papers.
            </Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>
            <HStack gap={2} align="end">
              <Field label="URL">
                <Input
                  placeholder={`e.g. https://en.wikipedia.org/wiki/${cladeName}`}
                />
              </Field>
              <Button alignSelf="end">
                <LuPlus /> Add
              </Button>
            </HStack>
          </Fieldset.Content>
        </Fieldset.Root>
      </Stack>
    </ComingSoonCard>
  );
}
