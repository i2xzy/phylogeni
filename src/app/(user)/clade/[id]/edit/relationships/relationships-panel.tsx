'use client';

import { Button, Card, Heading, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

import { Clade, ChildNode } from '~/types/database';
import { Field } from '~/components/ui/field';
import { TextLink } from '~/components/ui/text-link';
import { toaster } from '~/components/ui/toaster';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '~/components/ui/dialog';
import { rankLabel } from '~/lib/constants/ranks';
import { formatNameList } from '~/lib/utils/list';

import CladeSearchSelect, {
  type SelectedClade,
} from '../../../clade-search-select';
import { moveClade, deleteClade } from '../actions';

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  // Deleting promotes children one level up, so a root with children would
  // orphan them — block it here too (the server enforces this as well).
  const childCount = childClades.length;
  const isRootWithChildren = clade.parent_id == null && childCount > 0;
  const destination =
    parentName ?? (clade.parent_id != null ? `clade ${clade.parent_id}` : null);
  // Name the children explicitly so the editor sees exactly what moves.
  const childList = formatNameList(childClades.map((c) => c.name));
  const deleteConsequence =
    childCount === 0
      ? `This permanently deletes ${clade.name} and can't be undone.`
      : childCount === 1
        ? `Its child ${childList} will be moved under ${destination}, then ${clade.name} is permanently deleted. This can't be undone.`
        : `Its ${childCount} children (${childList}) will be moved under ${destination}, then ${clade.name} is permanently deleted. This can't be undone.`;

  const remove = () => {
    startDeleteTransition(async () => {
      const result = await deleteClade({ id: clade.id });
      if (result?.error) {
        toaster.create({
          title: 'Could not delete clade',
          description: result.error,
          type: 'error',
        });
        return;
      }
      toaster.create({ title: 'Clade deleted', type: 'success' });
      setConfirmOpen(false);
      router.push(
        clade.parent_id != null ? `/clade/${clade.parent_id}` : '/tree'
      );
    });
  };

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
          <Stack gap={4}>
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
                    {child.rank ? ` · ${rankLabel(child.rank)}` : ''}
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

      {/* A root with children can't be deleted (its children would be
          orphaned), so hide the section entirely rather than disabling it. */}
      {!isRootWithChildren && (
        <Card.Root borderColor="border.error">
          <Card.Header>
            <Heading size="md" color="fg.error">
              Delete this clade
            </Heading>
            <Card.Description>
              {childCount > 0
                ? `Removes ${clade.name} from the tree. Its children move up to ${destination}.`
                : `Removes ${clade.name} from the tree.`}
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Button
              type="button"
              alignSelf="flex-start"
              colorPalette="red"
              variant="outline"
              onClick={() => setConfirmOpen(true)}
            >
              <LuTrash2 /> Delete clade
            </Button>
          </Card.Body>
        </Card.Root>
      )}

      <DialogRoot
        role="alertdialog"
        open={confirmOpen}
        onOpenChange={(e) => setConfirmOpen(e.open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {clade.name}?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text>{deleteConsequence}</Text>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button colorPalette="red" loading={isDeleting} onClick={remove}>
              Delete clade
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Stack>
  );
}
