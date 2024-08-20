import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const BrowserBack: FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	if (location.pathname === "/") return null;

	return (
		<Box>
			<IconButton
				size={"lg"}
				variant={"ghost"}
				icon={
					<>
						<ChevronLeftIcon />
					</>
				}
				aria-label={"browser back"}
				onClick={() => navigate(-1)}
			/>
		</Box>
	);
};
