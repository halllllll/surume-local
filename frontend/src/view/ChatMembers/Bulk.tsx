import { DownloadTemplateXlsxButton } from "@/component/button/DL/DownloadTemplateXlsx";
import { Box, Button, HStack } from "@chakra-ui/react";
import type { FC } from "react";

export const Bulk: FC = () => {
	// TODO: いまのところまだ決まってないがこの画面で扱うやつとする
	// const [result, setResult] = useState();
	return (
		<Box>
			<HStack spacing={10}>
				<Button>{"Validate（TODO）"}</Button>
				<DownloadTemplateXlsxButton path={"/static/surume-chatmember.xlsx"} />
			</HStack>
			{/** TODO:個別の結果の表示はせず、内訳（成功した総数とか）と結果のDLボタンを表示するのみを目的とする */}
			{/* <FormProvider></FormProvider> */}
			yay!
		</Box>
	);
};
