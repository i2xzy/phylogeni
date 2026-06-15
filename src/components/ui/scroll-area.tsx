'use client';

import { ScrollArea as ChakraScrollArea } from '@chakra-ui/react';
import * as React from 'react';

export interface ScrollAreaProps extends ChakraScrollArea.RootProps {
  scrollbarProps?: ChakraScrollArea.ScrollbarProps;
  thumbProps?: ChakraScrollArea.ThumbProps;
  contentProps?: ChakraScrollArea.ContentProps;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(props, ref) {
    const { children, scrollbarProps, thumbProps, contentProps, ...rest } =
      props;
    return (
      <ChakraScrollArea.Root ref={ref} {...rest}>
        <ChakraScrollArea.Viewport>
          <ChakraScrollArea.Content {...contentProps}>
            {children}
          </ChakraScrollArea.Content>
        </ChakraScrollArea.Viewport>
        <ChakraScrollArea.Scrollbar {...scrollbarProps}>
          <ChakraScrollArea.Thumb {...thumbProps} />
        </ChakraScrollArea.Scrollbar>
        <ChakraScrollArea.Corner />
      </ChakraScrollArea.Root>
    );
  }
);
