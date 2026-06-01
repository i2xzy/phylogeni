'use client';

import { Input, Stack } from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import { useState } from 'react';

import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Field } from '~/components/ui/field';
import { createClient } from '~/lib/utils/supabase/client';

interface Props extends User {
  full_name?: string;
  avatar_url?: string;
}

export default function AccountForm({
  id,
  email,
  full_name,
  avatar_url,
}: Props) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState(full_name);

  const updateProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: id as string,
        full_name: fullname,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
      alert('Profile updated!');
    } catch (error) {
      console.error(error);
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack as="main" margin={8} marginY={22}>
      {avatar_url && <Avatar size="xl" src={avatar_url} name={full_name} />}
      <Field label="Email">
        <Input id="email" type="text" value={email} disabled />
      </Field>
      <Field label="Full name">
        <Input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </Field>

      <div>
        <Button onClick={updateProfile} disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </Button>
      </div>

      <div>
        <form action="/api/auth/signout" method="post">
          <Button type="submit">Sign out</Button>
        </form>
      </div>
    </Stack>
  );
}
