import { BrowserBack } from "@/component/button/BrowserBack";
import { useSurumeContext } from "@/hooks/context";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { Badge, Box, Flex, Spacer, Text } from "@chakra-ui/react";
import type { FC } from "react";

export const Greet: FC = () => {
	const { accounts } = useMsal();
	const { surumeCtx } = useSurumeContext();
	return (
		<AuthenticatedTemplate>
			<Box mb={6} px={12}>
				<Flex align={"center"} minH={"3em"}>
					<BrowserBack />
					<Spacer />
					{/** TODO: 増えると思うので汎用的にやりたい */}
					{surumeCtx.chat_list_result && (
						<Badge
							h={"fit-content"}
							// borderColor={"purple.500"}
							// background={"purple.200"}
							// borderWidth={"thin"}
							borderRadius={"full"}
							colorScheme={"blue"}
							mx={2}
							p={2}
						>
							✔ Chats Data
						</Badge>
					)}
					<Text>Hello, {accounts[0]?.username} !</Text>
				</Flex>
			</Box>
		</AuthenticatedTemplate>
	);
};
