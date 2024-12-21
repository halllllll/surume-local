import { useChatMembarsForm } from "@/scheme/chatMember";
import {
	Box,
	Button,
	HStack,
	FormControl,
	Flex,
	FormLabel,
	Input,
	FormErrorMessage,
	Center,
	Spacer,
} from "@chakra-ui/react";
import type { FC } from "react";
import { useFieldArray, FormProvider } from "react-hook-form";
import { ChatMembersList } from "./ChatMemberList";
import { useSurumeContext } from "@/hooks/context";
import { SelectInputController } from "./SelectInputController";

export const SingleView: FC = () => {
	const { targetChatId, methods, onSubmit, isTriggered, setIsTriggerd } =
		useChatMembarsForm();
	const chatErrors = methods.formState.errors.chatMembers;
	const { fields, append, remove, replace } = useFieldArray({
		control: methods.control,
		name: "chatMembers",
	});

	const { surumeCtx } = useSurumeContext();

	const setAllCandidateData = () => {
		methods.reset();
		remove();
		if (surumeCtx.chat_list_result === null) return;

		const values = surumeCtx.chat_list_result.result.map((res, _idx) => {
			return {
				chatId: res.id ?? "",
				chatName: res.topic ?? "",
				outputName: res.topic ?? res.id ?? "",
			};
		});
		// ちょっとテストで絞ってる
		replace(values.splice(0, 4));
		methods.trigger();
	};

	return (
		<>
			<Flex>
				<Button
					type={"button"}
					my={2}
					onClick={() => {
						methods.reset();
						setIsTriggerd(false);
					}}
				>
					reset
				</Button>

				{(surumeCtx.chat_list_result && !isTriggered) ?? (
					<>
						<Spacer />
						<Center>
							<Button colorScheme={"pink"} onClick={setAllCandidateData}>
								{" "}
								TAKE ALL{" "}
							</Button>
						</Center>
						<Spacer />
					</>
				)}
			</Flex>
			{!isTriggered && (
				<Box overflowX="auto" overflowY="auto">
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onSubmit)}>
							{fields.length >= 10 && (
								<Flex direction={"row-reverse"}>
									<Button
										type={"submit"}
										isDisabled={!methods.formState.isValid || isTriggered}
										// isLoading={isPending}
									>
										Challenge
									</Button>
								</Flex>
							)}
							{fields.map((chat, idx) => {
								return (
									<Box key={chat.id}>
										<HStack pb={4} gap={4} align={"top"}>
											<FormControl isInvalid={!!chatErrors?.[idx]?.chatId}>
												<Flex alignItems={"start"}>
													<FormLabel>chat id</FormLabel>
												</Flex>
												{surumeCtx.chat_list_result ? (
													<SelectInputController
														idx={idx}
														isTriggered={isTriggered}
													/>
												) : (
													<Input
														isDisabled={isTriggered}
														{...methods.register(`chatMembers.${idx}.chatId`)}
													/>
												)}
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
											<Flex align={"flex-end"}>
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
					</FormProvider>
				</Box>
			)}
			{methods.formState.isValid && isTriggered && (
				<>
					<ChatMembersList data={targetChatId} />
				</>
			)}
		</>
	);
};
