import { Icon, IconButton, Link } from '@chakra-ui/react';
import {
  RiDiscordFill,
  RiFacebookCircleFill,
  RiGithubFill,
  RiInstagramLine,
  RiLinkedinBoxFill,
  RiTwitterFill,
  RiYoutubeFill,
} from 'react-icons/ri';

export enum Social {
  DISCORD = 'discord',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
}

export interface SocialIconProps {
  platform: Social;
  size?: number;
  href?: string;
}

const SocialIcon = ({
  platform,
  size = 6,
  href,
  ...props
}: SocialIconProps) => {
  const icons = {
    [Social.DISCORD]: RiDiscordFill,
    [Social.FACEBOOK]: RiFacebookCircleFill,
    [Social.GITHUB]: RiGithubFill,
    [Social.INSTAGRAM]: RiInstagramLine,
    [Social.LINKEDIN]: RiLinkedinBoxFill,
    [Social.TWITTER]: RiTwitterFill,
    [Social.YOUTUBE]: RiYoutubeFill,
  };

  const PlatformIcon = icons[platform];

  if (href)
    return (
      <Link aria-label={`${platform}-link`} href={href} target="_blank" asChild>
        <IconButton
          variant="ghost"
          color={{ base: 'teal.500', _dark: 'fg' }}
          as="a"
        >
          <Icon width={size} height={size} {...props}>
            <PlatformIcon />
          </Icon>
        </IconButton>
      </Link>
    );

  return (
    <Icon width={size} height={size} {...props}>
      <PlatformIcon />
    </Icon>
  );
};

export default SocialIcon;
