import { useRef, type FC, useState } from "react";
import { Header } from "@/layout/Header";
import { Outlet } from "react-router-dom";
import { Box, useDisclosure } from "@chakra-ui/react";
import DrawerRoot from "@/layout/DrawerRoot";
import HeaderMenu from "@/component/button/HeaderMenuButton";
import { EntraIdModal } from "@/view/modal/entraidinfo/modal";
import { ModalType } from "@/view/modal/states";
import { InitModal } from "@/view/modal/init/modal";
import { Greet } from "./Greet";

export const BaseLayout: FC = () => {
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrowerOpen,
    onClose: onDrowerClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [targetModal, setTargetModal] = useState<ModalType>(null);
  const setModal = (t: ModalType) => {
    setTargetModal(t);
    onModalOpen();
  };
  const initialRef = useRef(null);

  return (
    <Box>
      <Header>
        <HeaderMenu onDrawerOpen={onDrowerOpen} setModal={setModal} />
      </Header>
      {isModalOpen && (
        <>
          {targetModal === "EntraId_Info" && (
            <EntraIdModal
              initialRef={initialRef}
              isOpen={isModalOpen}
              onClose={onModalClose}
            />
          )}
          {targetModal === "Delete" && (
            <InitModal
              initialRef={initialRef}
              isOpen={isModalOpen}
              onClose={onModalClose}
            />
          )}
        </>
      )}
      {isDrawerOpen && (
        <DrawerRoot isOpen={isDrawerOpen} onClose={onDrowerClose} />
      )}
      <Greet />
      <Box mx={10} pb={20}>
        <Outlet />
      </Box>
    </Box>
  );
};
