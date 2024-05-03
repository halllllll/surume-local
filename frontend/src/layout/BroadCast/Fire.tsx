import { UploadXlsxFile } from "@/component/button/UploadXlsxFile";
import { Box, Button, HStack, useToast } from "@chakra-ui/react";
import { useRef, type FC } from "react";
import { ChatMessages } from "@/view/BroadCast/ChatMessages";
import { FireBroadCast } from "@/component/button/FireBroadCast";
import { usePostChatsMessageWithContext } from "@/service/message";
import type { FormatedChatMessageData } from "@/types/types";
import { DownloadResult } from "@/component/button/DownloadResult";
import { useSurumeContext } from "@/hooks/context";
import { download } from "./dl";
import { FireCount } from "./Count";

export const Fire: FC = () => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const toScroll = () => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	const { mutate: postChatMessages } = usePostChatsMessageWithContext();
	const { surumeCtx } = useSurumeContext();
	const data = surumeCtx.chat_messages;

	const toast = useToast();
	const post = (data: FormatedChatMessageData[]) => {
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.forEach((ele) => {
			postChatMessages(
				{ ...ele },
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
					// onError: (err) => {
					//   toast({
					//     title: "Error",
					//     description: `${err.name} - ${err.message}`,
					//     duration: 8000,
					//   });
					// },
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
			<HStack spacing={10}>
				<UploadXlsxFile />
				{/* TODO: 未実装 */}
				<Button isDisabled={true}>{"From Log"}</Button>
			</HStack>

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
