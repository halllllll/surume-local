import { VStack, Input, Button, Box } from "@chakra-ui/react";
import type { FC } from "react";

const accepteFileType = [
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

type Props = {
	handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
	text?: string;
};

export const UploadChatLogButton: FC<Props> = ({ handler, text }) => {
	return (
		<Box>
			<VStack spacing={4}>
				<Input
					type="file"
					hidden // input要素を非表示にする
					id="addFile"
					onChange={handler}
					accept={accepteFileType.join(",")}
				/>
				<Button
					as="label"
					htmlFor="addFile"
					variant="solid"
					colorScheme="teal"
					// isLoading={disabled}
				>
					{text ?? "upload"}
				</Button>
			</VStack>
		</Box>
	);
};
