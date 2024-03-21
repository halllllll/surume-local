import { type FC } from "react";
import {
	IconButton,
	IconButtonProps,
	Tooltip,
	useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const ColorSwitchButton: FC<IconButtonProps> = (props) => {
	const { colorMode, toggleColorMode } = useColorMode();
	const tooltipLabel = colorMode === "light" ? "darker" : "lighter";
	return (
		<Tooltip label={tooltipLabel}>
			<IconButton
				{...props}
				icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
				onClick={toggleColorMode}
			/>
		</Tooltip>
	);
};
