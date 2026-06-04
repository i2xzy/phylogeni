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
import { useMemo, useState, useTransition } from 'react';

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

import {
  ranksForCode,
  NO_RANK,
  type NomenclatureCode,
} from '~/lib/constants/ranks';

import CladeSearchSelect, { type SelectedClade } from '../clade-search-select';
import { createClade } from './actions';

export default function CreateCladeForm({
  initialParent,
  code,
}: {
  initialParent: SelectedClade | null;
  code: NomenclatureCode | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Rank options follow the parent's nomenclatural code (zoology/botany).
  const ranks = useMemo(
    () =>
      createListCollection({
        items: [{ value: NO_RANK, label: NO_RANK }, ...ranksForCode(code)],
      }),
    [code]
  );

  const [name, setName] = useState('');
  const [commonNames, setCommonNames] = useState('');
  const [rank, setRank] = useState(NO_RANK);
  const [extant, setExtant] = useState<boolean | null>(null);
  const [parent, setParent] = useState<SelectedClade | null>(initialParent);

  const parsedCommonNames = commonNames
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const canCreate = name.trim().length > 0 && parent !== null;

  const create = () => {
    if (!canCreate || !parent) return;
    startTransition(async () => {
      const result = await createClade({
        name,
        parentId: parent.id,
        rank,
        extant,
        common_names: parsedCommonNames,
      });
      if ('error' in result) {
        toaster.create({
          title: 'Could not create clade',
          description: result.error,
          type: 'error',
        });
        return;
      }
      toaster.create({ title: 'Clade created', type: 'success' });
      router.push(`/clade/${result.id}`);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create();
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

        <Card.Root>
          <Card.Header>
            <Heading size="md">Parent</Heading>
            <Card.Description>
              Choose the clade this new clade will sit under.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Field label="Parent clade">
              <CladeSearchSelect value={parent} onChange={setParent} />
            </Field>
          </Card.Body>
        </Card.Root>

        <ButtonGroup alignSelf="flex-end">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending} disabled={!canCreate}>
            Create clade
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
}
