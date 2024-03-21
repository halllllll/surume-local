import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { type FC } from "react";

import { InitForm } from "./init";

type Props = {
  initialRef: React.RefObject<HTMLInputElement>;
  isOpen: boolean;
  onClose: () => void;
};

export const InitModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      allowPinchZoom={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Init Surume</ModalHeader>
        <InitForm onClose={onClose} />
      </ModalContent>
    </Modal>
  );
};
