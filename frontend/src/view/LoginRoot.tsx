import type { FC } from "react";
import { LoginButton } from "@/component/button/LoginButton";
import { Flex, Heading } from "@chakra-ui/react";
import { useIsAuthenticated } from "@azure/msal-react";

export const LoginRoot: FC = () => {
	const isAuthenticated = useIsAuthenticated();
	console.log(`authenticated?? ${isAuthenticated}`);
	return (
		<Flex height="50vh" alignItems="center" justifyContent="center">
			<Flex direction="column" padding={12} rounded={6}>
				<Heading mb={3}>Ready to SURUME</Heading>
				<LoginButton />
			</Flex>
		</Flex>
	);
};
