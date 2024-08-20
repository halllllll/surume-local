import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";

export const ChatMemberSchema = yup.object({
	chatId: yup.string().label("target chat id").required(),
});

export type ChatMemberParam = yup.InferType<typeof ChatMemberSchema>;

export const useChatMembarsForm = () => {
	const [targetChatId, setTargetChatId] = useState<ChatMemberParam>({
		chatId: "",
	});
	const [btnState, updateBtnState] = useState<boolean>(false);

	const methods = useForm<ChatMemberParam>({
		mode: "all",
		defaultValues: { chatId: "" },
		resolver: yupResolver<ChatMemberParam>(ChatMemberSchema),
	});

	const onSubmit: SubmitHandler<ChatMemberParam> = (formData) => {
		updateBtnState(false);
		setTargetChatId(formData);
		updateBtnState(true);
	};

	return { targetChatId, btnState, methods, onSubmit };
};
