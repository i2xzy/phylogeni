'use client';

import {
  Button,
  ButtonGroup,
  Card,
  createListCollection,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

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
import { RANKS, NO_RANK } from '~/lib/constants/ranks';

import { updateClade } from '../actions';

const ranks = createListCollection({
  items: [{ value: NO_RANK, label: NO_RANK }, ...RANKS],
});

export default function DetailsForm({ clade }: { clade: Clade }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(clade.name);
  const [commonNames, setCommonNames] = useState(
    (clade.common_names ?? []).join(', ')
  );
  const [rank, setRank] = useState(clade.rank ?? NO_RANK);
  const [extant, setExtant] = useState<boolean | null>(clade.extant);

  // Baseline of the last-saved values, used to detect unsaved changes.
  const [saved, setSaved] = useState({
    name: clade.name,
    rank: clade.rank ?? NO_RANK,
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

        <ButtonGroup alignSelf="flex-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/clade/${clade.id}`)}
          >
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
