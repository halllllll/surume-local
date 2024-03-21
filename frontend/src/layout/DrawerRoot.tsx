import { type FC } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  DrawerFooter,
  DrawerCloseButton,
} from "@chakra-ui/react";

type DrowerProps = {
  isOpen: boolean;
  onClose: () => void;
};
const DrawerRoot: FC<DrowerProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen} size={"md"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Surume History</DrawerHeader>
          <DrawerBody>-- some contents</DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" form="my-form">
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerRoot;
