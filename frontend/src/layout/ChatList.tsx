import { ChatListContent } from "@/view/ChatsList";
import { Box, Button, Center } from "@chakra-ui/react";
import { useState, type FC } from "react";

export const ChatList: FC = () => {
	const [go, setGo] = useState<boolean>(false);

	return (
		<Box>
			{!go ? (
				<Center>
					<Button
						onClick={() => {
							setGo(true);
						}}
					>
						Get Chats list
					</Button>
				</Center>
			) : (
				<ChatListContent />
			)}
		</Box>
	);
};
