import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { getChatData, getChatMembers, getNextChats } from "./functions";
import type { ChatsAPIResponse, ChatMembers, ChatData } from "./type";
import { chatKeys } from "./key";
import type { GraphError } from "@/errors/errors";
import type { ChatLogsParam } from "@/layout/ChatLogs";

export const useGetChatsPaginate = () => {
	const {
		data,
		refetch,
		isPending,
		hasNextPage,
		fetchNextPage,
		isError,
		isFetching,
		isLoading,
		error,
	} = useSuspenseInfiniteQuery({
		networkMode: "offlineFirst",
		retry: 3,
		retryOnMount: true,
		retryDelay: (attempt) =>
			Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000), // TODO: defaultだと不要らしいのであとで消す
		queryKey: ["chat pagenates"],
		queryFn: ({ pageParam }) => {
			return getNextChats(pageParam);
		},
		select: (data) => {
			const result = data.pages.map((v) => {
				return v.value?.map((vv) => {
					return {
						type: vv.chatType,
						id: vv.id,
						topic: vv.topic,
						createdat: vv.createdDateTime,
						updatedat: vv.lastUpdatedDateTime,
						url: vv.webUrl,
					};
				});
			});

			return {
				count: data.pages
					.map((v) => v["@odata.count"])
					.reduce((pre, cur) => pre && cur && pre + cur),
				result: result.flat(),
			};
		},
		getNextPageParam: (lastPage: ChatsAPIResponse) => {
			const ret = lastPage["@odata.nextLink"];
			return ret;
		},
		initialPageParam: "",
	});

	return {
		data,
		refetch,
		isPending,
		isFetching,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isError,
		error,
	};
};

export const useGetChatMembers = (chatId: string) => {
	const { data, refetch, status, isPending, error } = useSuspenseQuery<
		ChatMembers,
		GraphError
	>({
		networkMode: "offlineFirst",
		retry: (failureCount, error) => {
			console.warn(error);
			if (error.code === "NotFound") {
				return false;
			}
			return failureCount < 3;
		},
		retryOnMount: true,
		queryKey: chatKeys.members(chatId),
		queryFn: () => getChatMembers(chatId),
	});

	return { data, refetch, isPending, status, error };
};

export const useGetChatLogsPagenate = (props: ChatLogsParam) => {
	const {
		data,
		refetch,
		isPending,
		hasNextPage,
		fetchNextPage,
		isError,
		isFetching,
		isLoading,
		error,
	} = useSuspenseInfiniteQuery({
		// ここはキャストしない（TPageParamがunkownになる）
		networkMode: "offlineFirst",
		retry: (failureCount, error: GraphError) => {
			console.warn(error);
			if (error.code === "NotFound" || error.code === "Forbidden") {
				return false;
			}
			return failureCount < 10;
		},

		retryOnMount: true,
		retryDelay: (attempt) =>
			Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000), // TODO: defaultだと不要らしいのであとで消す
		queryKey: chatKeys.logs(props),
		queryFn: ({ pageParam }) => {
			return getChatData(pageParam);
		},
		getNextPageParam: (lastPage: ChatData) => {
			const ret = lastPage["@odata.nextLink"];
			if (ret === null || ret === undefined) return undefined;
			return { ...props, nextLink: ret };
		},
		initialPageParam: { ...props, nextLink: "" },
	});

	return {
		data,
		refetch,
		isPending,
		isFetching,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isError,
		error,
	};
};
