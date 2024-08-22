import type { FC } from "react";
import { Button, Link } from "@chakra-ui/react";
import type { XlsxTemplateFilePath } from "./path";

export const DownloadTemplateXlsxButton: FC<{ path: XlsxTemplateFilePath }> = ({
	path,
}) => {
	// TODO: XlsxTemplateFilePathからundefined and nullを除いた型定義
	let file = "";
	if (!path) return null;
	switch (path) {
		case "/static/surume.xlsx":
			file = "/static/surume.xlsx";
	}
	return (
		<Button>
			<Link href={file} download={true}>
				Download Template File (xlsx)
			</Link>
		</Button>
	);
};
