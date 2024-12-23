import type { FC } from "react";
import { Button } from "@chakra-ui/react";
import type { XlsxTemplateFilePath } from "./path";

export const DownloadTemplateXlsxButton: FC<{
	text?: string;
	path: XlsxTemplateFilePath;
}> = ({ text, path }) => {
	// TODO: null必要？
	if (!path) return null;
	return (
		<Button as={"a"} href={path} download={true} w={"fit-content"}>
			{text ?? "Download Template File (xlsx)"}
		</Button>
	);
};
