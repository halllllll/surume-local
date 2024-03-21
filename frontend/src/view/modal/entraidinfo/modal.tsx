import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/errors/ErrorFallback";

import { EntraIdForm } from "./formRoot";

type Props = {
  initialRef: React.RefObject<HTMLInputElement>;
  isOpen: boolean;
  onClose: () => void;
};

export const EntraIdModal: FC<Props> = (props) => {
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
        <ModalHeader>Entra Id Info</ModalHeader>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
              <Suspense fallback={<div>loading...</div>}>
                <EntraIdForm onClose={onClose} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </ModalContent>
    </Modal>
  );
};
