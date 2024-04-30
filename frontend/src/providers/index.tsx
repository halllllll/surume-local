import type { FC } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { SurumeProvider } from "@/context/hook";
import { QueryProvider } from "./queryProvider";
import { theme } from "./theme";
import { MsalClientProvider } from "./msalProvider";
import { ReactRouterProvider } from "./routeProvider";

export const Providers: FC = () => {
  return (
    <SurumeProvider>
      <ChakraProvider theme={theme}>
        <QueryProvider>
          <MsalClientProvider>
            <ReactRouterProvider />
          </MsalClientProvider>
        </QueryProvider>
      </ChakraProvider>
    </SurumeProvider>
  );
};
