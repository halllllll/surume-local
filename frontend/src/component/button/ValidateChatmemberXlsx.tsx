import { Stack, Input, Button } from "@chakra-ui/react";
import type { FC } from "react";

export const ValidateXlsx: FC = () => {
	return (
		<Stack direction="row" spacing={4} align="center">
			<Input
				type="file"
				hidden // input要素を非表示にする
				id="surumeXlsxTemplateUpload"
				// onChange={handleFileChange}
				accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
			/>
			<Button
				as="label"
				htmlFor="surumeXlsxTemplateUpload"
				variant="solid"
				colorScheme="teal"
				// isDisabled={disabled ?? false}
				// isLoading={disabled}
			>
				Upload Chats File
			</Button>
		</Stack>
	);
};
