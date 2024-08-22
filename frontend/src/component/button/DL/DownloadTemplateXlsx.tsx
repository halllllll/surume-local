import type { FC } from "react";
import { Button, Link } from "@chakra-ui/react";
import type { XlsxTemplateFilePath } from "./path";

export const DownloadTemplateXlsxButton: FC<{ path: XlsxTemplateFilePath }> = ({
	path,
}) => {
	// TODO: null必要？
	if (!path) return null;
	return (
		<Button>
			<Link href={path} download={true}>
				Download Template File (xlsx)
			</Link>
		</Button>
	);
};
