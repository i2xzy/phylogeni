import { Flex, Link, Text } from '@chakra-ui/react';

import SocialIcon, { Social } from '~/lib/components/SocialIcon';

const ICONS = [
  {
    platform: Social.DISCORD,
    href: 'https://discord.gg/QmbuWsgR',
  },
  {
    platform: Social.LINKEDIN,
    href: 'https://www.linkedin.com/company/phylogeny-explorer-project/',
  },
  {
    platform: Social.YOUTUBE,
    href: 'https://www.youtube.com/playlist?list=PLXJ4dsU0oGMLnubJLPuw0dzD0AvAHAotW',
  },
];

const Footer = () => {
  return (
    <Flex
      as="footer"
      direction={['column', 'row']}
      width="full"
      maxW={1200}
      margin="0 auto"
      p={[8, 16]}
      boxSizing="border-box"
      align={['start', 'center']}
      justify="space-between"
      gap={[2, 4]}
    >
      <Flex gap={[0, 2]}>
        {ICONS.map((icon) => (
          <SocialIcon
            key={icon.platform}
            platform={icon.platform}
            href={icon.href}
          />
        ))}
      </Flex>
      <Text fontSize={['xs', 'sm']}>
        &#169; {new Date().getFullYear()} -{' '}
        <Link
          href="https://phylogenyexplorerproject.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Phylogeny Explorer Project
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
