import { ErrorFallback } from "@/errors/ErrorFallback";
import type { ChatMemberParam } from "@/scheme/chatMember";
import type { ChatMemberData } from "@/types/types";
import {
	Box,
	Text,
	Button,
	Center,
	Heading,
	Flex,
	Spacer,
} from "@chakra-ui/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { Suspense, useState, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Members } from "./List";
import Excel from "exceljs";
import { saveAs } from "file-saver";

const fillWorksheetWithData = ({
	worksheet,
	data,
}: { worksheet: Excel.Worksheet; data: ChatMemberData[] }) => {
	worksheet.columns = [
		{ header: "id", key: "id" },
		{ header: "username", key: "username" },
		{ header: "role", key: "role" },
		{ header: "since", key: "since" },
	];

	for (const v of data) {
		worksheet.addRow({
			id: v.email,
			username: v.displayName,
			role: v.roles.join(", "),
			since: v.visibleHistoryStartDateTime, // TODO: レスポンスのJSOMをみても`"0001-01-01T00:00:00Z"`とかになってて全然嬉しそうなデータじゃない
		});
	}
};
// each download
const save = async ({
	data,
	sheetName, // あとから全部DLを追加したのでその場合は命名がおかしいが一旦気にしないことにしてほしい
	fileName,
}:
	| { data: ChatMemberData[]; sheetName: string; fileName?: undefined }
	| {
			// これがあとから追加したやつ　データ構造が雑
			data: Map<string, ChatMemberData[]>;
			sheetName: { chatid: string; outputName: string }[];
			fileName: string;
	  }) => {
	const workbook = new Excel.Workbook();
	workbook.created = new Date();
	let _outputFileName: string;
	if (fileName === undefined) {
		_outputFileName = `chatmembers-${sheetName}.xlsx`;
		const worksheet = workbook.addWorksheet(sheetName);

		fillWorksheetWithData({ worksheet, data });
	} else {
		_outputFileName = fileName;
		if (data.size !== new Set(sheetName).size) {
			console.info(data);
			console.info(sheetName);
			// TODO: 画面になんも表示されないのであとでなんとかする
			throw new Error(
				"invalid data - not same size each chatMember and sheet names data",
			);
		}
		for (const { chatid, outputName } of sheetName) {
			const dd = data.get(chatid);
			if (!dd) {
				console.info(`not found data of ${outputName}`);
				continue;
			}
			const worksheet = workbook.addWorksheet(outputName);

			fillWorksheetWithData({ worksheet, data: dd });
		}
	}
	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer]), _outputFileName);
};

export const ChatMembersList: FC<{
	data: ChatMemberParam;
}> = ({ data }) => {
	const [chatMembers, setChatMembers] = useState<Map<string, ChatMemberData[]>>(
		new Map(),
	);
	const handler = ({
		id,
		members,
	}: {
		id: string;
		members: ChatMemberData[];
	}) => {
		setChatMembers((val) => {
			return val.set(id, members);
		});
	};

	return (
		<>
			<Flex my={2} gap={4}>
				<Heading>Result</Heading>
				<Spacer />
				<Button
					onClick={() =>
						save({
							data: data.chatMembers.reduce((acc, cur) => {
								const dd = chatMembers.get(cur.chatId);
								if (dd) {
									acc.set(cur.chatId, dd);
								}
								return acc;
							}, new Map<string, ChatMemberData[]>()),
							sheetName: data.chatMembers.map((d) => {
								return { chatid: d.chatId, outputName: d.outputName };
							}),
							fileName: "allchatmembers.xlsx",
						})
					}
				>{`Download All ( ${data.chatMembers.length} worksheets)`}</Button>
				<Spacer />
			</Flex>

			{data.chatMembers.map((d) => {
				return (
					<Box key={d.chatId} my={4}>
						<Text
							as={"b"}
							fontWeight={"20em"}
						>{`target: ${d.chatName ?? d.outputName}`}</Text>
						<QueryErrorResetBoundary>
							{({ reset }) => (
								<ErrorBoundary
									onReset={reset}
									FallbackComponent={ErrorFallback}
								>
									<Suspense fallback={<h2>fetching...</h2>}>
										<Members chatId={d.chatId} setResult={handler} />
										<Center>
											<Button
												type={"button"}
												my={2}
												// isDisabled={!chatMembers.get(d.chatId)}
												onClick={() => {
													const dd = chatMembers.get(d.chatId);
													if (dd) save({ data: dd, sheetName: d.outputName });
												}}
											>
												{`Download (${d.outputName})`}
											</Button>
										</Center>
									</Suspense>
								</ErrorBoundary>
							)}
						</QueryErrorResetBoundary>
					</Box>
				);
			})}
		</>
	);
};
