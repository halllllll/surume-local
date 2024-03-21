import { FormatedChatMessageData } from "@/types/types";
import { Box, Flex, VStack, Spacer, Text } from "@chakra-ui/react";
import { type FC } from "react";

type Props = {
  data: FormatedChatMessageData[];
};
export const FireCount: FC<Props> = (props) => {
  const data = props.data;
  const [all, success] = [
    data.length,
    data.filter((v) => v.status === "Success").length,
  ];
  return (
    <Box>
      <Flex>
        <Spacer />
        <VStack alignItems={"end"}>
          <Text>{`Count: ${all}`}</Text>
          {success > 0 && <Text>{`Successed: ${success}`}</Text>}
        </VStack>
      </Flex>
    </Box>
  );
};
