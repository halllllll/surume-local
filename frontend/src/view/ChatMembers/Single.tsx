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
} from "@chakra-ui/react";
import type { FC } from "react";
import { useFieldArray, FormProvider, Controller } from "react-hook-form";
import { ChatMembersList } from "./ChatMemberList";
import { useSurumeContext } from "@/hooks/context";
import { Select } from "chakra-react-select";

export const SingleView: FC = () => {
	const { targetChatId, methods, onSubmit, isTriggered, setIsTriggerd } =
		useChatMembarsForm();
	const chatErrors = methods.formState.errors.chatMembers;
	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: "chatMembers",
	});

	const { surumeCtx } = useSurumeContext();

	return (
		<>
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
			{!isTriggered && (
				<Box overflowX="auto" overflowY="auto">
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onSubmit)}>
							{fields.map((chat, idx) => {
								return (
									<Box key={chat.id}>
										<HStack pb={4} gap={4} align={"top"}>
											<FormControl isInvalid={!!chatErrors?.[idx]?.chatId}>
												<Flex alignItems={"start"}>
													<FormLabel>chat id</FormLabel>
												</Flex>
												{surumeCtx.chat_list_result ? (
													// TODO: 現状あんまやる意味なさそうなのでselect boxのvirtualize, window化はしてない
													<Controller
														control={methods.control}
														name={`chatMembers.${idx}.chatId`}
														render={({ field, fieldState, formState }) => (
															<Select
																{...fieldState}
																{...formState}
																// fieldのうち以下を指定するとoptionの型などでエラーになる
																// inputRef={field.ref}
																// value={field.value}
																{...methods.register(
																	`chatMembers.${idx}.chatId`,
																)}
																name={field.name}
																onBlur={field.onBlur}
																menuPlacement={"auto"}
																menuPortalTarget={document.body}
																onChange={(e) => {
																	// resultの見た目用
																	methods.setValue(
																		`chatMembers.${idx}.chatName`,
																		e?.label ?? "",
																		{ shouldValidate: true },
																	);
																	// save as name input用
																	methods.setValue(
																		`chatMembers.${idx}.outputName`,
																		e?.label ?? "",
																		{ shouldValidate: true },
																	);
																	// 実際の値用
																	methods.setValue(
																		`chatMembers.${idx}.chatId`,
																		e?.value ?? "",
																		{ shouldValidate: true },
																	);
																}}
																options={surumeCtx.chat_list_result?.result.map(
																	(v) => {
																		return {
																			label: v.topic ?? v.id,
																			value: v.id,
																		};
																	},
																)}
																isSearchable={true}
																isDisabled={isTriggered}
															/>
														)}
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
