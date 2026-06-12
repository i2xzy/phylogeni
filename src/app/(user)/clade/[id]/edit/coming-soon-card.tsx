import { ReactNode } from 'react';
import { Badge, Card, HStack, Heading } from '@chakra-ui/react';

// A section for capabilities that are visible but not yet editable.
export default function ComingSoonCard({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
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
}
