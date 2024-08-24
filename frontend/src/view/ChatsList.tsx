import { ErrorFallback } from "@/errors/ErrorFallback";
import { useGetChatsPaginate } from "@/service/chats";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { Suspense, useEffect, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ChatListTable, save } from "./ChatListTable";
import { useSurumeContext } from "@/hooks/context";

const DownloadLink: FC = () => {
	const { data, isPending, hasNextPage, fetchNextPage, error } =
		useGetChatsPaginate();
	const { setSurumeCtx } = useSurumeContext();
	if (!error) console.error(error);

	if (hasNextPage) {
		fetchNextPage();
	} else {
	}

	useEffect(() => {
		if (!hasNextPage) {
			setSurumeCtx({
				type: "SetBelongingChat",
				payload: { count: data.count, result: data.result },
			});
		}
	}, [setSurumeCtx, hasNextPage, data]);

	const count = data.count;
	return (
		<Box>
			{isPending ? (
				<Flex>
					<Text>{`processing... current count: ${count}`}</Text>
					<Spinner size="sm" />
				</Flex>
			) : (
				<>
					<Flex mb={4} gap={10} align={"center"}>
						<Text>{`done count: ${count}`}</Text>
						{!hasNextPage ? (
							<>
								<Button onClick={() => save(data.result)}>download xlsx</Button>
							</>
						) : (
							<Box px={4}>
								<Spinner />
							</Box>
						)}
					</Flex>
					<ChatListTable data={data.result} />
				</>
			)}
		</Box>
	);
};

export const ChatListContent: FC = () => {
	return (
		<Box>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
						<Suspense fallback={<h2>wait...</h2>}>
							<DownloadLink />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</Box>
	);
};
