import { Box, type BoxProps, forwardRef, useColorModeValue } from '@chakra-ui/react';
import type { FC } from 'react';

export const BaseCard1: FC<BoxProps & { children: React.ReactNode }> = forwardRef<BoxProps, 'div'>(
  (props, ref) => (
    <Box
      border="1px"
      borderColor={'gray.400'}
      rounded={'lg'}
      borderWidth={2}
      m={2}
      p={2}
      height={100}
      ref={ref}
      _hover={{ bg: 'blue.500', color: 'white' }}
      {...props}
    >
      {props.children}
    </Box>
  ),
);

export const BaseCard2 = forwardRef<BoxProps, 'div'>((props, ref) => {
  const hoverBgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  return (
    <Box
      border="1px"
      borderColor="gray.400"
      rounded="lg"
      borderWidth={2}
      m={2}
      p={2}
      height={100}
      ref={ref}
      _hover={{ bg: hoverBgColor, color: 'current' }}
      {...props}
    >
      {props.children}
    </Box>
  );
});
