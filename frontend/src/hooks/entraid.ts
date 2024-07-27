import { AppRequests } from "@/service/graphClient";
import { InteractionStatus, type AccountInfo } from "@azure/msal-browser";
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

export const useAzureAuthLogin = () => {
	const { instance, inProgress } = useMsal();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const loginAzure = useCallback(async () => {
		if (inProgress === InteractionStatus.None) {
			await instance.loginPopup(AppRequests);
		}
	}, [instance]);

	return { loginAzure, inProgress };
};
