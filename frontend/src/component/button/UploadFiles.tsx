import { VStack, Input, Button, Box } from "@chakra-ui/react";
import type { FC } from "react";

const accepteFileType = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/pdf",
  "text/plain",
  "applicaiton/zip",
  "image/png",
  "image/jpeg",
  "image/gif",
  "video/mpeg",
  "text/csv",
];

type Props = {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[];
};

export const UploadFiles: FC<Props> = ({ handler, files }) => {
  return (
    <Box>
      <VStack spacing={4}>
        <Input
          type="file"
          multiple
          hidden // input要素を非表示にする
          id="addFile"
          onChange={handler}
          accept={accepteFileType.join(",")}
        />
        <Button
          as="label"
          htmlFor="addFile"
          variant="solid"
          colorScheme="teal"
          isDisabled={files.length >= 10}
          // isLoading={disabled}
        >
          Add Chats File
        </Button>
      </VStack>
    </Box>
  );
};
