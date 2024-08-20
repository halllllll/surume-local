import * as yup from "yup";
import { isBefore } from "date-fns";

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
