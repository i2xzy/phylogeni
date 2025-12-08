import { Grid } from '@chakra-ui/react';

import { createClient } from '~/lib/utils/supabase/server';
import Header from './header';

const UserLayout = async ({ children }: LayoutProps<'/'>) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user?.id || '')
    .single();

  const profile = {
    email: user.email!,
    full_name: data?.full_name || '',
    avatar_url: data?.avatar_url || '',
  };

  return (
    <Grid autoRows="auto 1fr">
      <Header profile={profile} />
      {children}
    </Grid>
  );
};

export default UserLayout;
