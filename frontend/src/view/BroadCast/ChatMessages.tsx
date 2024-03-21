import { useSurumeContext } from "@/context/hook";
import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { type FC } from "react";
import parse from "html-react-parser";

type Prop = {
  scrollTarget: React.RefObject<HTMLDivElement>;
};

export const ChatMessages: FC<Prop> = (props) => {
  const { surumeCtx } = useSurumeContext();
  const messages = surumeCtx.chat_messages;
  if (messages.length === 0) return null;
  const scrollTarget = props.scrollTarget;

  const tableHeaderBg = useColorModeValue("white", "gray.800");
  const contentBg = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      <Box overflowX="auto" overflowY="auto" maxHeight={500} my={5}>
        <div ref={scrollTarget} />
        <Table>
          <Thead position={"sticky"} top="0" bgColor={tableHeaderBg}>
            <Tr>
              <Th scope={"col"}>No.</Th>
              <Th scope={"col"}>target</Th>
              <Th scope={"col"}>Chat ID</Th>
              <Th scope={"col"}>Content(pseudo)</Th>
              <Th scope={"col"}>Status</Th>
              <Th scope={"col"}>URL</Th>
            </Tr>
          </Thead>
          <Tbody>
            {messages.map((v, i) => {
              return (
                <Tr key={`${v.chatId}_${v.indexOrder}`} borderWidth={"1px"}>
                  <Td>{i + 1}</Td>
                  <Td>
                    <Box maxW={"140px"} overflow={"hidden"}>
                      <Text isTruncated>{v.name}</Text>
                    </Box>
                  </Td>
                  <Td>
                    <Box maxW={"100px"} overflow={"hidden"}>
                      <Tooltip label={v.chatId} placement="auto">
                        <Text isTruncated>{v.chatId}</Text>
                      </Tooltip>
                    </Box>
                  </Td>
                  <Td>
                    <Box
                      // maxW={"450px"}
                      maxH={"120px"}
                      overflowY={"scroll"}
                      //overflowX={"hidden"}
                      p={2}
                      bg={contentBg}
                    >
                      {parse(v.content, { trim: false })}
                    </Box>
                  </Td>
                  <Td
                    bgColor={
                      v.status === "Sending"
                        ? "gray.300"
                        : v.status === "Failed"
                        ? "red"
                        : v.status === "Success"
                        ? "skyblue"
                        : "white"
                    }
                  >
                    {v.status}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};
