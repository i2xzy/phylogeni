'use client';

import { Link as ChakraLink, type LinkProps } from '@chakra-ui/react';
import NextLink from 'next/link';

export interface TextLinkProps extends LinkProps {
  href: string;
}

/**
 * Internal navigation link with the app's standard "entity link" styling
 * (brand green, with Chakra's default underline-on-hover). Wraps Chakra Link +
 * Next.js Link so call sites don't repeat the color / asChild / NextLink
 * boilerplate. Any style prop can be overridden per use (e.g. fontWeight).
 */
export const TextLink = ({ href, children, ...rest }: TextLinkProps) => (
  <ChakraLink asChild color="teal.fg" {...rest}>
    <NextLink href={href}>{children}</NextLink>
  </ChakraLink>
);
