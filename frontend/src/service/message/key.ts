export const messageKeys = {
  all: ['chat_message'] as const,
  shot: (chatId: string) => [...messageKeys.all, chatId] as const,
} as const;
