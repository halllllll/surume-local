import { type FC, useEffect } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/errors/ErrorFallback";
import { LoginRoot } from "@/view/LoginRoot";
import { ServerError } from "@azure/msal-browser";
import { useLoaderData } from "react-router-dom";
import { GetEntraIdInfoResponse } from "@/service/entraid_info_api/type";
import { Center, Text } from "@chakra-ui/react";
import { Reload } from "@/component/button/Reload";
import { useSurumeContext } from "@/context/hook";
import { ManageRoot } from "@/view/ManageRoot";

export const Home: FC = () => {
  const entraidInfo = useLoaderData() as GetEntraIdInfoResponse;

  console.log("ok?");
  if (!entraidInfo.success) {
    throw new ServerError(entraidInfo.error);
  }
  if (!entraidInfo.exist) {
    return (
      <Center>
        <Text>set entra id info</Text>
        <Reload />
      </Center>
    );
  }

  // contextにentra id infoをset
  // （ほかにもっといい方法ありそう)
  const { setSurumeCtx } = useSurumeContext();

  useEffect(() => {
    setSurumeCtx({
      type: "SetEntraIdInfo",
      payload: {
        ...entraidInfo.data,
      },
    });
  }, [entraidInfo.data, setSurumeCtx]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthenticatedTemplate>
        <ManageRoot />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginRoot />
        </ErrorBoundary>
      </UnauthenticatedTemplate>
    </ErrorBoundary>
  );
};
