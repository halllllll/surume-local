import type { SURUMEError } from '@/errors/errors';

export const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

type FireStatus = 'Ready' | 'Sending' | 'Failed' | 'Success';
export type FormatedChatMessageData = ChatMessageData & {
  status: FireStatus;
  indexOrder: number;
};

export type OperationResult<T> =
  | {
      succes: false;
      error: SURUMEError;
    }
  | {
      success: true;
      data: T;
    };

type Attached = {
  dist: string;
  // files: File[];
};
export type ChatMessageData = {
  name?: string;
  chatId: string;
  content: string;
  localtime?: string;
  attachement?: Attached;
  // attachment?: string; // stringかどうかも適当だが一応つけておく
  // attachments?: ChatMessage["attachments"];
};
