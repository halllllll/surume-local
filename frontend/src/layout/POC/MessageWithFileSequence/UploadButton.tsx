import { useUploadFiles } from "@/service/drive";
import type { DriveItem } from "@/service/drive/type";
import { getAccessToken } from "@/service/graphClient";
import { useMsal } from "@azure/msal-react";
import { Button, useToast } from "@chakra-ui/react";
import type { FC } from "react";

type Props = {
	distDriveItem: DriveItem;
	files: File[];
	setUploadedDriveItem: (item: DriveItem) => void;
};
export const Upload: FC<Props> = ({
	distDriveItem,
	files,
	setUploadedDriveItem,
}) => {
	const { mutate: uploadFile, isPending } =
		useUploadFiles(setUploadedDriveItem);
	const { instance } = useMsal();
	const toast = useToast();

	const uploadHandler = async () => {
		const { accessToken } = await getAccessToken(instance);
		// TODO: 絞り込みがよくわからない
		const parentDriveId = distDriveItem.parentReference?.driveId as string;
		files.forEach((f, _idx) => {
			uploadFile(
				{
					token: accessToken,
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					distDriveItemId: distDriveItem!.id!,
					distParentId: parentDriveId,
					file: f,
				},
				{
					onSettled: (_data) => {},
					onSuccess: (_data) => {
						toast({
							title: "DONE",
							description: "done",
							status: "success",
						});
					},
					onError: (err) => {
						console.error(err);
						toast({
							title: "Error",
							description: `${err.name} - ${err.message}`,
							status: "error",
						});
					},
				},
			);
		});
	};
	return (
		<Button
			onClick={uploadHandler}
			isDisabled={isPending}
			isLoading={isPending}
		>
			Upload
		</Button>
	);
};
