'use client';

import {
  Button,
  ButtonGroup,
  Card,
  createListCollection,
  Fieldset,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { LuPlus } from 'react-icons/lu';

import { Database } from '~/types/supabase';
import { Field } from '~/components/ui/field';
import { Radio, RadioGroup } from '~/components/ui/radio';
import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from '~/components/ui/select';

type Clade = Database['public']['Tables']['taxa']['Row'];

const ranks = createListCollection({
  items: [
    { value: 'No rank', label: 'No rank' },
    { value: 'Species', label: 'Species' },
    { value: 'Genus', label: 'Genus' },
    { value: 'Family', label: 'Family' },
    { value: 'Order', label: 'Order' },
    { value: 'Class', label: 'Class' },
    { value: 'Phylum', label: 'Phylum' },
  ],
});

const sources = createListCollection({
  items: [
    { value: 'OTT', label: 'OTT' },
    { value: 'GBIF', label: 'GBIF' },
  ],
});

export default function CladeEditForm({ clade }: { clade: Clade }) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/clade/${clade.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack w="full" gap={8}>
        <Card.Root>
          <Card.Body>
            <Stack gap={4}>
              <Field label="Name">
                <Input placeholder="Name" defaultValue={clade?.name} />
              </Field>

              <Field label="Common name">
                <Input
                  placeholder="Common name"
                  defaultValue={(clade?.common_names ?? []).join(', ')}
                />
              </Field>

              <Field label="Rank">
                <SelectRoot collection={ranks} defaultValue={['No rank']}>
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
              </Field>

              <Field label="Status">
                <RadioGroup defaultValue={clade?.extant ? 'extant' : 'extinct'}>
                  <Stack gap={5} direction="row">
                    <Radio colorPalette="red" value="extinct">
                      Extinct
                    </Radio>
                    <Radio colorPalette="green" value="extant">
                      Extant
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Field>
            </Stack>
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Heading size="md">External Sources</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Fieldset.Root>
                <Stack>
                  <Fieldset.Legend>Other Phylogeny Databases</Fieldset.Legend>
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
                      <Input placeholder="e.g. ott12345" defaultValue="" />
                    </Field>
                    <Button alignSelf="end">
                      <LuPlus /> Add
                    </Button>
                  </HStack>
                </Fieldset.Content>
                <Fieldset.ErrorText>
                  Some fields are invalid. Please check them.
                </Fieldset.ErrorText>
              </Fieldset.Root>
              <Fieldset.Root>
                <Stack>
                  <Fieldset.Legend>Links</Fieldset.Legend>
                  <Fieldset.HelperText>
                    Add web links to other pages like Wikipedia or scientific
                    papers.
                  </Fieldset.HelperText>
                </Stack>
                <Fieldset.Content>
                  <HStack gap={2} align="end">
                    <Field label="URL">
                      <Input
                        placeholder={`e.g. https://en.wikipedia.org/wiki/${clade.name}`}
                        defaultValue=""
                      />
                    </Field>
                    <Button alignSelf="end">
                      <LuPlus /> Add
                    </Button>
                  </HStack>
                </Fieldset.Content>
              </Fieldset.Root>
            </Stack>
          </Card.Body>
        </Card.Root>

        <ButtonGroup alignSelf="flex-end">
          <Text color="fg.warning">
            Under construction: The ability to edit a clade is not yet
            available.
          </Text>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
}
