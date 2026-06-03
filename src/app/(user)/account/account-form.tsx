'use client';

import {
  Box,
  Card,
  FileUploadTrigger,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { LuLogOut, LuUpload, LuTrash2 } from 'react-icons/lu';

import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Field } from '~/components/ui/field';
import { FileUploadRoot } from '~/components/ui/file-upload';
import { toaster } from '~/components/ui/toaster';
import { createClient } from '~/lib/utils/supabase/client';
import { formatDate } from '~/lib/utils/date';

// An avatar value can be a Supabase Storage path (uploaded) or an external
// URL (e.g. a Google account photo from OAuth sign-in).
const isUrl = (value: string) => /^https?:\/\//i.test(value);

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
  user_metadata,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  // Avatar photo from an OAuth provider (e.g. Google), if the user has one.
  const providerAvatarUrl: string | undefined =
    user_metadata?.avatar_url ?? user_metadata?.picture;
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState(full_name);

  const [avatarUrl, setAvatarUrl] = useState(avatar_url);
  const [originalAvatarUrl] = useState(avatar_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    // resolve the stored value (storage path or external url) to a preview
    if (avatar_url) {
      resolveAvatarUrl(avatar_url).then(setAvatarUrl);
    }
  }, [avatar_url]);

  const selectImage = (file: File) => {
    setSelectedFile(file);
    setSelectedUrl(null);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const useProviderAvatar = () => {
    if (!providerAvatarUrl) return;
    setSelectedFile(null);
    setSelectedUrl(providerAvatarUrl);
    setAvatarUrl(providerAvatarUrl);
  };

  const deleteAvatar = () => {
    setSelectedFile(null);
    setSelectedUrl(null);
    setAvatarUrl('');
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const newUpdatedAt = new Date().toISOString();

      let filePath = originalAvatarUrl ?? '';

      // Only uploaded avatars live in storage; external URLs (e.g. Google) don't.
      const oldUploadedPath =
        originalAvatarUrl && !isUrl(originalAvatarUrl)
          ? originalAvatarUrl
          : null;

      if (selectedFile) {
        // A new image was uploaded: store it and drop the old uploaded file.
        const fileExt = selectedFile.name.split('.').pop();
        filePath = `${id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile);
        if (uploadError) throw uploadError;

        if (oldUploadedPath) {
          await supabase.storage.from('avatars').remove([oldUploadedPath]);
        }
      } else if (selectedUrl) {
        // An external avatar (e.g. the Google photo) was chosen: store the URL.
        filePath = selectedUrl;
        if (oldUploadedPath) {
          await supabase.storage.from('avatars').remove([oldUploadedPath]);
        }
      } else if (!avatarUrl && originalAvatarUrl) {
        // The avatar was removed without choosing a new one.
        if (oldUploadedPath) {
          const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([oldUploadedPath]);
          if (removeError) throw removeError;
        }
        filePath = '';
      }

      const { error } = await supabase.from('profiles').upsert({
        id: id as string,
        full_name: fullname,
        updated_at: newUpdatedAt,
        avatar_url: filePath,
      });

      if (error) throw new Error(error.message);

      // Refetch the server component so the "Last updated" timestamp (and any
      // other server-derived data) reflects the save.
      router.refresh();

      toaster.create({
        title: 'Profile updated',
        type: 'success',
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
      width="full"
      maxW="2xl"
      margin="auto"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 10 }}
      gap={6}
    >
      <Heading size="2xl">Account</Heading>

      <Card.Root>
        <Card.Header>
          <Heading size="md">Profile photo</Heading>
        </Card.Header>
        <Card.Body>
          <Flex
            gap={6}
            align="center"
            direction={{ base: 'column', sm: 'row' }}
          >
            <Box position="relative" flexShrink={0}>
              <Avatar
                colorPalette="teal"
                boxSize="9rem"
                src={avatarUrl || undefined}
                name={full_name}
              />
              {avatarUrl && (
                <IconButton
                  aria-label="Remove photo"
                  onClick={deleteAvatar}
                  size="xs"
                  rounded="full"
                  colorPalette="red"
                  position="absolute"
                  bottom="1"
                  right="1"
                  shadow="md"
                >
                  <LuTrash2 />
                </IconButton>
              )}
            </Box>
            <HStack
              wrap="wrap"
              gap={3}
              justify={{ base: 'center', sm: 'flex-start' }}
            >
              <FileUploadRoot
                accept={'image/*'}
                onFileChange={(details) => {
                  const file = details.acceptedFiles[0];
                  if (file) selectImage(file);
                }}
              >
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuUpload /> Upload image
                  </Button>
                </FileUploadTrigger>
              </FileUploadRoot>

              {providerAvatarUrl && avatarUrl !== providerAvatarUrl && (
                <Button
                  onClick={useProviderAvatar}
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                >
                  <FcGoogle /> Use Google photo
                </Button>
              )}
            </HStack>
          </Flex>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Heading size="md">Account details</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={4}>
            <Field label="Email" helperText="Your email can't be changed.">
              <Input value={email ?? ''} disabled />
            </Field>
            <Field
              label="Full name"
              invalid={!fullname || !validateString(fullname)}
              errorText="Please use letters only."
            >
              <Input
                value={fullname || ''}
                onChange={(e) => setFullname(e.target.value)}
              />
            </Field>
          </Stack>
        </Card.Body>
        {updated_at && (
          <Card.Footer>
            <Text fontSize="sm" color="fg.muted">
              Last updated {formatDate(updated_at)}
            </Text>
          </Card.Footer>
        )}
      </Card.Root>

      <Flex justify="space-between" align="center" pt={2}>
        <form action="/api/auth/signout" method="post">
          <Button type="submit" variant="ghost" colorPalette="gray">
            <LuLogOut /> Sign out
          </Button>
        </form>
        <Button type="button" onClick={updateProfile} loading={loading}>
          Save changes
        </Button>
      </Flex>
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

// Turn a stored avatar value into something an <img> can display: external
// URLs (e.g. Google) pass through; storage paths are downloaded from the bucket.
export const resolveAvatarUrl = (value: string): Promise<string> =>
  isUrl(value) ? Promise.resolve(value) : downloadAvatar(value);
