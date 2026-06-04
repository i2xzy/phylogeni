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
import { useEffect, useRef, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { LuLogOut, LuUpload, LuTrash2 } from 'react-icons/lu';

import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Field } from '~/components/ui/field';
import { FileUploadRoot } from '~/components/ui/file-upload';
import { toaster } from '~/components/ui/toaster';
import { createClient } from '~/lib/utils/supabase/client';
import { formatDate } from '~/lib/utils/date';
import {
  storagePathFromAvatarUrl,
  MAX_AVATAR_BYTES,
  ALLOWED_AVATAR_TYPES,
} from '~/lib/utils/avatar';
import { isValidFullName } from '~/lib/utils/name';
import { saveProfile } from './actions';

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

  // Avatar photo from an OAuth provider (e.g. Google), if the user has one.
  const providerAvatarUrl: string | undefined =
    user_metadata?.avatar_url ?? user_metadata?.picture;
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState(full_name);

  const [avatarUrl, setAvatarUrl] = useState(avatar_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // Holds the object URL for a locally-picked file so we can revoke it; the
  // browser won't free the blob on its own.
  const objectUrlRef = useRef<string | null>(null);
  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  useEffect(() => {
    // Keep the preview in sync with the stored URL after a save/refresh.
    setAvatarUrl(avatar_url);
  }, [avatar_url]);

  // Revoke any outstanding object URL when the form unmounts.
  useEffect(() => revokeObjectUrl, []);

  const selectImage = (file: File) => {
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toaster.create({
        title: 'Unsupported image type',
        description: 'Use a PNG, JPEG, WebP, or GIF.',
        type: 'error',
      });
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toaster.create({
        title: 'Image too large',
        description: 'Please choose an image under 2 MB.',
        type: 'error',
      });
      return;
    }
    revokeObjectUrl();
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setSelectedFile(file);
    setSelectedUrl(null);
    setAvatarUrl(previewUrl);
  };

  const useProviderAvatar = () => {
    if (!providerAvatarUrl) return;
    revokeObjectUrl();
    setSelectedFile(null);
    setSelectedUrl(providerAvatarUrl);
    setAvatarUrl(providerAvatarUrl);
  };

  const deleteAvatar = () => {
    revokeObjectUrl();
    setSelectedFile(null);
    setSelectedUrl(null);
    setAvatarUrl('');
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      let newAvatarUrl = avatar_url ?? '';

      // The previous uploaded file (if any), deleted only AFTER the profile
      // write succeeds. External URLs (e.g. Google) have no storage path.
      const oldUploadedPath = avatar_url
        ? storagePathFromAvatarUrl(avatar_url)
        : null;
      // A file uploaded during this save, tracked so we can roll it back if the
      // profile write fails.
      let uploadedPath: string | null = null;

      if (selectedFile) {
        const ext = selectedFile.name.split('.').pop();
        uploadedPath = `${id}-${crypto.randomUUID()}${ext ? `.${ext}` : ''}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(uploadedPath, selectedFile, {
            contentType: selectedFile.type || undefined,
          });
        if (uploadError) throw uploadError;

        newAvatarUrl = supabase.storage
          .from('avatars')
          .getPublicUrl(uploadedPath).data.publicUrl;
      } else if (selectedUrl) {
        // An external avatar (e.g. the Google photo) was chosen.
        newAvatarUrl = selectedUrl;
      } else if (!avatarUrl && avatar_url) {
        // The avatar was removed without choosing a new one.
        newAvatarUrl = '';
      }

      // Validation and the profiles write happen in the action (storage stays
      // client-side so large uploads don't round-trip through the server). The
      // action also revalidates this route so "Last updated" refreshes.
      const result = await saveProfile({
        fullName: fullname ?? '',
        avatarUrl: newAvatarUrl,
      });
      if (result?.error) {
        // Roll back the just-uploaded file so a failed save leaves no orphan.
        if (uploadedPath) {
          await supabase.storage.from('avatars').remove([uploadedPath]);
        }
        toaster.create({
          title: 'Something went wrong',
          description: result.error,
          type: 'error',
        });
        return;
      }

      // Save committed: now it's safe to delete the previous uploaded file, but
      // only if the avatar actually changed away from it.
      if (oldUploadedPath && newAvatarUrl !== avatar_url) {
        await supabase.storage.from('avatars').remove([oldUploadedPath]);
      }

      // Clear pending selections so the form is no longer "dirty" post-save.
      revokeObjectUrl();
      setSelectedFile(null);
      setSelectedUrl(null);

      toaster.create({
        title: 'Profile updated',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: 'Something went wrong',
        description: 'Profile was not updated',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const nameValid = isValidFullName(fullname ?? '');
  const nameChanged = (fullname ?? '') !== (full_name ?? '');
  const avatarChanged =
    selectedFile !== null ||
    selectedUrl !== null ||
    (!avatarUrl && !!avatar_url);
  const canSave = (nameChanged || avatarChanged) && nameValid;

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
                accept={ALLOWED_AVATAR_TYPES.join(',')}
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
              invalid={!isValidFullName(fullname ?? '')}
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
        <Button
          type="button"
          onClick={updateProfile}
          loading={loading}
          disabled={!canSave}
        >
          Save changes
        </Button>
      </Flex>
    </Stack>
  );
}
