import { useChatLogForm } from "@/scheme/chatLogs";
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
import type { FC } from "react";
import { FormProvider } from "react-hook-form";

export const ChatLogs: FC = () => {
	const { methods, onSubmit, fields, isTriggered, logData } = useChatLogForm();

	const chatErrors = methods.formState.errors.chats;
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
										{methods.formState.errors.dateFrom?.message ?? ""}
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
			{isTriggered && (
				<>
					<Divider />
					<ChatLogList
						chats={logData.chats}
						dateFrom={logData.dateFrom}
						dateTo={logData.dateTo}
					/>
				</>
			)}
		</>
	);
};
