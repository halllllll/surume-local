import { ErrorFallback } from "@/errors/ErrorFallback";
import { useGetChatsPaginate } from "@/service/chats";
import {
  Box,
  Button,
  Flex,
  Link,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Suspense, useState, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Excel from "exceljs";
import { saveAs } from "file-saver";

const DownloadLink: FC = () => {
  const { data, isPending, hasNextPage, fetchNextPage, error } =
    useGetChatsPaginate();
  console.error(error);
  const [onSave, setOnSave] = useState<boolean>(false);
  if (hasNextPage) {
    fetchNextPage();
  } else {
    // TODO: Contextに保存
    // setSurumeCtx({ type: "SetBelongingChat", payload: data });
  }
  const bg = useColorModeValue("white", "gray.800");

  const save = async () => {
    setOnSave(false);
    const workbook = new Excel.Workbook();
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet("chats");
    worksheet.columns = [
      { header: "name", key: "topic" },
      { header: "id", key: "id" },
      { header: "type", key: "type" },
      { header: "url", key: "url" },
    ];
    worksheet.addRows(
      data.result.map((v) => {
        return { topic: v?.topic, id: v?.id, type: v?.type, url: v?.url };
      })
    );
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "allchats.xlsx");
    setOnSave(true);
  };
  const count = data.count;
  return (
    <Box>
      {isPending ? (
        <Flex>
          <Text>{`processing... current count: ${count}`}</Text>
          <Spinner size="sm" />
        </Flex>
      ) : (
        <>
          <Flex mb={4}>
            <Text>{`done count: ${count}`}</Text>
            {!hasNextPage && (
              <>
                <Spacer />
                <Button onClick={save} disabled={onSave}>
                  download xlsx
                </Button>
              </>
            )}
          </Flex>
          <Box width="100%" overflowX="auto" overflowY="auto" maxHeight={500}>
            <Table size={"sm"}>
              <Thead position={"sticky"} top="0" bgColor={bg}>
                <Tr>
                  <Th scope="col">No.</Th>
                  <Th scope="col">Type</Th>
                  <Th
                    scope="col"
                    width={"100px"}
                    wordBreak={"break-word"}
                    overflowWrap={"anywhere"}
                  >
                    ID
                  </Th>
                  <Th scope="col">topic</Th>
                  <Th scope="col">createdat</Th>
                  <Th scope="col">updatedat</Th>
                  <Th scope="col">url</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.result.map((v, idx) => {
                  return (
                    <Tr key={v?.id}>
                      <Td>{idx + 1}</Td>
                      <Td>{v?.type}</Td>
                      <Td width={"100px"}>{v?.id}</Td>
                      <Td>{v?.topic}</Td>
                      <Td>{v?.createdat}</Td>
                      <Td>{v?.updatedat}</Td>
                      {v?.url && (
                        <Td>
                          <Link href={v.url} isExternal>
                            {v.url}
                          </Link>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export const ChatListContent: FC = () => {
  return (
    <Box>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<h2>wait...</h2>}>
          <DownloadLink />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
