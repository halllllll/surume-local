import { ErrorFallback } from "@/errors/ErrorFallback";
import type { ChatLogsParam, ChatLogsParams } from "@/scheme/chatLogs";
import { useGetChatLogsPagenate } from "@/service/chats";
import type { ChatUser } from "@/service/chats/type";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	Box,
	Button,
	Center,
	Flex,
	Spacer,
	Spinner,
	Text,
	useToast,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useState, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import type { ChatMessage } from "@/service/message/type";

type Chatlog = {
	timestamp: string | Date;
	username: string;
	content: string;
	filenames: string[] | undefined;
	url: string;
};

const save = async ({
	fileName,
	sheetNames,
	data: chatLogData,
}: { fileName: string; sheetNames: string[]; data: Chatlog[][] }) => {
	const workbook = new Excel.Workbook();
	workbook.created = new Date();

	for (const [idx, sheetName] of sheetNames.entries()) {
		const worksheet = workbook.addWorksheet(sheetName);
		worksheet.columns = [
			{ header: "timestamp", key: "timestamp" },
			{ header: "username", key: "username" },
			{ header: "content", key: "content" },
			{ header: "filenames", key: "filenames" },
			{ header: "url", key: "url" },
		];
		fillWorksheetWithData({ worksheet, data: chatLogData[idx] });
	}

	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer]), fileName);
};

const convertChatMessageToChatlogData = (data: ChatMessage[]): Chatlog[] => {
	let _tmpData: Chatlog[] = [];
	for (const vv of data) {
		const chatuserdata = vv.from?.user as unknown as ChatUser;
		_tmpData = [
			..._tmpData,
			{
				timestamp: vv.createdDateTime ? new Date(vv.createdDateTime) : "----",
				username: chatuserdata?.displayName ?? "----",
				content: vv.body?.content ?? "----",
				filenames: vv.attachments?.map((a) => a.name ?? "null"),

				url: `https://teams.microsoft.com/l/message/${vv.chatId}/${vv.id}?context=${encodeURIComponent('{"contextType":"chat"}')}`,
			},
		];
	}

	return _tmpData;
};

const ChatList: FC<
	ChatLogsParam & {
		setLogData: ({
			outputName,
			data,
		}: { outputName: string; data: Chatlog[] | Error }) => void;
	}
> = (d) => {
	const {
		data,
		hasNextPage,
		fetchNextPage,
		isError,
		isFetching,
		isLoading,
		isSuccess,
		isPending,
		error,
	} = useGetChatLogsPagenate(d);
	if (isPending) return <>{"fetching chat logs.."}</>;
	if (error) {
		d.setLogData({ outputName: d.outputName, data: error });
		return (
			<>
				<Box>{`Error: ${error.name}`}</Box>
				<Box>{`${error.message}`}</Box>
			</>
		);
	}
	if (data.pages.length === 0) {
		return <Box>{"No Logs"}</Box>;
	}

	if (hasNextPage) {
		fetchNextPage();
	} else if (!isError && !isPending && !isLoading && !isFetching && isSuccess) {
		let _tmpData: Chatlog[] = [];

		for (const v of data.pages) {
			const value = v.value;
			if (!value) continue;
			_tmpData = [..._tmpData, ...convertChatMessageToChatlogData(value)];
		}
		d.setLogData({ outputName: d.outputName, data: _tmpData });
	}

	return (
		<Box>
			{hasNextPage || isPending ? (
				<>
					fetching.... <Spinner />
				</>
			) : (
				<Box>
					<Button
						onClick={() => {
							// TODO: 変換
							let _tmpData: Chatlog[] = [];
							for (const v of data.pages) {
								const value = v.value;
								if (!value) continue;
								_tmpData = [
									..._tmpData,
									...convertChatMessageToChatlogData(value),
								];
							}

							save({
								fileName: `chatlogs-${format(d.dateFrom, "yyyyMMdd_HHmmssSSS")}-${format(d.dateTo, "yyyyMMdd_HHmmssSSS")}.xlsx`,
								sheetNames: [d.outputName],
								data: [_tmpData],
							});
						}}
					>{`Download ( ${d.outputName} )`}</Button>
				</Box>
			)}
		</Box>
	);
};

export const ChatLogList: FC<ChatLogsParams> = (d) => {
	if (!d.chats) return <>no chat data</>;
	const chats = d.chats;
	const toast = useToast();

	const [chatlog, setChatlog] = useState<Map<string, Chatlog[] | Error>>(
		new Map(),
	);

	const handler = ({
		outputName,
		data,
	}: { outputName: string; data: Chatlog[] | Error }) => {
		setChatlog((val) => {
			return val.set(outputName, data);
		});
	};

	const onlyvaluecheckhandler = () => {
		console.info("check!");
		console.log(chatlog);
		const resultAllData = Array.from(chatlog.entries()).filter(
			(d): d is [string, Chatlog[]] => {
				if (d[1] instanceof Error) {
					return false;
				}
				if (!Array.isArray(d[1])) {
					return false;
				}
				if (typeof d[1] !== "object" || d[1] === null) {
					return false;
				}
				// 要素検証
				for (const dd of d[1]) {
					const { timestamp, username, content, filenames, url } = dd;
					if (typeof timestamp !== "string" && !(timestamp instanceof Date)) {
						// 1. timestamp: string | Date
						//    文字列または Date インスタンスであることを確認
						return false;
					}

					if (typeof username !== "string") {
						// 2. username: string
						return false;
					}

					if (typeof content !== "string") {
						// 3. content: string
						return false;
					}

					if (filenames !== undefined) {
						// 4. filenames: string[] | undefined
						//    undefined か、すべて string の配列かをチェック
						if (!Array.isArray(filenames)) {
							return false;
						}
						if (!filenames.every((filename) => typeof filename === "string")) {
							return false;
						}
					}

					if (typeof url !== "string") {
						// 5. url: string
						return false;
					}
				}
				return true;
			},
		);
		const [resultSheetNames, resultChatData] = [
			resultAllData.map((d) => d[0]),
			resultAllData.map((d) => d[1]),
		];
		if (resultSheetNames.length !== resultChatData.length) {
			toast({
				status: "error",
				description: "not same size (why?",
			});
			// throw new Error("not same size (why?");
		}
		save({
			fileName: `batched_chatlogs-${format(d.dateFrom, "yyyyMMdd_HHmmssSSS")}-${format(d.dateTo, "yyyyMMdd_HHmmssSSS")}.xlsx`,
			sheetNames: resultSheetNames,
			data: resultChatData,
		});
	};

	return (
		<Box>
			<Center my={4}>
				<Alert status="error" variant={"solid"}>
					<Flex align={"center"} gap={10}>
						<AlertIcon />
						<AlertDescription>
							<Text>
								{"You should check each results have done before push "}
								<Text as={"strong"}>" DL ALL"</Text>
								{" button ---> "}
							</Text>
							<Text>
								{
									"specifically it's referenced 'current data' for system technical reason"
								}
							</Text>
						</AlertDescription>
						<Spacer />
						<Button type="button" onClick={onlyvaluecheckhandler}>
							DL ALL
						</Button>
					</Flex>
				</Alert>
			</Center>
			<Wrap>
				{chats.map((c) => {
					return (
						<WrapItem key={c.chatId}>
							<QueryErrorResetBoundary>
								{({ reset }) => (
									<ErrorBoundary
										onReset={reset}
										FallbackComponent={ErrorFallback}
									>
										<Suspense fallback={<h2>fetching...</h2>}>
											<ChatList
												key={c.chatId}
												chatId={c.chatId}
												outputName={c.outputName}
												dateFrom={d.dateFrom}
												dateTo={d.dateTo}
												setLogData={handler}
											/>
										</Suspense>
									</ErrorBoundary>
								)}
							</QueryErrorResetBoundary>
						</WrapItem>
					);
				})}
			</Wrap>
		</Box>
	);
};

const fillWorksheetWithData = ({
	worksheet,
	data,
}: { worksheet: Excel.Worksheet; data: Chatlog[] }) => {
	worksheet.columns = [
		{ header: "timestamp", key: "timestamp" },
		{ header: "username", key: "username" },
		{ header: "content", key: "content" },
		{ header: "filenames", key: "filenames" },
		{ header: "url", key: "url" },
	];

	for (const v of data) {
		worksheet.addRow({
			...v,
		});
	}
};
