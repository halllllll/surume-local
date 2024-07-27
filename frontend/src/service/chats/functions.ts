import { useMsal } from "@azure/msal-react";
import { getAccessToken, prepareClient } from "../graphClient";
import type {
	ChatData,
	ChatLogsParamWithNextLink,
	ChatMembers,
	ChatsAPIResponse,
} from "./type";
import { formatISO, subMilliseconds } from "date-fns";

export const getNextChats = async (
	nextLink: string,
): Promise<ChatsAPIResponse> => {
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

// ログを取りたいよ
export const getChatData = async (
	p: ChatLogsParamWithNextLink,
): Promise<ChatData> => {
	if (p.nextLink === "" || p.nextLink === null || p.nextLink === undefined) {
		const client = prepareClient();

		const from = formatISO(p.dateFrom);
		const to = formatISO(subMilliseconds(p.dateTo, 1));

		const res = await client.GET("/me/chats/{chat-id}/messages", {
			params: {
				path: {
					"chat-id": p.chatId,
				},
				query: {
					$top: 50,
					$orderby: ["lastModifiedDateTime desc"],
					$filter: `lastModifiedDateTime gt ${from} and lastModifiedDateTime lt ${to}`,
				},
			},
		});
		if (res.error) {
			throw res.error.error;
		}

		return res.data;
	}
	// skiptokenに対応したclientがないのでnextlinkを直接fetchする
	const { instance } = useMsal();
	const { accessToken: at } = await getAccessToken(instance);
	const res = await fetch(p.nextLink, {
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
