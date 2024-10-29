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

// each download (NOT merge one excel file)
const save = async ({
	data,
	name: sheetName,
}: { data: ChatMemberData[]; name: string }) => {
	console.info("わたってくるデータがどんな形をしている？");
	console.dir(data);
	const workbook = new Excel.Workbook();
	workbook.created = new Date();
	const worksheet = workbook.addWorksheet(sheetName);
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

	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer]), `chatmembers-${sheetName}.xlsx`);
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

	// TODO:
	const saveAll = () => {
		console.log(console.dir(chatMembers));
	};

	return (
		<>
			<Flex my={2} gap={4}>
				<Heading>Result</Heading>
				<Spacer />
				<Button
					onClick={() => saveAll()}
				>{`TODO: Download All ( ${data.chatMembers.length} each files)`}</Button>
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
													if (dd) save({ data: dd, name: d.outputName });
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
