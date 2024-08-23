import type { FC } from "react";

import {
	Heading,
	Divider,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@chakra-ui/react";

import { SingleView } from "@/view/ChatMembers/Single";
import { Bulk } from "@/view/ChatMembers/Bulk";

export const ChatMemberRoot: FC = () => {
	return (
		<>
			<Heading size={"sm"} my={3}>
				Chat Members
			</Heading>
			<Divider />
			<Tabs size="md" variant="enclosed" my={3}>
				<TabList>
					<Tab>Rapid Fire</Tab>
					<Tab>Bulk Shot</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<SingleView />
					</TabPanel>
					<TabPanel>
						<Bulk />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};
