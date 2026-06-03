'use client';

import { IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { LuLogOut } from 'react-icons/lu';

import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  MenuContent,
  MenuItemGroup,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from '~/components/ui/menu';
import { downloadAvatar } from './account/account-form';
import { useEffect, useState } from 'react';

export interface UserMenuProps {
  email: string;
  full_name?: string;
  avatar_url?: string;
}

const UserMenu = ({ email, full_name, avatar_url }: UserMenuProps) => {
  const [avatarUrl, setAvatarUrl] = useState(avatar_url);

  useEffect(() => {
    // convert the path to url
    if (avatar_url) {
      downloadAvatar(avatar_url).then((url) => setAvatarUrl(url));
    }
  }, [avatar_url]);

  return (
    <MenuRoot loopFocus>
      <MenuTrigger asChild>
        <IconButton aria-label="user menu" variant="ghost">
          <Avatar size="sm" src={avatarUrl || undefined} name={full_name} />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <MenuItemGroup title={full_name || email}>
          <MenuItem asChild value="account">
            <Link href="/account">Account</Link>
          </MenuItem>
          <MenuItem asChild value="settings">
            <Link href="/settings">Settings</Link>
          </MenuItem>
        </MenuItemGroup>
        <MenuSeparator />
        <MenuItem asChild value="signout">
          <form action="/api/auth/signout" method="post">
            <Button
              type="submit"
              variant="plain"
              size="sm"
              padding="0"
              _focusVisible={{ outline: 'none' }}
            >
              <LuLogOut /> Sign out
            </Button>
          </form>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};

export default UserMenu;
