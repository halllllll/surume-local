import { DownloadTemplateXlsxButton } from "@/component/button/DL/DownloadTemplateXlsx";
import { Box, Button, HStack } from "@chakra-ui/react";
import type { FC } from "react";

export const Bulk: FC = () => {
	return (
		<Box py={3}>
			<HStack spacing={10}>
				<Button>{"Validate（TODO）"}</Button>
				<DownloadTemplateXlsxButton path={"/static/surume-chatmember.xlsx"} />
			</HStack>
			{/* <FormProvider></FormProvider> */}
			yay!
		</Box>
	);
};
