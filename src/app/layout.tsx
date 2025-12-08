import type { Metadata, Viewport } from 'next';

import { Provider as ChakraProvider } from '~/components/ui/provider';

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
    url: 'https://phylogeni.vercel.app/',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
};

export default RootLayout;
