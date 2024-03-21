import { paths } from "@/types/oas";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import createClient, { Middleware } from "openapi-fetch";
import { getEntraIdInfo } from "./entraid_info_api/functions";
import { AuthProperties, createMsalClient } from "@/providers/msalProvider";

export const AppRequests = {
	scopes: [
		"user.read",
		"chat.read",
		"chat.readbasic",
		"chat.readwrite",
		"files.read.all",
		"files.readwrite.all",
	],
};

export const getAccessToken = async () => {
	const data = await getEntraIdInfo();
	if (!(data.success && data.exist)) throw new Error("no auth data");
	const auth: AuthProperties = {
		auth: {
			clientId: data.data.clientid,
			authority: `https://login.microsoftonline.com/${data.data.authority}`,
			redirectUri: data.data.port.toString(),
		},
	};
	const instance = createMsalClient(auth);
	await instance.initialize();
	const accounts = instance.getAllAccounts();
	// await Promise.resolve(); // https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/5796#issuecomment-1763461620
	try {
		const silentReq = await instance.acquireTokenSilent({
			...AppRequests,
			account: accounts[0],
		});
		return silentReq.accessToken;
	} catch (err: unknown) {
		// InteractionRequiredAuthError エラーの場合、再度リダイレクトで認証させる
		if (err instanceof InteractionRequiredAuthError) {
			return instance.acquireTokenRedirect(AppRequests);
		}
		throw err;
	}
};

const authMiddleware: Middleware = {
	async onRequest(req) {
		const at = await getAccessToken();
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
