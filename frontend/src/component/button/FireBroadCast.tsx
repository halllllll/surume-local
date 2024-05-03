import { useSurumeContext } from "@/hooks/context";
import type { FormatedChatMessageData } from "@/types/types";
import { Button, Center } from "@chakra-ui/react";
import type { FC } from "react";

type Prop = {
	scrollTo: () => void;
	sendHandler: (data: FormatedChatMessageData[]) => void;
	isLoading: boolean;
};
export const FireBroadCast: FC<Prop> = ({
	scrollTo,
	sendHandler,
	isLoading,
}) => {
	const { surumeCtx } = useSurumeContext();
	const messages = surumeCtx.chat_messages;
	if (messages.length === 0) return null;
	// const scroll = props.scrollTo;
	const handlers = () => {
		scrollTo();
		sendHandler(messages);
	};
	return (
		<Center>
			<Button
				colorScheme="teal"
				size={"lg"}
				onClick={handlers}
				isLoading={isLoading}
			>
				🔥FIRE🔥
			</Button>
		</Center>
	);
};
