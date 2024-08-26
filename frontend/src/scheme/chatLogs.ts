import * as yup from "yup";
import { isBefore } from "date-fns";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { format, sub } from "date-fns";

interface EndToDateTestContext extends yup.TestContext {
	parent: {
		dateFrom: Date;
	};
}

export const ChatLogSchema = yup.object().shape({
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

export const useChatLogForm = () => {
	const defaultVal: ChatLogsParams = {
		chats: [
			{
				outputName: "",
				chatId: "",
			},
		],

		// input type="date"のデフォルト値は`yyyy-MM-dd`に決まっているが、そうするとstring型になるのは避けられないため、初期値を`as unknown as Date`としている
		dateFrom: format(sub(new Date(), { days: 1 }), "yyyy-MM-dd", {
			// locale: ja, 謎エラー
		}) as unknown as Date,

		dateTo: format(new Date(), "yyyy-MM-dd", {
			// locale: ja, 謎エラー
		}) as unknown as Date,
	};
	const [logData, setLogData] = useState<ChatLogsParams>(defaultVal);

	const [isTriggered, setIsTriggered] = useState<boolean>(false);

	const methods = useForm<ChatLogsParams>({
		mode: "all",
		criteriaMode: "all",
		defaultValues: defaultVal,
		resolver: yupResolver<ChatLogsParams>(ChatLogSchema),
	});

	// TODO: とりあえず複数追加できるようにしたが、複数のinfinitequeryの投げ方と結果の受け取り方のいい実装がわからず、追加を実装していない。
	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: "chats",
	});

	const onSubmit: SubmitHandler<ChatLogsParams> = (formData) => {
		setIsTriggered(true);
		setLogData(formData);
	};

	return {
		logData,
		methods,
		onSubmit,
		isTriggered,
		setIsTriggered,
		fields,
		append,
		remove,
	};
};
