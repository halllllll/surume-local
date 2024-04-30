import { Modal, ModalOverlay, ModalContent, ModalHeader } from '@chakra-ui/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/errors/ErrorFallback';

import { FolderIdForm } from './formRoot';

type Props = {
  initialRef: React.RefObject<HTMLInputElement>;
  isOpen: boolean;
  onClose: () => void;
};

export const FolderIdModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} allowPinchZoom={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>OneDrive Folder ID for File Upload</ModalHeader>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
              <Suspense fallback={<div>loading...</div>}>
                <FolderIdForm onClose={onClose} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </ModalContent>
    </Modal>
  );
};
