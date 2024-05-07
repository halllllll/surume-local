import type { DriveItem } from "@/service/drive/type";
import {
	Alert,
	AlertIcon,
	Box,
	Center,
	Divider,
	Heading,
	VStack,
	Text,
	Input,
} from "@chakra-ui/react";
import { useState, type FC } from "react";
import { CreateFolder } from "./CreateFolder";
import { CheckingFolder } from "./CheckingFolder";
import { CnadidateUploadFiles } from "./CandidateUploadFiles";
import { Upload } from "./UploadButton";

const Intro: FC = () => {
	return (
		<VStack>
			<Center>
				<Heading as={"h2"}>Checking Folder</Heading>
			</Center>
			<Box w="max-content">
				<Alert status="info">
					<AlertIcon />
					here is developmental poc view, so including a log of bugs🐛
				</Alert>
			</Box>
			<Divider />
		</VStack>
	);
};

export const FolderUtilRoot: FC = () => {
	const [targetDriveItem, setTargetDriveItem] = useState<DriveItem | null>(
		null,
	);
	const [createdDriveItem, setCreateDriveItem] = useState<DriveItem | null>(
		null,
	);
	const [candidateFiles, setCandidateFiles] = useState<File[]>([]);
	const [updatedDriveItems, setUpdatedDriveItems] = useState<DriveItem[]>([]);
	const updateDriveItemHandler = (d: DriveItem) => {
		setUpdatedDriveItems((prev) => [...prev, d]);
	};

	return (
		<>
			<Intro />
			<Box p={5}>
				<Heading as={"h3"} size={"md"}>
					{"Check exist upload dist folder name (JUST BENEATH OneDrive root)"}
				</Heading>
				<VStack gap={10}>
					<CheckingFolder setDriveItem={setTargetDriveItem} />
					{targetDriveItem ? (
						<CreateFolder
							driveItem={targetDriveItem}
							setCreatedDriveItem={setCreateDriveItem}
						/>
					) : (
						<Text>nothing target drive</Text>
					)}
					{createdDriveItem && (
						<Box p={5}>
							<Text>{"created drive:"}</Text>
							<Text>{`eTag: ${createdDriveItem.eTag}`}</Text>
							<Text>{`cTag: ${createdDriveItem.cTag}`}</Text>
							<Text>{`ID: ${createdDriveItem.id}`}</Text>
							<Text>{`URL: ${createdDriveItem.webUrl}`}</Text>
						</Box>
					)}
					{targetDriveItem && createdDriveItem && (
						<CnadidateUploadFiles
							files={candidateFiles}
							setFiles={setCandidateFiles}
						/>
					)}
					{createdDriveItem && candidateFiles.length > 0 && (
						<Upload
							distDriveItem={createdDriveItem}
							files={candidateFiles}
							setUploadedDriveItem={updateDriveItemHandler}
						/>
					)}
					{updatedDriveItems.length > 0 && (
						<Box>
							<Heading>updated drive items list</Heading>
							{updatedDriveItems.map((d, idx) => {
								return (
									<Box key={d.id}>
										<Text>{`${idx}`} -- </Text>
										<Box p={3}>
											<Text>{`ID: ${d.id}`}</Text>
											<Text>{`eTag: ${d.eTag}`}</Text>
											<Text>{`Name: ${d.name}`}</Text>
											<Text>{`CreatedAt: ${d.createdDateTime}`}</Text>
										</Box>
										<Divider />
									</Box>
								);
							})}
						</Box>
					)}

					<Input />
				</VStack>
			</Box>
		</>
	);
};
