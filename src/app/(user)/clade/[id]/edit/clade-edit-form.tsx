'use client';

import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  createListCollection,
  Fieldset,
  HStack,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, useTransition } from 'react';
import { LuPlus } from 'react-icons/lu';

import { Clade } from '~/types/database';
import { Field } from '~/components/ui/field';
import { toaster } from '~/components/ui/toaster';
import { Radio, RadioGroup } from '~/components/ui/radio';
import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from '~/components/ui/select';

import { updateClade } from './actions';

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

// A section for capabilities that are visible but not yet editable.
const ComingSoonCard = ({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: ReactNode;
}) => (
  <Card.Root opacity={0.6}>
    <Card.Header>
      <HStack justify="space-between" align="center">
        <Heading size="md">{title}</Heading>
        <Badge variant="surface">Coming soon</Badge>
      </HStack>
      {helper && <Card.Description>{helper}</Card.Description>}
    </Card.Header>
    <Card.Body pointerEvents="none">{children}</Card.Body>
  </Card.Root>
);

export default function CladeEditForm({ clade }: { clade: Clade }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(clade.name);
  const [commonNames, setCommonNames] = useState(
    (clade.common_names ?? []).join(', ')
  );
  const [rank, setRank] = useState(clade.rank ?? 'No rank');
  const [extant, setExtant] = useState<boolean | null>(clade.extant);

  // Baseline of the last-saved values, used to detect unsaved changes.
  const [saved, setSaved] = useState({
    name: clade.name,
    rank: clade.rank ?? 'No rank',
    extant: clade.extant,
    common_names: clade.common_names ?? [],
  });

  const parsedCommonNames = commonNames
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const isDirty =
    name.trim() !== saved.name ||
    rank !== saved.rank ||
    extant !== saved.extant ||
    JSON.stringify(parsedCommonNames) !== JSON.stringify(saved.common_names);

  const save = (exit: boolean) => {
    if (!isDirty) {
      // Nothing to save — "Save and exit" still takes you back.
      if (exit) router.push(`/clade/${clade.id}`);
      return;
    }
    startTransition(async () => {
      const result = await updateClade({
        id: clade.id,
        name,
        rank,
        extant,
        common_names: parsedCommonNames,
      });
      if (result?.error) {
        toaster.create({
          title: 'Could not save changes',
          description: result.error,
          type: 'error',
        });
        return;
      }
      toaster.create({ title: 'Changes saved', type: 'success' });
      if (exit) {
        router.push(`/clade/${clade.id}`);
        return;
      }
      // Reset the baseline so the form reflects the saved state.
      setName(name.trim());
      setCommonNames(parsedCommonNames.join(', '));
      setSaved({
        name: name.trim(),
        rank,
        extant,
        common_names: parsedCommonNames,
      });
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    save(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack w="full" gap={8}>
        <Card.Root>
          <Card.Header>
            <Heading size="md">Details</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Field label="Name">
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field label="Common names" helperText="Separate with commas.">
                <Input
                  placeholder="e.g. cats, felids"
                  value={commonNames}
                  onChange={(e) => setCommonNames(e.target.value)}
                />
              </Field>

              <Field label="Rank">
                <SelectRoot
                  collection={ranks}
                  value={[rank]}
                  onValueChange={(e) => setRank(e.value[0])}
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
              </Field>

              <Field label="Status">
                <RadioGroup
                  value={extant === null ? null : extant ? 'extant' : 'extinct'}
                  onValueChange={(e) => setExtant(e.value === 'extant')}
                >
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

        <ComingSoonCard
          title="Parent"
          helper="Moving this clade to a different parent is coming soon."
        >
          <Field label="Parent clade">
            <Input placeholder="Search for a new parent…" />
          </Field>
        </ComingSoonCard>

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
                  Add web links to other pages like Wikipedia or scientific
                  papers.
                </Fieldset.HelperText>
              </Stack>
              <Fieldset.Content>
                <HStack gap={2} align="end">
                  <Field label="URL">
                    <Input
                      placeholder={`e.g. https://en.wikipedia.org/wiki/${clade.name}`}
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

        <ButtonGroup alignSelf="flex-end">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="outline" loading={isPending}>
            Save
          </Button>
          <Button type="button" loading={isPending} onClick={() => save(true)}>
            Save and exit
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
}
