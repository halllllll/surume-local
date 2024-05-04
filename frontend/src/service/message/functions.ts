import { GraphError } from "@/errors/errors";
import { prepareClient, prepareClientWithBearer } from "../graphClient";
import type { ChatMessage } from "./type";
import {
	type ChatMessageData,
	type FormatedChatMessageData,
	TZ,
} from "@/types/types";

export const postChatMessageText = async (
	data: ChatMessageData,
): Promise<ChatMessage> => {
	const chatClient = prepareClient();
	const res = await chatClient.POST("/chats/{chat-id}/messages", {
		params: {
			path: { "chat-id": data.chatId },
		},
		body: {
			"@odata.type": "#microsoft.graph.chatMessage",
			body: {
				"@odata.type": "#microsoft.graph.itemBody",
				contentType: "html",
				content: `${data.content}`,
			},
			locale: data.localtime ?? TZ,
		},
	});
	if (res.error) {
		throw new GraphError(res.error.error);
	}
	return res.data;
};

export const postChatMessageTextWithContext = async (data: {
	data: FormatedChatMessageData;
	token: string;
}): Promise<ChatMessage> => {
	const chatClient = prepareClientWithBearer(data.token);
	const res = await chatClient.POST("/chats/{chat-id}/messages", {
		params: {
			path: { "chat-id": data.data.chatId },
		},
		body: {
			"@odata.type": "#microsoft.graph.chatMessage",
			body: {
				"@odata.type": "#microsoft.graph.itemBody",
				contentType: "html",
				content: `${data.data.content}`,
			},
			locale: data.data.localtime ?? TZ,
		},
	});
	if (res.error) {
		throw new GraphError(res.error.error);
	}
	return res.data;
};

/* TODO
export const postChatMessageWithFile = async (data: ) => {
	// PSEUDO
	const data = {
		chatId: "a",
		content: "a",
		localtime: TZ,
	};

	const chatClient = prepareClient();
	const res = await chatClient.POST("/chats/{chat-id}/messages", {
		params: {
			path: { "chat-id": data.chatId },
		},
		body: {
			"@odata.type": "#microsoft.graph.chatMessage",
			body: {
				"@odata.type": "#microsoft.graph.itemBody",
				contentType: "html",
				content: `${data.content}`,
			},
			// attachments: {

			// },
			locale: data.localtime ?? TZ,
		},
	});
	if (res.error) {
		throw new GraphError(res.error.error);
	}
	return res.data;
};
*/
