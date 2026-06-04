'use client';

import { Button, Card, Heading, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { LuPlus } from 'react-icons/lu';

import { Clade, ChildNode } from '~/types/database';
import { Field } from '~/components/ui/field';
import { TextLink } from '~/components/ui/text-link';
import { toaster } from '~/components/ui/toaster';

import CladeSearchSelect, {
  type SelectedClade,
} from '../../../clade-search-select';
import { moveClade } from '../actions';

export default function RelationshipsPanel({
  clade,
  parentName,
  excludeIds,
  suggestions,
  childClades,
}: {
  clade: Clade;
  parentName: string | null;
  excludeIds: number[];
  suggestions: SelectedClade[];
  childClades: ChildNode[];
}) {
  const router = useRouter();
  const [isMoving, startMoveTransition] = useTransition();
  const [selectedParent, setSelectedParent] = useState<SelectedClade | null>(
    null
  );

  const move = () => {
    if (!selectedParent || selectedParent.id === clade.parent_id) return;
    startMoveTransition(async () => {
      const result = await moveClade({
        id: clade.id,
        newParentId: selectedParent.id,
      });
      if (result?.error) {
        toaster.create({
          title: 'Could not move clade',
          description: result.error,
          type: 'error',
        });
        return;
      }
      toaster.create({ title: 'Clade moved', type: 'success' });
      setSelectedParent(null);
      router.refresh();
    });
  };

  return (
    <Stack w="full" gap={8}>
      <Card.Root>
        <Card.Header>
          <Heading size="md">Parent</Heading>
          <Card.Description>
            {clade.parent_id == null
              ? 'This is a root clade with no parent.'
              : `Currently a child of ${parentName ?? `clade ${clade.parent_id}`}.`}
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap={6}>
            <Field
              label="Move to a new parent"
              helperText="Search for the clade that should become the parent. The move applies immediately."
            >
              <CladeSearchSelect
                value={selectedParent}
                onChange={setSelectedParent}
                excludeIds={excludeIds}
                suggestions={suggestions}
              />
            </Field>

            <Button
              type="button"
              alignSelf="flex-start"
              loading={isMoving}
              disabled={
                !selectedParent || selectedParent.id === clade.parent_id
              }
              onClick={move}
            >
              Move clade
            </Button>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Heading size="md">Children</Heading>
          <Card.Description>
            Clades that sit directly under {clade.name}.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap={4} align="flex-start">
            {childClades.length > 0 ? (
              <Stack gap={1} w="full">
                {childClades.map((child) => (
                  <TextLink key={child.id} href={`/clade/${child.id}`}>
                    {child.extant === false ? '† ' : ''}
                    {child.name}
                    {child.rank ? ` · ${child.rank}` : ''}
                  </TextLink>
                ))}
              </Stack>
            ) : (
              <Text color="fg.muted" fontSize="sm">
                No children yet.
              </Text>
            )}

            <Button
              type="button"
              size="sm"
              onClick={() => router.push(`/clade/add?parent=${clade.id}`)}
            >
              <LuPlus /> Add child
            </Button>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
