import type { paths } from "@/types/oas";
import {
	type AccountInfo,
	BrowserAuthError,
	InteractionRequiredAuthError,
} from "@azure/msal-browser";
import createClient, { type Middleware } from "openapi-fetch";
import { getEntraIdInfo } from "./entraid_info_api/functions";
import type { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

export const AppRequests = {
	scopes: [
		"user.read",
		"chat.read",
		"chat.readbasic",
		"chat.readwrite",
		"files.read",
		"files.read.all",
		"files.readwrite.all",
	],
};

export const getAccessToken = async (
	instance: IPublicClientApplication,
): Promise<{
	accessToken: string;
	accountInfo: AccountInfo;
}> => {
	const data = await getEntraIdInfo();
	if (!(data.success && data.exist)) throw new Error("no auth data");
	const accounts = instance.getAllAccounts();
	// await Promise.resolve(); // https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/5796#issuecomment-1763461620
	try {
		const silentReq = await instance.acquireTokenSilent({
			...AppRequests,
			account: accounts[0],
		});
		return { accessToken: silentReq.accessToken, accountInfo: accounts[0] };
	} catch (err: unknown) {
		// InteractionRequiredAuthError / BrowserAuthError エラーの場合、再度リダイレクトで認証させる
		if (err instanceof InteractionRequiredAuthError) {
			console.info("redirect...");
			// return instance.acquireTokenRedirect(AppRequests);
			await instance.acquireTokenRedirect(AppRequests);
		} else if (err instanceof BrowserAuthError) {
			console.info("redirect...");
			// return instance.acquireTokenRedirect(AppRequests);
			await instance.acquireTokenRedirect(AppRequests);
		}
		throw err;
	}
};

const authMiddleware: Middleware = {
	async onRequest(req) {
		const { instance } = useMsal();
		const { accessToken: at } = await getAccessToken(instance);
		req.headers.set("Authorization", `Bearer ${at}`);
		return req;
	},
};

// MS Graph APIのレスポンスエラーをハンドリングしにくいのでフェッチコードでやることにした

// const throwOnError: Middleware = {
// 	async onResponse(res) {
// 		if (res.status >= 400) {
// 			const body = res.headers.get("content-type")?.includes("json")
// 				? await res.clone().json()
// 				: await res.clone().text();
// 			throw new Error(body);
// 		}
// 		return undefined;
// 	},
// };

export const prepareClient = () => {
	const client = createClient<paths>({
		baseUrl: "https://graph.microsoft.com/v1.0",
	});
	client.use(authMiddleware);
	// client.use(throwOnError);
	return client;
};

export const prepareClientWithBearer = (token: string) => {
	const client = createClient<paths>({
		baseUrl: "https://graph.microsoft.com/v1.0",
		headers: { Authorization: `Bearer ${token}` },
	});
	// client.use(throwOnError);
	return client;
};
