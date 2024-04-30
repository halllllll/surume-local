import { BrowserBack } from "@/component/button/BrowserBack";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import type { FC } from "react";

export const Greet: FC = () => {
  const { accounts } = useMsal();
  return (
    <AuthenticatedTemplate>
      <Box my={6} px={12}>
        <Flex>
          <BrowserBack />
          <Spacer />
          <Text>Hello, {accounts[0]?.username} !</Text>
        </Flex>
      </Box>
    </AuthenticatedTemplate>
  );
};
