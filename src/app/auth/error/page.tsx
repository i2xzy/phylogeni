import { Flex, Heading } from '@chakra-ui/react';

const AuthError = async ({ searchParams }: PageProps<'/auth/error'>) => {
  const { error } = await searchParams;

  return (
    <Flex>
      <Heading size="lg">{error || 'Something went wrong!'}</Heading>
    </Flex>
  );
};

export default AuthError;
