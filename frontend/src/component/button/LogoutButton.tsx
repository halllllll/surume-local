import { useMsal } from "@azure/msal-react";
import { SettingsIcon } from "@chakra-ui/icons";
import { Button, MenuItem } from "@chakra-ui/react";

export const LogoutButton = () => {
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
      <MenuItem icon={<SettingsIcon />} onClick={() => handleLogout()}>
        Logout
      </MenuItem>
    </>
  );
};
