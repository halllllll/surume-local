import type { ChatMessageData } from "@/types/types";

export type UploadType = "validate";
export type Target = "broadcast" | "chatmember";

export type ValidationReponse =
	| {
			success: true;
			data: ChatMessageData[]; // TODO: とりあえず。実際に送信するときにどんなデータ構造のほうがいいかは未定、ファイル添付などもある
	  }
	| {
			success: false;
			error: string;
	  };
