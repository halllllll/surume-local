import { useSurumeContext } from "@/hooks/context";
import { useMsal } from "@azure/msal-react";
import { MinusIcon } from "@chakra-ui/icons";
import { Button, MenuItem } from "@chakra-ui/react";

export const LogoutButton = () => {
	const { setSurumeCtx } = useSurumeContext();
	const { instance } = useMsal();
	const handleLogout = async () => {
		setSurumeCtx({ type: "ResetBelongingChat" });
		instance
			.logoutPopup({
				mainWindowRedirectUri: "/",
				account: instance.getActiveAccount(),
			})
			.catch((err) => {
				console.error(err);
				throw new Error(err);
			});
	};

	return (
		<>
			<Button onClick={() => handleLogout()}>logout</Button>
		</>
	);
};

export const LogoutMenuItem = () => {
	const { instance } = useMsal();
	const handleLogout = async () => {
		instance
			.logoutPopup({
				mainWindowRedirectUri: "/",
				account: instance.getActiveAccount(),
			})
			.catch((err) => {
				console.error(err);
				throw new Error(err);
			});
	};

	return (
		<>
			<MenuItem icon={<MinusIcon />} onClick={() => handleLogout()}>
				Logout
			</MenuItem>
		</>
	);
};
