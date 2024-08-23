import { useRef, type FC, useState } from "react";
import { Header } from "@/layout/Header";
import { Outlet } from "react-router-dom";
import { Box, Container, useDisclosure, VStack } from "@chakra-ui/react";
import DrawerRoot from "@/layout/DrawerRoot";
import HeaderMenu from "@/component/button/HeaderMenuButton";
import { EntraIdModal } from "@/view/modal/entraidinfo/modal";
import type { ModalType } from "@/view/modal/states";
import { InitModal } from "@/view/modal/init/modal";
import { Greet } from "./Greet";
import { FolderIdModal } from "@/view/modal/targetfolder/modal";
import { Footer } from "./Footer";

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
		<VStack
			height="100vh"
			overflow={{ base: "auto", xl: "hidden" }}
			_hover={{
				xl: { overflow: "auto" },
			}}
			width={{ base: "100%", xl: "calc(100% - 22rem)" }}
		>
			<Container maxW={"container.lg"} marginBottom={"auto"}>
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
						{targetModal === "UploadFolderID" && (
							<FolderIdModal
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
			</Container>
			<Footer />
		</VStack>
	);
};
