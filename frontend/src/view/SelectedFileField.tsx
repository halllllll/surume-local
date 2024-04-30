import { FileIcon } from "@/component/icons/filetype";
import {
  Box,
  SimpleGrid,
  HStack,
  Spacer,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import type { FC } from "react";

type Props = {
  files: File[];
};
export const SelectedFileField: FC<Props> = ({ files }) => {
  if (!files.length) return <></>;
  return (
    <Box minW={"60vw"}>
      <Text>selected files</Text>
      <Box borderRadius={10} borderColor={"gray.300"} borderWidth={2} p={3}>
        <Box /*maxHeight={"500px"} */>
          <SimpleGrid
            minChildWidth="180px"
            textAlign={"left"}
            justifyContent={"center"}
            alignContent={"center"}
            spacing="5"
          >
            {files.map((f) => {
              return (
                <Box
                  rounded={"lg"}
                  borderColor={"ActiveBorder"}
                  borderWidth={"1px"}
                  p={2}
                  minH={"5vh"}
                  maxW={"20vw"}
                  key={f.name}
                >
                  <HStack spacing={"2px"}>
                    <Box>{FileIcon(f)}</Box>
                    <Spacer />
                    <Box overflow={"hidden"}>
                      <Tooltip
                        label={f.name}
                        placement={"top"}
                        hasArrow
                        aria-label="file name"
                        closeDelay={400}
                      >
                        <Box
                          // overflowX="auto"
                          // overflowY="auto"
                          fontWeight={"bold"}
                          isTruncated
                        >
                          {f.name}
                        </Box>
                      </Tooltip>
                    </Box>
                  </HStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};
