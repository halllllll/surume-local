import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { FC } from "react";

export const FolderIdForm: FC<{ onClose: () => void }> = (/*{ onClose }*/) => {
  return (
    <>
      <ModalCloseButton />
      <ModalBody>
        <Box>
          <VStack>
            <Text mb={5}>Register folder name for upload files to chats.</Text>
            <Alert status="warning">
              <AlertIcon />
              Folder MUST be exist JUST BENEATH the root of your OneDrive
            </Alert>
          </VStack>
        </Box>
      </ModalBody>
      <ModalFooter>
        <HStack>
          <Button type="submit">Save</Button>
          {/* <Button onClick={onClose}>Cancel</Button> */}
        </HStack>
      </ModalFooter>
    </>
  );
};
