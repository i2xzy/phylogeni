'use client';

import { Tabs } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const TABS = [
  { value: 'details', label: 'Details' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'images', label: 'Images' },
  { value: 'sources', label: 'Sources & links' },
];

// Route-driven tab bar: each tab is a real page under /clade/[id]/edit. The
// active tab is derived from the pathname rather than internal Tabs state.
export default function EditTabs() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const base = `/clade/${params.id}/edit`;
  const active =
    TABS.find((t) => pathname === `${base}/${t.value}`)?.value ?? 'details';

  return (
    <Tabs.Root value={active} variant="line" w="full">
      <Tabs.List>
        {TABS.map((t) => (
          <Tabs.Trigger key={t.value} value={t.value} asChild>
            <NextLink href={`${base}/${t.value}`}>{t.label}</NextLink>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
