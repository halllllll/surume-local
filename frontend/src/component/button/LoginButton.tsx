import { useMsal, useMsalAuthentication } from "@azure/msal-react";
// import { loginRequest } from "@/providers/msalProvider";
import { AppRequests } from "@/service/graphClient";
import { Button } from "@chakra-ui/react";
import { useSurumeContext } from "@/context/hook";
import { InteractionRequiredAuthError, InteractionStatus, InteractionType } from "@azure/msal-browser";
import { FC, useEffect, useState } from "react";


function LoadingComponent() {
	return <p>Authentication in progress...</p>;
}

type Props = {
	loginBtnToggle: React.Dispatch<React.SetStateAction<boolean>>
}
const LoginProcess:FC<Props> = ({ loginBtnToggle: toggle}) => {
	const { surumeCtx,  setSurumeCtx } = useSurumeContext();
	const { inProgress } = useMsal();
  const { login, result, error } = useMsalAuthentication(InteractionType.Popup,{scopes: AppRequests.scopes, redirectUri: `http://localhost:${surumeCtx.redirect_uri_localhost_port}/redirect`}); // TODO: FQDN
  useEffect(() => {
    if (error instanceof InteractionRequiredAuthError) {
      login(InteractionType.Popup);
    }
  }, [error, login]);
	console.log(`progress? ${inProgress}`)

  if (inProgress !== InteractionStatus.None){ return <LoadingComponent />;
	}
	if(inProgress === InteractionStatus.None){
		toggle(false)
	}
if(result){
	toggle(false)
	setSurumeCtx({
		type: "SetAccessToken",
		payload: { accessToken: result.accessToken },
	});
}

return <>{inProgress}</>;
}

export const LoginButton = () => {
	const [clickLoginBtn, setClickLoginBtn] = useState<boolean>(false)
	const _clickloginbutton = () => {
		setClickLoginBtn(true)
	}

	return (
		<>
			<Button colorScheme="teal" onClick={_clickloginbutton} isLoading={clickLoginBtn} disabled={clickLoginBtn}>
				login
			</Button>
			{clickLoginBtn && (
				<LoginProcess loginBtnToggle={setClickLoginBtn}/>
				)
			}
		</>
	);
};
