import type { FC, ReactNode } from "react";

import {
	BrowserCacheLocation,
	LogLevel,
	PublicClientApplication,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { useSurumeContext } from "@/hooks/context";

export type AuthProperties = {
	auth: {
		clientId: string;
		authority: string;
		redirectUri: string;
	};
};

export const createMsalClient = (auth: AuthProperties) => {
	const msalClient = new PublicClientApplication({
		...auth,
		cache: {
			cacheLocation: BrowserCacheLocation.SessionStorage,
			storeAuthStateInCookie: true,
		},
		system: {
			loggerOptions: {
				logLevel: LogLevel.Trace,
				loggerCallback: (level, message, containsPii) => {
					if (containsPii) {
						return;
					}
					switch (level) {
						case LogLevel.Error:
							console.error(message);
							return;
						case LogLevel.Info:
							console.info(message);
							return;
						case LogLevel.Verbose:
							console.debug(message);
							return;
						case LogLevel.Warning:
							console.warn(message);
							return;
						default:
							console.log(message);
							return;
					}
				},
			},
		},
	});

	return msalClient;
};

export const MsalClientProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { surumeCtx } = useSurumeContext();
	const msalClient = createMsalClient({
		auth: {
			clientId: surumeCtx.client_id,
			authority: `https://login.microsoftonline.com/${surumeCtx.authority}`,
			// redirectUri: surumeCtx.redirect_uri_localhost_port,
			redirectUri: `http://localhost:${surumeCtx.redirect_uri_localhost_port}${
				import.meta.env.VITE_AZURE_REDIRECT_URI_PATH
			}`,
		},
	});
	return <MsalProvider instance={msalClient}>{children}</MsalProvider>;
};
