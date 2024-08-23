import { ErrorFallback } from "@/errors/ErrorFallback";
import type { ChatMemberParam } from "@/scheme/chatMember";
import type { ChatMemberData } from "@/types/types";
import { Box, Text, Button, Center } from "@chakra-ui/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { Suspense, useState, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Members } from "./List";
import Excel from "exceljs";
import { saveAs } from "file-saver";

const save = async ({
	data,
	name: sheetName,
}: { data: ChatMemberData[]; name: string }) => {
	const workbook = new Excel.Workbook();
	workbook.created = new Date();
	const worksheet = workbook.addWorksheet(sheetName);
	worksheet.columns = [
		{ header: "id", key: "id" },
		{ header: "username", key: "username" },
		{ header: "role", key: "role" },
		{ header: "from", key: "from" },
	];

	for (const v of data) {
		worksheet.addRow({
			id: v.email,
			username: v.displayName,
			role: v.roles.join(", "),
			from: v.visibleHistoryStartDateTime,
		});
	}

	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer]), `chatmembers-${sheetName}.xlsx`);
};

export const ChatMembersList: FC<{ data: ChatMemberParam }> = ({ data }) => {
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
			{data.chatMembers.map((d) => {
				return (
					<Box key={d.chatId}>
						<Center>
							<Text as={"b"}>{`target: ${d.outputName}`}</Text>
						</Center>
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
												isDisabled={!chatMembers.get(d.chatId)}
												onClick={() => {
													const dd = chatMembers.get(d.chatId);
													if (dd) save({ data: dd, name: "a" });
												}}
											>
												{!chatMembers.get(d.chatId)
													? "-- ??? --"
													: `Download (${d.outputName})`}
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
