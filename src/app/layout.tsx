import type { Metadata, Viewport } from 'next';

import ChakraProvider from '~/components/ui/provider';

type RootLayoutProps = {
  children: React.ReactNode;
};

const APP_NAME = 'Phylogeny Explorer';
const APP_DESCRIPTION =
  'The Phylogeny Explorer is a web application for visualizing and exploring phylogenetic trees.';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  openGraph: {
    url: 'https://nextarter-chakra.sznm.dev',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: {
      url: 'https://og-image.sznm.dev/**nextarter-chakra**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250',
      alt: 'nextarter-chakra.sznm.dev og-image',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
};

export default RootLayout;
