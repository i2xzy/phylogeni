'use client';

import { CloseButton } from '@chakra-ui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SidebarCloseButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  return (
    <CloseButton
      pos="absolute"
      top="2"
      right="2"
      onClick={() => {
        newSearchParams.delete('selected_node_id');
        router.push(`${pathname}?${newSearchParams.toString()}`);
      }}
    />
  );
};

export default SidebarCloseButton;
