'use client';

import { Button, Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface Props {
  text: string;
  href: string;
  children: JSX.Element;
}

const SidebarButton = ({ text, href, children }: Props) => {
  const router = useRouter();

  return (
    <Button
      variant="plain"
      flexDir="column"
      fontSize="small"
      h="unset"
      px={2}
      color="fg"
      onClick={() => router.push(href)}
    >
      <Center
        bg="teal"
        color="white"
        p={0}
        h={12}
        w={12}
        borderRadius="50%"
        transition="transform"
        _hover={{
          transform: 'scale(1.1)',
        }}
      >
        {children}
      </Center>
      {text}
    </Button>
  );
};

export default SidebarButton;
