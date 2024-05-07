import { useCurFormatedTime } from "@/hooks/curFormatTime";
import { useCreateFolder } from "@/service/drive";
import type { DriveItem, EssentialFolderParts } from "@/service/drive/type";
import { getAccessToken } from "@/service/graphClient";
import { useMsal } from "@azure/msal-react";
import {
	Box,
	Text,
	List,
	ListItem,
	Divider,
	Button,
	useToast,
} from "@chakra-ui/react";
import type { FC } from "react";

type Props = {
	driveItem: DriveItem;
	setCreatedDriveItem: React.Dispatch<React.SetStateAction<DriveItem | null>>;
};
export const CreateFolder: FC<Props> = ({ driveItem, setCreatedDriveItem }) => {
	const { instance } = useMsal();
	const toast = useToast();
	const { curFormattedTime: genNow } = useCurFormatedTime();
	const {
		mutate: createMutate,
		isPending: createIsPending,
		status,
	} = useCreateFolder();

	const onButtonPush = async () => {
		const { accessToken } = await getAccessToken(instance);
		const displayDate = genNow();
		const folderName = `surume_${displayDate}`;
		const data: EssentialFolderParts = {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			parentFolderId: driveItem!.parentReference!.driveId as string,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			targetFolderId: driveItem!.id as string,
			folderName: folderName,
		};
		createMutate(
			{ data, token: accessToken },
			{
				onSettled: () => {},
				onSuccess: (data, arg) => {
					toast({
						title: `create folder "${arg.data.folderName} !"`,
						description: `url: ${data.webUrl}`,
						status: "info",
						isClosable: true,
						duration: 3000,
					});
					setCreatedDriveItem(data);
				},
				onError: (error) => {
					toast({
						title: "Avaritia",
						description: `${error.name} - ${error.message}`,
						status: "error",
						isClosable: true,
						duration: 8000,
					});
				},
			},
		);
	};

	return (
		<Box>
			<Text>{"Drive Info"}</Text>
			<List spacing={5}>
				<ListItem>{`name: ${driveItem.name}`}</ListItem>
				<ListItem>{`including files: ${driveItem.children?.length}`}</ListItem>
				<ListItem>{`URL: ${driveItem?.webUrl}`}</ListItem>
			</List>
			<Divider p={3} />
			<Box p={3}>
				<Button
					type={"button"}
					onClick={onButtonPush}
					isLoading={createIsPending}
				>
					create new children folder
				</Button>
				{status === "success" && <Text>{"Success"}</Text>}
			</Box>
		</Box>
	);
};
