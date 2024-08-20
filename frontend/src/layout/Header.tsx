import {
	Box,
	Flex,
	Heading,
	Spacer,
	Text,
	Image,
	HStack,
} from "@chakra-ui/react";
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
				mt={4}
			>
				{children}
				<Spacer />
				<Heading height={"100px"}>
					<Link to="/">
						<HStack gap={4}>
							<Text>Surume</Text>
							<Image src={"../../public/surume.svg"} boxSize={"60px"} />
						</HStack>
					</Link>
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
