import { useMsal } from "@azure/msal-react";
import { getAccessToken, prepareClient } from "../graphClient";
import type { Chat, ChatMembers, ChatsAPIResponse } from "./type";

export const getChats = async (nextLink: string): Promise<ChatsAPIResponse> => {
	if (nextLink.slice(nextLink.indexOf("?$skiptoken"), -1) === "") {
		const chatsClient = prepareClient();

		const res = await chatsClient.GET("/chats", {
			params: {
				query: {},
			},
		});
		if (res.error) {
			console.error(res.error);
			throw res.error.error;
		}
		return res.data;
	}
	// skiptokenのパラメータをopenapi-fetchでは扱えなかった
	// 生のfetchでやることにする
	const { instance } = useMsal();
	const { accessToken: at } = await getAccessToken(instance);
	const res = await fetch(nextLink, {
		headers: {
			Authorization: `Bearer ${at}`,
		},
	});
	if (!res.ok) {
		console.error(res.body);
		throw res.body;
	}
	return await res.json();
};

export const getChatMembers = async (chatId: string): Promise<ChatMembers> => {
	// const client = prepareClientWithBearer(token);
	const client = prepareClient();
	const res = await client.GET("/chats/{chat-id}/members", {
		params: {
			path: {
				"chat-id": chatId,
			},
		},
	});
	// const res = await client.GET("/chats/{chat-id}", {
	// 	params: {
	// 		path: {
	// 			"chat-id": chatId,
	// 		},
	// 		query: {
	// 			$expand: ["members"],
	// 		},
	// 	},
	// });
	// if (!res.data.members) {
	// 	return [];
	// }

	if (res.error) {
		throw res.error.error;
	}

	return res.data;
};

// "/chats/{chat-id}/members": {
// 	/**
// 	 * Get members from chats
// 	 * @description A collection of all the members in the chat. Nullable.
// 	 */
// 	get: operations["chats.ListMembers"];

// responses: {
// 	"2XX": components["responses"]["microsoft.graph.conversationMemberCollectionResponse"];

// "/chats/{chat-id}": {
// 	/**
// 	 * Get chat
// 	 * @description Retrieve a single chat (without its messages). This method supports federation. To access a chat, at least one chat member must belong to the tenant the request initiated from.
// 	 */
// 	get: operations["chats.chat.GetChat"];
// responses: {
// 	/** @description Retrieved entity */
// 	"2XX": {
// 		content: {
// 			"application/json": components["schemas"]["microsoft.graph.chat"];
