import { Box, Grid, Heading } from '@chakra-ui/react';
import Image from 'next/image';
import { RiDiscordFill } from 'react-icons/ri';

import { Button } from '~/components/ui/button';
import Markdown from '~/lib/components/Markdown';
import Contact from '~/lib/components/website/Contact';

type SectionProps = {
  id: string;
  title: string;
  content: string;
  image?: string;
  background?: string;
  discordUrl?: string;
};

const Section = ({
  id,
  title,
  content,
  image,
  background,
  discordUrl,
}: SectionProps) => {
  const isContact = id === 'contact';

  return (
    <Grid
      id={id}
      width="full"
      background={{
        base: background === 'teal' ? 'teal.50' : 'blackAlpha.50',
        _dark: background === 'teal' ? 'teal.800' : 'blackAlpha.700',
      }}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          width={0}
          height={0}
          sizes="100vw"
          priority
          style={{
            objectFit: 'cover',
            width: '100%',
            maxHeight: 430,
            background: 'black',
          }}
        />
      )}
      <Grid
        width="full"
        maxW={1200}
        margin="0 auto"
        p={[8, 16]}
        gap={[8, 16]}
        templateColumns={['unset', isContact ? '1fr 1fr' : '2fr 1fr']}
      >
        <Box width="full" display="flex" flexDirection="column">
          <Heading fontSize={['4xl', '5xl']} fontWeight="normal" mb={6}>
            {title}
          </Heading>
          <Markdown>{content}</Markdown>
          {isContact && discordUrl && (
            <Button
              asChild
              alignSelf="center"
              mt={6}
              bg="#5865F2"
              color="white"
              _hover={{ bg: '#4752C4' }}
            >
              <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                <RiDiscordFill /> Join the Discord
              </a>
            </Button>
          )}
        </Box>
        {isContact ? <Contact /> : <Button ml="auto">Get started</Button>}
      </Grid>
    </Grid>
  );
};

export default Section;
