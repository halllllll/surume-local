import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postChatMessageText, postChatMessageTextWithContext } from './functions';
import { messageKeys } from './key';
import { useSurumeContext } from '@/context/hook';
import type { ChatMessage } from './type';
import type { ChatMessageData, FormatedChatMessageData } from '@/types/types';
import type { GraphError } from '@/errors/errors';

export const usePostChatMessageText = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation<ChatMessage, GraphError, ChatMessageData>({
    mutationFn: postChatMessageText,
    // mutationKey: messageKeys.shot()
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    },
    retry: (failureCount, error) => {
      if (error.code === 'NotFound') {
        return false;
      }
      return failureCount < 3;
    },
  });

  return { mutate };
};

export const usePostChatsMessageWithContext = () => {
  const queryClient = useQueryClient();
  const { setSurumeCtx } = useSurumeContext();
  const { mutate, isPending, status, failureReason, failureCount } = useMutation<
    ChatMessage,
    GraphError,
    FormatedChatMessageData
  >({
    mutationFn: postChatMessageTextWithContext,
    networkMode: 'online', // default
    // mutationKey: messageKeys.shot(curChatId),
    onMutate: async (variables) => {
      variables.status = 'Sending';
      setSurumeCtx({
        type: 'UpdateSendingChatStatus',
        payload: { data: variables },
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
      variables.status = 'Success';
      setSurumeCtx({
        type: 'UpdateSendingChatStatus',
        payload: { data: variables },
      });
    },
    onError: (_error, variables) => {
      variables.status = 'Failed';
      setSurumeCtx({
        type: 'UpdateSendingChatStatus',
        payload: { data: variables },
      });
    },
    retry: (failureCount, error) => {
      switch (error.code) {
        case 'NotFound':
          return false;
        case 'PreconditionFailed':
          async () => {
            await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));
          };
          return true;
        case 'TooManyRequests':
          async () => {
            await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
          };
          return true;
        default:
          return failureCount < 10;
      }
    },
    retryDelay: (attempt, _error) => {
      return Math.min(
        attempt > 1 ? 2 ** attempt * 1000 : Math.random() * 500 + 1000, // ゆらぎ追加
        30 * 1000,
      );
    },
  });

  return {
    mutate,
    queryClient,
    status,
    isPending,
    failureCount,
    failureReason,
  };
};
