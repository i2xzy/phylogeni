import { Container, Heading, Stack } from '@chakra-ui/react';
import { Metadata } from 'next';
import NextLink from 'next/link';
import { ReactNode } from 'react';

import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '~/components/ui/breadcrumb';

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
        minHeight="var(--content-height)"
        overflow="auto"
        p={8}
        gap={6}
      >
        <Stack gap={2}>
          <BreadcrumbRoot>
            <BreadcrumbLink asChild>
              <NextLink href={`/clade/${clade.id}`}>{clade.name}</NextLink>
            </BreadcrumbLink>
            <BreadcrumbCurrentLink>Edit</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
          <Heading size="lg">Editing {clade.name}</Heading>
        </Stack>

        <EditTabs />

        {children}
      </Stack>
    </Container>
  );
}
