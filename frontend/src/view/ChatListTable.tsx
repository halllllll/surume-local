import type { ChatsAPIResponse } from "@/service/chats/type";
import {
	Box,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Link,
	useColorModeValue,
} from "@chakra-ui/react";
import saveAs from "file-saver";
import type { FC } from "react";
import Excel from "exceljs";

export const save = async (data: ChatsAPIResponse["value"]) => {
	if (!data) {
		console.error("no data");
	}
	const workbook = new Excel.Workbook();
	workbook.created = new Date();
	const worksheet = workbook.addWorksheet("chats");
	worksheet.columns = [
		{ header: "name", key: "topic" },
		{ header: "id", key: "id" },
		{ header: "type", key: "type" },
		{ header: "url", key: "url" },
	];
	worksheet.addRows(
		data?.map((v) => {
			return {
				topic: v?.topic,
				id: v?.id,
				type: v?.chatType,
				url: v?.webUrl,
			};
		}) ?? ["no data"],
	);
	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer]), "allchats.xlsx");
};

export const ChatListTable: FC<{ data: ChatsAPIResponse["value"] }> = ({
	data,
}) => {
	const bg = useColorModeValue("white", "gray.800");

	return (
		<Box width="100%" /*overflowX="auto"*/ overflowY="auto" maxHeight={500}>
			<Table size={"sm"}>
				<Thead position={"sticky"} top="0" bgColor={bg}>
					<Tr>
						<Th scope="col">No.</Th>
						<Th scope="col" minW={"80px"}>
							Type
						</Th>
						<Th scope="col" minW={"200px"}>
							ID
						</Th>
						<Th scope="col">topic</Th>
						<Th scope="col">createdate</Th>
						<Th scope="col">updatedate</Th>
						<Th scope="col">url</Th>
					</Tr>
				</Thead>
				<Tbody>
					{data?.map((v, idx) => {
						return (
							<Tr key={v?.id}>
								<Td>{idx + 1}</Td>
								<Td overflowWrap={"anywhere"}>{v?.chatType}</Td>
								<Td overflowWrap={"anywhere"}>{v?.id}</Td>
								<Td>{v?.topic}</Td>
								<Td>{v?.createdDateTime}</Td>
								<Td>{v?.lastUpdatedDateTime}</Td>
								{v?.webUrl && (
									<Td>
										<Link href={v?.webUrl} isExternal>
											{v.webUrl}
										</Link>
									</Td>
								)}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</Box>
	);
};
