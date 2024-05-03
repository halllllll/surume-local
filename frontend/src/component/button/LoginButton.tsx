import { useSurumeContext } from "@/hooks/context";
import { useAzureAuthLogin } from "@/hooks/entraid";
import { InteractionStatus } from "@azure/msal-browser";
import { Button } from "@chakra-ui/react";

export const LoginButton = () => {
	const { surumeCtx } = useSurumeContext();
	const { loginAzure, inProgress } = useAzureAuthLogin(
		surumeCtx.redirect_uri_fqdn,
	);

	return (
		<>
			<Button
				colorScheme="teal"
				onClick={loginAzure}
				isLoading={InteractionStatus.Login === inProgress}
				disabled={InteractionStatus.Login === inProgress}
			>
				login
			</Button>
		</>
	);
};
