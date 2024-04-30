import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "@/providers/msalProvider";
import { AppRequests } from "@/service/graphClient";
import { Button } from "@chakra-ui/react";
import { useSurumeContext } from "@/context/hook";
import type { AuthenticationResult } from "@azure/msal-browser";

export const LoginButton = () => {
	const { setSurumeCtx } = useSurumeContext();
	const { instance } = useMsal();
	// const isAuthenticated = useIsAuthenticated();
	const handleLogin = async () => {
		// useEffect(() => {
		// 	const login = async () => {
		// 		if (!isAuthenticated && inProgress === InteractionStatus.None) {
		// 			const resp: AuthenticationResult = await instance.loginPopup({
		// 				...AppRequests,
		// 				redirectUri: "/redirect",
		// 			});
		// 			setSurumeCtx({
		// 				type: "SetAccessToken",
		// 				payload: { accessToken: resp.accessToken },
		// 			});
		// 		}
		// 	};
		// 	login();
		// }, [isAuthenticated, instance]);

		// instance
		//   .loginPopup({
		//     ...AppRequests,
		//     redirectUri: "/redirect",
		//   })
		//   .then((resp: AuthenticationResult) => {
		//     setSurumeCtx({
		//       type: "SetAccessToken",
		//       payload: { accessToken: resp.accessToken },
		//     });
		//   })
		//   .catch((err) => {
		//     console.error(err);
		//     // TODO: エラー処理
		//     throw new Error(err);
		//   });

		// no
		try {
			const resp: AuthenticationResult = await instance.loginPopup({
				...AppRequests,
				redirectUri: "/redirect",
			});
			setSurumeCtx({
				type: "SetAccessToken",
				payload: { accessToken: resp.accessToken },
			});
			// TODO: save acountid(username) to DB
		} catch (e: unknown) {
			const err = e as Error;
			console.error(err);
			// TODO: エラー処理
			throw err;
		}
	};

	return (
		<>
			<Button colorScheme="teal" onClick={() => handleLogin()}>
				login
			</Button>
		</>
	);
};
