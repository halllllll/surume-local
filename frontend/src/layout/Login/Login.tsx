import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Box } from "@chakra-ui/react";
import type { FC } from "react";

function errorComponent() {
	return <Box>error...</Box>;
}
function loadingComponent() {
	return <Box>loading...</Box>;
}

// 不要
const LoginPage: FC = () => {
	return (
		<Box>
			<MsalAuthenticationTemplate
				interactionType={InteractionType.Popup}
				errorComponent={errorComponent}
				loadingComponent={loadingComponent}
			>
				<Box>yes</Box>
			</MsalAuthenticationTemplate>
		</Box>
	);
};
