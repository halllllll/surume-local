import { Box, Button, Center } from "@chakra-ui/react";
import { type FC } from "react";

type Props = {
  handler: () => void;
};
export const DownloadResult: FC<Props> = ({ handler }) => {
  // TODO: exceljsを使って保存

  return (
    <Box>
      <Center>
        <Button colorScheme="teal" onClick={handler}>
          DOWNLOAD RESULT
        </Button>
      </Center>
    </Box>
  );
};
