import { useGetChatMembers } from "@/service/chats";
import type { ChatMemberData } from "@/types/types";
import { Box, VStack, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import { type FC, useEffect } from "react";

export const Members: FC<{
	chatId: string;
	setResult: ({
		id,
		members,
	}: {
		id: string;
		members: ChatMemberData[];
	}) => void;
}> = ({ chatId, setResult }) => {
	if (!chatId) return null;
	const { data, hasNextPage, fetchNextPage, isPending, isFetching, error } =
		useGetChatMembers({
			chatId: chatId,
			outputName: "",
			nextLink: undefined,
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
