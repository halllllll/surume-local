import { UploadXlsxFile } from "@/component/button/UploadBroadcastXlsx";
import {
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	useToast,
} from "@chakra-ui/react";
import { useRef, type FC } from "react";
import { ChatMessages } from "@/view/BroadCast/ChatMessages";
import { FireBroadCast } from "@/component/button/FireBroadCast";
import { usePostChatsMessageWithContext } from "@/service/message";
import type { FormatedChatMessageData } from "@/types/types";
import { DownloadResult } from "@/component/button/DownloadResult";
import { useSurumeContext } from "@/hooks/context";
import { download } from "./dl";
import { FireCount } from "./Count";
import { useMsal } from "@azure/msal-react";
import { getAccessToken } from "@/service/graphClient";
import { DownloadTemplateXlsxButton } from "@/component/button/DL/DownloadTemplateXlsx";

export const Fire: FC = () => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const toScroll = () => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	const { mutate: postChatMessages } = usePostChatsMessageWithContext();
	const { surumeCtx } = useSurumeContext();
	const data = surumeCtx.chat_messages;
	const toast = useToast();
	const { instance } = useMsal();

	const post = async (data: FormatedChatMessageData[]) => {
		const { accessToken } = await getAccessToken(instance);
		data.forEach((ele, idx) => {
			postChatMessages(
				{ data: ele, token: accessToken, index: idx },
				{
					// なぜか何度も呼ばれる
					//   toast({
					//     title: "Done",
					//     status: "info",
					//     duration: 5000,
					//   });
					// },
					// onSettled: (result) => {
					//   console.log(result);
					//   toast({
					//     title: "Done",
					//     status: "info",
					//     duration: 5000,
					//   });
					// },
					onError: (err) => {
						console.error(err);
						toast({
							title: "Error",
							description: `${err.name} - ${err.message}`,
							duration: 8000,
						});
					},
				},
			);
		});
	};

	const dlHandler = () => {
		try {
			download(data);
		} catch (e: unknown) {
			const err = e as Error;
			toast({
				title: "Error",
				description: `${err.name} - ${err.message}`,
				duration: 8000,
			});
		}
	};

	return (
		<Box>
			<Heading size={"sm"} my={3}>
				BroadCast Chats
			</Heading>
			<Divider />

			<Flex my={3} gap={10} overflowWrap={"anywhere"}>
				<UploadXlsxFile />
				{/* TODO: 未実装 */}
				<Button isDisabled={true}>{"From Log (Under Construction)"}</Button>
				<DownloadTemplateXlsxButton path={"/static/surume-broadcast.xlsx"} />
			</Flex>

			{data.length === 0 ? null : (
				<>
					<FireCount data={data} />
					<ChatMessages scrollTarget={scrollRef} />
					{data.every(
						(v) => v.status === "Failed" || v.status === "Success",
					) ? (
						<>
							<DownloadResult handler={dlHandler} />
						</>
					) : (
						<>
							<FireBroadCast
								scrollTo={toScroll}
								sendHandler={post}
								isLoading={
									data.length > 0 &&
									data.every(
										(v) => v.status === "Failed" || v.status === "Success",
									)
								}
							/>
						</>
					)}
				</>
			)}
		</Box>
	);
};
