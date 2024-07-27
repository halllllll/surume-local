import { Box, Flex, Heading, Spacer } from "@chakra-ui/react";
import type { ReactNode, FC } from "react";
import { ColorSwitchButton } from "@/component/button/ColorSwitch";
import { Link } from "react-router-dom";

export const Header: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<Box>
			<Flex
				align="center"
				pos="relative"
				justify="center"
				boxSize="full"
				position="static"
				height="20"
			>
				{children}
				<Spacer />
				<Heading>
					<Link to="/">Surume</Link>
				</Heading>
				<Spacer />
				<ColorSwitchButton
					aria-label={"switch dark-light mode"}
					marginRight={10}
				/>
			</Flex>
		</Box>
	);
};
