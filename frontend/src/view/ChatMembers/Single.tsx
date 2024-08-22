import { useChatMembarsForm } from "@/scheme/chatMember";
import {
	Heading,
	Divider,
	Box,
	Button,
	HStack,
	FormControl,
	Flex,
	FormLabel,
	Input,
	FormErrorMessage,
	Center,
} from "@chakra-ui/react";
import type { FC } from "react";
import { useFieldArray, FormProvider } from "react-hook-form";
import { ChatMembersList } from "./ChatMemberList";

export const SingleView: FC = () => {
	const { targetChatId, methods, onSubmit, isTriggered, setIsTriggerd } =
		useChatMembarsForm();
	const chatErrors = methods.formState.errors.chatMembers;
	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: "chatMembers",
	});

	return (
		<>
			<Box py={3} m={3}>
				<FormProvider {...methods}>
					<Box overflowX="auto" overflowY="auto" maxHeight={600} p={5}>
						<form onSubmit={methods.handleSubmit(onSubmit)}>
							{fields.map((chat, idx) => {
								return (
									<Box key={chat.id}>
										<HStack pb={4} gap={4} align={"top"}>
											<FormControl isInvalid={!!chatErrors?.[idx]?.chatId}>
												<Flex alignItems={"start"}>
													<FormLabel>chat id</FormLabel>
												</Flex>
												<Input
													isDisabled={isTriggered}
													{...methods.register(`chatMembers.${idx}.chatId`)}
												/>
												<FormErrorMessage>
													{chatErrors?.[idx]?.chatId?.message}
												</FormErrorMessage>
											</FormControl>
											<FormControl isInvalid={!!chatErrors?.[idx]?.outputName}>
												<FormLabel>save as (excel worksheet name)</FormLabel>
												<Input
													size={"md"}
													isDisabled={isTriggered}
													{...methods.register(`chatMembers.${idx}.outputName`)}
												/>
												<FormErrorMessage>
													{chatErrors?.[idx]?.outputName?.message ?? ""}
												</FormErrorMessage>
											</FormControl>

											<Flex align={"end"}>
												<Box h={"fit-content"}>
													{fields.length > 1 && !isTriggered && (
														<Button
															type={"button"}
															colorScheme={"red"}
															onClick={() => {
																remove(idx);
															}}
														>
															-
														</Button>
													)}
												</Box>
											</Flex>
										</HStack>
									</Box>
								);
							})}
							<Flex gap={2} direction={"column"}>
								{!isTriggered && (
									<Center>
										<Button
											minW={"8em"}
											maxW={"10em"}
											type={"button"}
											colorScheme={"teal"}
											isDisabled={!methods.formState.isValid}
											onClick={() => {
												append({ chatId: "", outputName: "" });
											}}
										>
											+
										</Button>
									</Center>
								)}
								<Flex justify={"end"}>
									{isTriggered ? (
										<Button
											type={"button"}
											onClick={() => {
												methods.reset();
												setIsTriggerd(false);
											}}
										>
											reset
										</Button>
									) : (
										<Button
											type={"submit"}
											isDisabled={!methods.formState.isValid || isTriggered}
											// isLoading={isPending}
										>
											Challenge
										</Button>
									)}
								</Flex>
							</Flex>
						</form>
					</Box>
				</FormProvider>
			</Box>
			<Divider />
			{methods.formState.isValid && isTriggered && (
				<>
					<Heading>Result</Heading>
					<ChatMembersList data={targetChatId} />
				</>
			)}
		</>
	);
};
