import { Box, Container, Heading, Stack } from '@chakra-ui/react';
import { Metadata } from 'next';
import NextLink from 'next/link';
import { ReactNode } from 'react';

import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '~/components/ui/breadcrumb';
import { ScrollArea } from '~/components/ui/scroll-area';

import { getCladeName } from '../../get-clade-name';
import EditTabs from './edit-tabs';

export const metadata: Metadata = {
  title: 'Edit Clade info',
};

export default async function CladeEditLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const clade = await getCladeName(id);
  if (!clade) {
    return null;
  }

  return (
    <Container display="flex" gap="10" maxW="8xl">
      <Stack
        width="full"
        flex="1"
        // Header is 72px (matches the tree view); pin to the rest of the
        // viewport so only the tab content below scrolls.
        height="calc(100vh - 72px)"
        overflow="hidden"
        p={8}
        gap={6}
      >
        {/* Header and tabs stay put; only the tab content below scrolls. */}
        <Stack gap={2} flexShrink={0}>
          <BreadcrumbRoot>
            <BreadcrumbLink asChild>
              <NextLink href={`/clade/${clade.id}`}>{clade.name}</NextLink>
            </BreadcrumbLink>
            <BreadcrumbCurrentLink>Edit</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
          <Heading size="lg">Editing {clade.name}</Heading>
        </Stack>

        <Box flexShrink={0}>
          <EditTabs />
        </Box>

        <ScrollArea flex="1" minH={0} contentProps={{ pe: 5 }}>
          {children}
        </ScrollArea>
      </Stack>
    </Container>
  );
}
