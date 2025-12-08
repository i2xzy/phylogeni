'use client';

import {
  Box,
  FileUploadTrigger,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { toaster, Toaster } from '~/components/ui/toaster';
import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Field } from '~/components/ui/field';
import { createClient } from '~/lib/utils/supabase/client';
import { LuLogOut, LuUpload, LuTrash2 } from 'react-icons/lu';
import { FileUploadRoot } from '~/components/ui/file-upload';

interface Props extends User {
  id: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

export default function AccountForm({
  id,
  email,
  full_name,
  avatar_url,
  updated_at,
}: Props) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState(full_name);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(updated_at);

  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(avatar_url);
  const [originalAvatarUrl] = useState(avatar_url);

  useEffect(() => {
    // convert the path to url
    if (avatar_url) {
      downloadAvatar(avatar_url).then((url) => setAvatarUrl(url));
    }
  }, [avatar_url, supabase]);

  const deleteAvatar = () => {
    //if image has been changed within the current session
    if (avatarRef.current?.files?.length) {
      avatarRef.current.value = '';
    }
    setAvatarUrl('');
  };

  const updateImage = () => {
    if (avatarRef.current?.files?.length) {
      setAvatarUrl(URL.createObjectURL(avatarRef.current?.files[0]));
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const newUpdatedAt = new Date().toISOString();
      setLastUpdatedAt(newUpdatedAt);

      let filePath;

      if (avatarRef.current?.files && avatarRef.current?.files?.length !== 0) {
        const file = avatarRef?.current?.files[0];
        const fileExt = file.name.split('.').pop();
        filePath = `${id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }
      } else {
        if (originalAvatarUrl) {
          const { data, error } = await supabase.storage
            .from('avatars')
            .remove([originalAvatarUrl]);

          filePath = '';
          console.log(data);

          if (error) throw error;
        }
      }

      const { error } = await supabase.from('profiles').upsert({
        id: id as string,
        full_name: fullname,
        updated_at: newUpdatedAt,
        avatar_url: filePath,
      });

      if (error) throw new Error(error.message);

      //Updates the state without needing to refresh
      setLastUpdatedAt(newUpdatedAt);
      setFullname(fullname);

      toaster.create({
        title: 'Profile updated',
        description: `Last updated ${updated_at}`,
        //type: "success",
      });
    } catch (error) {
      console.log(error);
      toaster.create({
        title: 'Something went wrong',
        description: 'Profile was not updated',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateString = (val: string) => {
    //checks if string contains numbers or special chars
    const matches = val.match(/\d|[$&\\+,:;=?@#|'<>.^*()%!-]/g);
    if (matches !== null) return false;
    return true;
  };

  return (
    <Stack
      as="main"
      width={{ xl: '50%', mdDown: '90%' }}
      margin={'auto'}
      padding={{ base: '20px', md: '40px' }}
      marginTop={{ xl: '6rem', md: 0 }}
    >
      <Heading
        fontSize={'2rem'}
        justifyContent={'center'}
        alignContent={'center'}
        width={'full'}
        textAlign={'center'}
      >
        Account Details
      </Heading>

      <Box
        display={'flex'}
        flexDir={{ xlTo2xl: 'row', mdDown: 'column' }}
        marginTop={'3rem'}
        gap={'3rem'}
        justifyContent={'space-between'}
      >
        <Box
          width={'100%'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
        >
          <Field label="Email">
            <Input id="email" type="text" value={email} disabled />
          </Field>
          <Field
            invalid={!fullname || !validateString(fullname)}
            label="Full name"
            errorText="Invalid"
            style={{ marginTop: '2rem' }}
          >
            <Input
              id="fullName"
              type="text"
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
            />
          </Field>

          <Text
            color={'grey'}
            marginTop={'2rem'}
            paddingBottom={'.4rem'}
            fontWeight={'light'}
            fontSize={'.9rem'}
          >
            Last updated{' '}
            {lastUpdatedAt && new Date(lastUpdatedAt).toDateString()}
          </Text>
        </Box>

        <Box
          width={'100%'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
        >
          <Box display={'flex'} justifyContent={'center'}>
            {avatar_url ? (
              <Avatar
                size="xl"
                src={avatarUrl}
                name={full_name}
                width={'9rem'}
                height={'9rem'}
              />
            ) : (
              <Avatar
                background={'var(--chakra-colors-teal-800)'}
                color={'var(--chakra-colors-teal-400)'}
                width={'9rem'}
                height={'9rem'}
                name={full_name}
              />
            )}
          </Box>
          <Box
            display={'flex'}
            gap={'15px'}
            alignItems={'center'}
            alignContent={'center'}
            marginTop={'2rem'}
            justifyContent={'center'}
          >
            <Button
              onClick={deleteAvatar}
              variant="outline"
              colorPalette="red"
              size="sm"
              disabled={!avatar_url}
            >
              <LuTrash2 />
              Remove avatar
            </Button>

            <FileUploadRoot
              accept={'image/*'}
              ref={avatarRef}
              onChange={updateImage}
            >
              <FileUploadTrigger asChild>
                <Button id="AvatarFileUpload" variant="outline" size="sm">
                  <LuUpload /> Upload image
                </Button>
              </FileUploadTrigger>
            </FileUploadRoot>
          </Box>
        </Box>
      </Box>

      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignContent={'center'}
        marginTop={'6rem'}
      >
        <Box>
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" colorPalette="gray" type="submit">
              <LuLogOut /> Sign out
            </Button>
          </form>
        </Box>

        <Box>
          <Button type="submit" onClick={updateProfile} disabled={loading}>
            {loading ? 'Loading ...' : 'Update'}
          </Button>
        </Box>
      </Box>
      <Toaster />
    </Stack>
  );
}

export const downloadAvatar = (path: string) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) throw new Error(error.message);

      if (data) {
        const url = URL.createObjectURL(data);
        resolve(url);
      }
      if (error) throw new Error('Failed to create object url');
    } catch (error) {
      console.log('Error downloading image: ', error);
      reject(error);
    }
  });
};
