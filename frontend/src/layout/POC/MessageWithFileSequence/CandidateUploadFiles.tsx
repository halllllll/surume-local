import { UploadFiles } from "@/component/button/UploadFiles";
import { SelectedFileField } from "@/view/SelectedFileField";
import { Box, useToast } from "@chakra-ui/react";
import type { FC } from "react";

type Props = {
	files: File[];
	setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};
export const CnadidateUploadFiles: FC<Props> = ({ files, setFiles }) => {
	const toast = useToast();
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// validation
		const MAX_FILE_COUNT = 10;
		const MAX_FILE_SIZE = 1024 * 1024 * 8;
		const MAX_FILES_SIZE = 1024 * 1024 * 30;
		if (event.target.files && event.target.files.length > 0) {
			if (event.target.files.length > MAX_FILE_COUNT) {
				toast({
					status: "error",
					title: " Gula",
					description: `添付できるファイル上限数（${MAX_FILE_COUNT}）を超えています`,
				});
				return;
			}
			const selectedFileList = event.target.files;
			let selectedFiles: File[] = [];
			for (let i = 0; i < selectedFileList.length; i++) {
				selectedFiles = [...selectedFiles, selectedFileList[i]];
			}

			if (selectedFiles.every((f) => f.size > MAX_FILE_SIZE)) {
				toast({
					status: "error",
					title: " Gula",
					description: `添付できるファイルあたりサイズ上限（${MAX_FILE_SIZE} byte）を超えています`,
				});
				return;
			}
			if (
				selectedFiles
					.map((f) => f.size)
					.reduce((cur, pre) => {
						return cur + pre;
					}) > MAX_FILES_SIZE
			) {
				toast({
					status: "error",
					title: " Gula",
					description: `添付できるファイルのサイズ総量（${MAX_FILES_SIZE} byte）を超えています`,
				});
				return;
			}
			setFiles(selectedFiles);
		}
	};
	return (
		<>
			<UploadFiles handler={handleFileChange} files={files} />
			{files.length > 0 && (
				<Box>
					<SelectedFileField files={files} />
				</Box>
			)}
		</>
	);
};
