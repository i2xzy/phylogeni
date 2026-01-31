import { Grid } from '@chakra-ui/react';
import Link from 'next/link';
import { RiLoginBoxLine } from 'react-icons/ri';

import { Button } from '~/components/ui/button';
import { ColorModeButton } from '~/components/ui/color-mode';
import Logo from '~/lib/components/Logo';

const Header = ({ isAuthPage }: { isAuthPage?: boolean }) => {
  return (
    <Grid
      as="header"
      width="full"
      padding={[4, 8]}
      position="sticky"
      top={0}
      zIndex={200}
    >
      <Grid
        templateColumns="auto 1fr"
        gap={4}
        background={{
          base: 'whiteAlpha.900',
          _dark: 'teal.950/90',
        }}
        borderRadius={16}
        alignItems="center"
        p={4}
        paddingX={[4, 8]}
        width="full"
        maxW={1200}
        margin="0 auto"
      >
        <Link href="/">
          <Logo full />
        </Link>
        <Grid marginLeft="auto" gap={4} autoFlow="column">
          {!isAuthPage && (
            <Link href="/auth/sign-in">
              <Button variant="outline">
                <RiLoginBoxLine /> Sign In
              </Button>
            </Link>
          )}
          <ColorModeButton />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
