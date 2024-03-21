import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "@/providers/msalProvider";
import { AppRequests } from "@/service/graphClient";
import { Button } from "@chakra-ui/react";
import { useSurumeContext } from "@/context/hook";

export const LoginButton = () => {
  const { setSurumeCtx } = useSurumeContext();
  const { instance } = useMsal();
  const handleLogin = () => {
    instance
      .loginPopup({
        ...AppRequests,
        redirectUri: "/redirect",
      })
      .then((resp) => {
        setSurumeCtx({
          type: "SetAccessToken",
          payload: { accessToken: resp.accessToken },
        });
      })
      .catch((err) => {
        console.error(err);
        // TODO: エラー処理
        throw new Error(err);
      });
  };

  return (
    <>
      <Button colorScheme="teal" onClick={() => handleLogin()}>
        login
      </Button>
    </>
  );
};
