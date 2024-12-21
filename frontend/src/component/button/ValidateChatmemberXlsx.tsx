import { Stack, Input, Button } from "@chakra-ui/react";
import type { FC } from "react";

export const ValidateXlsx: FC<{
	inputFileChangeHandle: (
		event: React.ChangeEvent<HTMLInputElement>,
	) => Promise<void>;
	btnText?: string;
	isDisabled?: boolean;
}> = ({
	inputFileChangeHandle,
	btnText = "Validate XLSX",
	isDisabled = true,
}) => {
	return (
		<Stack direction="row" spacing={4} align="center">
			<Input
				type="file"
				hidden // ファイルアップロードのためにinput要素を非表示にする
				id="surumeXlsxTemplateUpload"
				onChange={() => inputFileChangeHandle}
				accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
			/>
			<Button
				as="label"
				htmlFor="surumeXlsxTemplateUpload"
				variant="solid"
				colorScheme="teal"
				isDisabled={isDisabled}
				isLoading={isDisabled}
			>
				{btnText}
			</Button>
		</Stack>
	);
};
