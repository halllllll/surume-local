import { DownloadTemplateXlsxButton } from "@/component/button/DL/DownloadTemplateXlsx";
import { Box, Button, HStack } from "@chakra-ui/react";
import { useState, type FC } from "react";

export const Bulk: FC = () => {
	// TODO: いまのところまだ決まってないがこの画面で扱うやつとする
	// const [result, setResult] = useState();
	const [isValidate, _setIsValidate] = useState<boolean>(false);
	// 2 mutates
	// 1. ローカルサーバーでvalidation
	//		問題なければsetState
	//    結果は正しいか正しくないかのデータしか送れなさそう（mutationの設計が下手なので）

	// 2. 1で問題なければそのままフロントからAPI叩く、結果をまとめてxlsxにるのもフロントでやる
	//		validateボタンではなく、challengeボタンにする
	//		-> 押したらAPI叩くようにする
	//		終わったらState更新
	return (
		<Box>
			<HStack spacing={10}>
				{isValidate ? (
					<Button>{"Challenge!"}</Button>
				) : (
					<Button>{"Validate（TODO）"}</Button>
				)}

				<DownloadTemplateXlsxButton path={"/static/surume-chatmember.xlsx"} />
			</HStack>
			{/** TODO:個別の結果の表示はせず、内訳（成功した総数とか）と結果のDLボタンを表示するのみを目的とする */}
			{/* <FormProvider></FormProvider> */}
			yay!
		</Box>
	);
};
