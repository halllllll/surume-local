import { ChatLogSchema, type ChatLogsParams } from "@/scheme/chatLogs";
import { ChatLogList } from "@/view/ChatLogList";

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
	HStack,
	Spacer,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, type FC } from "react";
import {
	FormProvider,
	type SubmitHandler,
	useFieldArray,
	useForm,
} from "react-hook-form";

export const ChatLogs: FC = () => {
	const defaultVal: ChatLogsParams = {
		chats: [
			{
				outputName: "",
				chatId: "",
			},
		],
		dateFrom: new Date(),
		dateTo: new Date(),
	};
	const [targetData, setTargetData] = useState<ChatLogsParams>(defaultVal);
	const [btnState, updateBtnState] = useState<boolean>(false);
	const methods = useForm<ChatLogsParams>({
		mode: "onSubmit",
		criteriaMode: "all",
		defaultValues: defaultVal,
		resolver: yupResolver<ChatLogsParams>(ChatLogSchema),
	});

	// TODO: とりあえず複数追加できるようにしたが、複数のinfinitequeryの投げ方と結果の受け取り方のいい実装がわからず、追加を実装していない。
	const { fields /*append, _remove*/ } = useFieldArray({
		control: methods.control,
		name: "chats",
	});

	const chatErrors = methods.formState.errors.chats;

	const onSubmit: SubmitHandler<ChatLogsParams> = (formData) => {
		updateBtnState(false);
		setTargetData(formData);
		updateBtnState(true);
	};
	return (
		<>
			<Heading size={"sm"} my={3}>
				Chat Logs
			</Heading>
			<Divider />
			<Box py={3}>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<Box>
							<HStack align={"start"} gap={8} maxW={"md"} mb={4}>
								<FormControl isInvalid={!!methods.formState.errors.dateFrom}>
									<FormLabel>From:</FormLabel>
									<Input
										size={"md"}
										variant={"flushed"}
										{...methods.register("dateFrom")}
										type={"date"}
									/>
									<FormErrorMessage>
										{methods.formState.errors.dateFrom?.message ?? "a"}
									</FormErrorMessage>
								</FormControl>
								<FormControl isInvalid={!!methods.formState.errors.dateTo}>
									<FormLabel>To (less than):</FormLabel>
									<Input
										size={"md"}
										variant={"flushed"}
										{...methods.register("dateTo")}
										type={"date"}
									/>
									<FormErrorMessage>
										{methods.formState.errors.dateTo?.message ?? ""}
									</FormErrorMessage>
								</FormControl>
							</HStack>

							{fields.map((chat, idx) => {
								return (
									<Box key={chat.id}>
										<HStack pb={4} gap={4} align={"top"}>
											<FormControl isInvalid={!!chatErrors?.[idx]?.chatId}>
												<FormLabel>chat id</FormLabel>
												<Input
													size={"md"}
													{...methods.register(`chats.${idx}.chatId`)}
												/>
												<FormErrorMessage>
													{chatErrors?.[idx]?.chatId?.message}
												</FormErrorMessage>
											</FormControl>
											<FormControl isInvalid={!!chatErrors?.[idx]?.outputName}>
												<FormLabel>save as (excel worksheet name)</FormLabel>
												<Input
													size={"md"}
													{...methods.register(`chats.${idx}.outputName`)}
												/>
												<FormErrorMessage>
													{chatErrors?.[idx]?.outputName?.message ?? ""}
												</FormErrorMessage>
											</FormControl>
										</HStack>
									</Box>
								);
							})}

							<Flex alignItems={"end"}>
								<Spacer />
								<Button
									type={"submit"}
									isDisabled={!methods.formState.isValid}
									// isLoading={isPending}
								>
									Check
								</Button>
							</Flex>
						</Box>
					</form>
				</FormProvider>
			</Box>
			{btnState && (
				<>
					<Divider />
					<ChatLogList
						chats={targetData.chats}
						dateFrom={targetData.dateFrom}
						dateTo={targetData.dateTo}
					/>
				</>
			)}
		</>
	);
};
