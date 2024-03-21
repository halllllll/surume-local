import { GraphError } from "@/errors/errors";
import { prepareClient } from "../graphClient";
import { ChatMessage } from "./type";
import { ChatMessageData, FormatedChatMessageData, TZ } from "@/types/types";

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

export const postChatMessageTextWithContext = async (
	data: FormatedChatMessageData,
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
