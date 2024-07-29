import { ErrorFallback } from "@/errors/ErrorFallback";
import type { ChatLogsParam, ChatLogsParams } from "@/layout/ChatLogs";
import { useGetChatLogsPagenate } from "@/service/chats";
import type { ChatUser } from "@/service/chats/type";
import { Box, Button, Spinner } from "@chakra-ui/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";

const ChatList: FC<ChatLogsParam> = (d) => {
	const { data, hasNextPage, fetchNextPage, isError, isPending, error } =
		useGetChatLogsPagenate(d);
	if (isPending) return <>{"fetching chat logs.."}</>;
	if (error)
		return (
			<>
				<Box>{`Error: ${error.name}`}</Box>
				<Box>{`${error.message}`}</Box>
			</>
		);
	if (data.pages.length === 0) {
		return <Box>{"No Logs"}</Box>;
	}

	if (hasNextPage) {
		fetchNextPage();
	} else if (!isError && !isPending) {
	}

	const save = async () => {
		const workbook = new Excel.Workbook();
		workbook.created = new Date();
		const worksheet = workbook.addWorksheet(d.outputName);
		worksheet.columns = [
			{ header: "date", key: "date" },
			{ header: "username", key: "username" },
			{ header: "content", key: "content" },
			{ header: "filenames", key: "filenames" },
			{ header: "url", key: "url" },
		];

		for (const v of data.pages) {
			const value = v.value;
			if (!value) continue;
			for (const vv of value) {
				const chatuserdata = vv.from?.user as unknown as ChatUser;
				worksheet.addRow({
					date: vv.createdDateTime ? new Date(vv.createdDateTime) : "----",
					username: chatuserdata?.displayName ?? "----",
					content: vv.body?.content ?? "----",
					filenames: vv.attachments?.map((a) => a.name ?? "null").join(", "),
					url: `https://teams.microsoft.com/l/message/${vv.chatId}/${vv.id}?context=${encodeURIComponent('{"contextType":"chat"}')}`,
				});
			}
		}

		const buffer = await workbook.xlsx.writeBuffer();
		saveAs(
			new Blob([buffer]),
			`chatlogs-${format(d.dateFrom, "yyyyMMdd_HHmmssSSS")}-${format(d.dateTo, "yyyyMMdd_HHmmssSSS")}.xlsx`,
		);
	};

	return (
		<Box width={"100%"} my={4}>
			{hasNextPage || isPending ? (
				<>
					fetching.... <Spinner />
				</>
			) : (
				<Box>
					<Button onClick={save}>Download</Button>
					{/* <Text>{`(count: ${count})`}</Text> */}
				</Box>
			)}
		</Box>
	);
};

export const ChatLogList: FC<ChatLogsParams> = (d) => {
	if (!d.chats) return <>no chat data</>;
	const chats = d.chats;
	// type Result = {
	// 	targetName: string;
	// 	targetData: ChatMessage[];
	// };
	// const result: Result[] = [];
	// const [result, updateResult] = useState<Result[]>([]);

	return (
		<Box>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
						<Suspense fallback={<h2>fetching...</h2>}>
							{chats.map((c) => {
								// <ChatList props={d.props} />;
								return (
									<ChatList
										key={c.chatId}
										chatId={c.chatId}
										outputName={c.outputName}
										dateFrom={d.dateFrom}
										dateTo={d.dateTo}
									/>
								);
							})}
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</Box>
	);
};
