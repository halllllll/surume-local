import { AppRequests } from "@/service/graphClient";
import type { AccountInfo } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useMemo, useCallback } from "react";

export const useAzureAuth = () => {
	const { instance, accounts, inProgress } = useMsal();
	const isAuthenticated = useIsAuthenticated();

	const userId = useMemo(() => {
		const account: AccountInfo = accounts[0];
		if (account?.idTokenClaims) {
			return account.idTokenClaims.sub || "";
		}
		return "";
	}, [accounts]);

	const logoutAzure = useCallback(async () => {
		instance.logout();
	}, [instance]);

	return { logoutAzure, inProgress, userId, isAuthenticated };
};

export const useAzureAuthLogin = (redilect_uri: string) => {
	console.log(`redirect uri?? ${redilect_uri}`);
	const { instance, inProgress } = useMsal();

	const loginAzure = useCallback(async () => {
		instance.loginPopup(AppRequests);
	}, [instance]);

	return { loginAzure, inProgress };
};
