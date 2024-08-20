import { ChatMemberList } from "@/view/ChatMemberlist";
import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
} from "@chakra-ui/react";
import type { FC } from "react";
import { FormProvider } from "react-hook-form";
import { useChatMembarsForm } from "@/scheme/chatMember";

export const ChatMember: FC = () => {
	const { targetChatId, btnState, methods, onSubmit } = useChatMembarsForm();

	// const [targetChatId, setTargetChatId] = useState<ChatMemberParam>({
	// 	chatId: "",
	// });
	// const [btnState, updateBtnState] = useState<boolean>(false);

	// const methods = useForm<ChatMemberParam>({
	// 	mode: "all",
	// 	defaultValues: { chatId: "" },
	// 	resolver: yupResolver<ChatMemberParam>(ChatMemberSchema),
	// });

	// const onSubmit: SubmitHandler<ChatMemberParam> = (formData) => {
	// 	updateBtnState(false);
	// 	setTargetChatId(formData);
	// 	updateBtnState(true);
	// };

	return (
		<>
			<Heading size={"sm"} my={3}>
				Chat Members
			</Heading>
			<Divider />
			<Box py={3}>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<Flex alignItems={"end"} gap={2}>
							<FormControl isInvalid={!!methods.formState.errors.chatId}>
								<Flex alignItems={"start"}>
									<FormLabel>chat id（カンマ区切りで複数指定OK）</FormLabel>
									<FormErrorMessage>
										{methods.formState.errors.chatId?.message}
									</FormErrorMessage>
								</Flex>
								<Input {...methods.register("chatId")} />
							</FormControl>
							<Button
								type={"submit"}
								isDisabled={!methods.formState.isValid}
								// isLoading={isPending}
							>
								Check
							</Button>
						</Flex>
					</form>
				</FormProvider>
			</Box>
			{btnState && (
				<>
					<Divider />
					<ChatMemberList data={targetChatId} />
				</>
			)}
		</>
	);
};
