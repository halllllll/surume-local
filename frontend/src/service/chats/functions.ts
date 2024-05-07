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
