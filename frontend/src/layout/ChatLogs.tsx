import { ChatLogList } from "@/view/ChatLogList";
import { isBefore } from "date-fns";
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
import * as yup from "yup";

interface EndToDateTestContext extends yup.TestContext {
	parent: {
		dateFrom: Date;
	};
}

const ChatLogSchema = yup.object().shape({
	chats: yup.array(
		yup.object().shape({
			chatId: yup
				.string()
				.label("target chat id")
				.required()
				.matches(/^[a-z0-9\.:@\-_]+$/gs, "including invalid character"),
			outputName: yup
				.string()
				.label("output name")
				.required()
				.max(30)
				.test(
					"excel-sheetname",
					"including ng character(`\\`, `:`, `?`, `*`, `[` or `]`)",
					(value) => {
						const ng = [
							"\\",
							"　",
							" ",
							":",
							"：",
							"?",
							"？",
							"*",
							"＊",
							"[",
							"［",
							"]",
							"］",
						];
						return !ng.some((e) => value.includes(e));
					},
				),
		}),
	),
	dateFrom: yup
		.date()
		.typeError("no selected target chat modified date")
		.required("no selected target chat modified date"),
	dateTo: yup
		.date()
		.typeError("no selected target chat modified date")
		.required("target chat modified data")
		.test(
			"is-greater",
			"`to-date` must be later than `form-date`",
			function (value) {
				const { dateFrom } = (this as EndToDateTestContext).parent;
				console.log(value);
				if (value === null || value === undefined) return true;
				if (value instanceof Date) {
					return isBefore(dateFrom, value);
				}
				return true;
			},
		),
});

export type ChatLogsParams = yup.InferType<typeof ChatLogSchema>;
export type ChatLogsParam = {
	chatId: string;
	outputName: string;
	dateFrom: Date;
	dateTo: Date;
};

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
		mode: "all",
		criteriaMode: "all",
		defaultValues: defaultVal,
		resolver: yupResolver<ChatLogsParams>(ChatLogSchema),
	});

	// TODO: とりあえず複数追加できるようにしたが、複数のinfinitequeryの投げ方のいい実装がわからず、追加を実装していない。
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
