import { Flex } from '@chakra-ui/react';

import Header from '~/lib/layouts/PublicLayout/Header';
import Footer from '~/lib/layouts/PublicLayout/Footer';

const AuthLayout = ({ children }: LayoutProps<'/auth'>) => (
  <Flex
    direction="column"
    h="min(100dvh, 100vh)"
    bg={{
      base: 'gray.50',
      _dark: 'teal.950/50',
    }}
  >
    <Header isAuthPage />
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      h="100%"
      gap={4}
      mb={8}
      w="full"
    >
      {children}
    </Flex>
    <Footer />
  </Flex>
);

export default AuthLayout;
