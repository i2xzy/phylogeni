'use client';

import { ChakraProvider } from '@chakra-ui/react';

import { system } from '~/lib/styles/theme';

import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
      <Toaster />
    </ChakraProvider>
  );
}
