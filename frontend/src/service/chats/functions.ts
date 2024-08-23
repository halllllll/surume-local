import { useMsal } from "@azure/msal-react";
import {
	getAccessToken,
	prepareClient,
	useGraphNextLink,
} from "../graphClient";
import type {
	ChatData,
	ChatLogsParamWithNextLink,
	ChatMemberParamWithNextLink,
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

// TODO: exist `nextlink` flow
export const getChatMembers = async (
	p: ChatMemberParamWithNextLink,
): Promise<ChatMembers> => {
	if (p.nextLink === "" || p.nextLink === null || p.nextLink === undefined) {
		const client = prepareClient();
		const res = await client.GET("/chats/{chat-id}/members", {
			params: {
				path: {
					"chat-id": p.chatId,
				},
			},
		});

		if (res.error) {
			throw res.error.error;
		}
		return res.data;
	}

	// TODO: エラー時の型の設定方法がわからず未設定
	const ret = useGraphNextLink<ChatMembers>(p.nextLink);

	return ret;
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
	// const { instance } = useMsal();
	// const { accessToken: at } = await getAccessToken(instance);
	// const res = await fetch(p.nextLink, {
	// 	headers: {
	// 		Authorization: `Bearer ${at}`,
	// 	},
	// });
	// if (!res.ok) {
	// 	console.error(res.body);
	// 	throw res.body;
	// }
	// return await res.json();

	// TODO: エラー時の型の設定方法がわからず未設定
	const ret = useGraphNextLink<ChatData>(p.nextLink);
	return ret;
};
