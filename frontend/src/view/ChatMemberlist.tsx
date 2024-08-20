import { ErrorFallback } from "@/errors/ErrorFallback";
import type { ChatMemberParam } from "@/scheme/chatMember";
import { useGetChatMembers } from "@/service/chats";
import type { ChatMemberData } from "@/types/types";
import {
	Box,
	Table,
	Text,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	VStack,
	Button,
} from "@chakra-ui/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { Suspense, useState, type FC, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ChatList: FC<{
	chatId: string;
	setResult: ({
		id,
		members,
	}: { id: string; members: ChatMemberData[] }) => void;
}> = ({ chatId, setResult }) => {
	const { data, hasNextPage, fetchNextPage, isPending, isFetching, error } =
		useGetChatMembers({
			chatId: chatId,
		});
	if (isPending) return <>{"fetching members.."}</>;
	if (error) {
		return (
			<>
				<Box>{`Error: ${error.name}`}</Box>
				<Box>{`${error.message}`}</Box>
			</>
		);
	}
	if (data.pages.length === 0) {
		return <Box>{"No Member"}</Box>;
	}
	// 二重配列のやつ、いい感じにmapやfilterで整形する方法を思いつかなかったので仕方なくfor文を回しています
	const correctData: ChatMemberData[] = [];
	for (const v of data.pages) {
		const val = v.value;
		if (!val) continue;
		for (const vv of val) {
			const vvv = vv as ChatMemberData;
			correctData.push(vvv);
		}
	}

	if (hasNextPage) {
		fetchNextPage();
	} else {
	}

	useEffect(() => {
		if (!isFetching && !isPending && !hasNextPage) {
			setResult({ id: chatId, members: correctData });
		}
		return;
	}, [isFetching, isPending, hasNextPage, chatId, setResult]);

	return (
		<VStack>
			<Text as={"b"}>{chatId}</Text>
			<Box width={"100%"}>
				<Table size={"sm"}>
					<Thead>
						<Tr>
							<Th scope={"col"}>Account</Th>
							<Th scope={"col"}>DisplayName</Th>
							<Th scope={"col"}>Role</Th>
						</Tr>
					</Thead>
					<Tbody>
						{correctData.map((d) => {
							return (
								<Tr key={d.id}>
									<Td>{`${d.email}`}</Td>
									<Td>{`${d.displayName}`}</Td>
									<Td>{`${d.roles.join(",")}`}</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Box>
		</VStack>
	);
};

type ChatMemberListProps = {
	data: ChatMemberParam;
};
export const ChatMemberList: FC<ChatMemberListProps> = ({ data }) => {
	// カンマ区切りとする　など
	const ids = data.chatId
		.split(",")
		.map((id) => id.trim())
		.filter((id) => id !== "");

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
			{ids.map((id) => {
				return (
					<Box key={id}>
						<QueryErrorResetBoundary>
							{({ reset }) => (
								<ErrorBoundary
									onReset={reset}
									FallbackComponent={ErrorFallback}
								>
									<Suspense fallback={<h2>fetching...</h2>}>
										<ChatList chatId={id} setResult={handler} />
										<Button
											type={"button"}
											onClick={() => {
												console.log(`id=${id}`);
												console.dir(chatMembers.get(id));
											}}
										>
											{`出力してみる(${chatMembers.get(id)?.length})`}
										</Button>
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
