import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";

export const ChatMemberSchema = yup.object({
	chatMembers: yup
		.array(
			yup.object().shape({
				chatId: yup
					.string()
					.label("target chat id")
					.required()
					.matches(/^[a-zA-Z0-9\.:@\-_]+$/gs, "including invalid character")
					.test(
						"duplicate-id",
						"duplicated id",
						function (this: yup.TestContext, chatid: string) {
							if (!this || !this.from) return false;
							const v = this.from[1].value.chatMembers;
							let duplicateCount = 0;
							for (const vv of v) {
								if (vv.chatId === chatid) {
									duplicateCount++;
								}
							}
							if (duplicateCount > 1) {
								return false;
							}
							return true;
						},
					),
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
				chatName: yup.string().nullable(),
			}),
		)
		.required()
		.min(1),
});

export type ChatMemberParam = yup.InferType<typeof ChatMemberSchema>;

export const useChatMembarsForm = () => {
	const [targetChatId, setTargetChatId] = useState<ChatMemberParam>({
		chatMembers: [],
	});
	const [isTriggered, setIsTriggerd] = useState<boolean>(false);

	const methods = useForm<ChatMemberParam>({
		mode: "all",
		defaultValues: {
			chatMembers: [
				{
					chatId: "",
					outputName: "",
				},
			],
		},
		resolver: yupResolver<ChatMemberParam>(ChatMemberSchema),
	});

	const onSubmit: SubmitHandler<ChatMemberParam> = (formData) => {
		setIsTriggerd(true);
		setTargetChatId(formData);
	};

	return { targetChatId, methods, onSubmit, isTriggered, setIsTriggerd };
};
