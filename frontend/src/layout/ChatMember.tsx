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
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, type FC } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const ChatMemberSchema = yup.object({
	chatId: yup.string().label("target chat id").required(),
});

type ChatMember = yup.InferType<typeof ChatMemberSchema>;

export const ChatMember: FC = () => {
	const [targetChatId, setTargetChatId] = useState<string>("");
	const [btnState, updateBtnState] = useState<boolean>(false);
	const methods = useForm<ChatMember>({
		mode: "all",
		defaultValues: { chatId: "" },
		resolver: yupResolver<ChatMember>(ChatMemberSchema),
	});

	const onSubmit: SubmitHandler<ChatMember> = (formData) => {
		updateBtnState(false);
		setTargetChatId(formData.chatId);
		updateBtnState(true);
	};
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
									<FormLabel>chat id</FormLabel>
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
					<ChatMemberList chatId={targetChatId} />
				</>
			)}
		</>
	);
};
