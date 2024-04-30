import { Button, Text, VStack } from '@chakra-ui/react';
import type { FC } from 'react';
import type { FallbackProps } from 'react-error-boundary';

export const ErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const err = error as Error;
  console.error(err);
  return (
    <VStack m={3}>
      <Text>エラー発生: {err.message}</Text>
      <Button
        onClick={() => {
          resetErrorBoundary();
        }}
      >
        エラーをクリア
      </Button>
    </VStack>
  );
};
