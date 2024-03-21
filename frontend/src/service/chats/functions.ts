import { getAccessToken, prepareClient } from "../graphClient";
import { ChatsAPIResponse } from "./type";

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
	const at = await getAccessToken();
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
