import { ErrorFallback } from "@/errors/ErrorFallback";
import { useGetChatInfo } from "@/service/chats";
import type { ConversationMember } from "@/service/chats/type";
import { Box, Table, Text, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	chatId: string;
};
const ChatList: FC<Props> = ({ chatId }) => {
	const { data, isPending, status, error } = useGetChatInfo(chatId);
	if (isPending) return <>{"fetching members.."}</>;
	if (error)
		return (
			<>
				<Box>{`Error: ${error.name}`}</Box>
				<Box>{`${error.message}`}</Box>
			</>
		);
	if (!data.value) {
		return <Box>{"No Member"}</Box>;
	}

	// OASには定義されてないがemail, userIdが存在する
	const correctData = data.value as unknown as Required<
		ConversationMember & {
			email: string;
			userId: string;
		}
	>[];
	return (
		<Box width={"100%"}>
			<Table size={"sm"}>
				<Thead>
					<Tr>
						<Th scope={"col"}>ID</Th>
						<Th scope={"col"}>DisplayName</Th>
						<Th scope={"col"}>Account</Th>
						<Th scope={"col"}>Role</Th>
					</Tr>
				</Thead>
				<Tbody>
					{correctData.map((d) => {
						return (
							<Tr key={d.id}>
								<Td>
									<Text overflowWrap={"anywhere"}>{`${d.id}`}</Text>
								</Td>
								<Td>{`${d.email}`}</Td>
								<Td>{`${d.displayName}`}</Td>
								<Td>{`${d.roles}`}</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</Box>
	);
};

type ChatMemberListProps = {
	chatId: string;
};
export const ChatMemberList: FC<ChatMemberListProps> = ({ chatId }) => {
	return (
		<Box>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
						<Suspense fallback={<h2>fetching...</h2>}>
							<ChatList chatId={chatId} />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</Box>
	);
};
