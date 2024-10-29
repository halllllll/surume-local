import { useSurumeContext } from "@/hooks/context";
import type { ChatMemberParam } from "@/scheme/chatMember";
import { Select } from "chakra-react-select";
import { useFormContext, Controller } from "react-hook-form";

// 見づらいので分けた
export const SelectInputController = (props: {
	idx: number;
	isTriggered: boolean;
}) => {
	const { register, control, setValue } = useFormContext<ChatMemberParam>();
	const { surumeCtx } = useSurumeContext();
	const { idx, isTriggered } = props;

	return (
		// TODO: 現状あんまやる意味なさそうなのでselect boxのvirtualize, window化はしてない
		<Controller
			control={control}
			name={`chatMembers.${idx}.chatId`}
			render={({ field, fieldState, formState }) => {
				const selectedOptionInputValue =
					surumeCtx.chat_list_result?.result.find(
						(option) => option.id === field.value,
					);
				return (
					<Select
						{...fieldState}
						{...formState}
						// fieldのうち例えば以下を指定するとoptionの型などでエラーになる
						// inputRef={field.ref}
						// value={field.value}
						// Select<なにかいい型>とかにできればよさそうだが方法がわからないので、いっそ無視する
						// {...field}
						{...register(`chatMembers.${idx}.chatId`)}
						// name={field.name}
						name={`chatMembers.${idx}.outputName`}
						onBlur={field.onBlur}
						menuPlacement={"auto"}
						menuPortalTarget={document.body}
						// UIから選択したのではなく外部（`useFieldArray`の`replace`とか）で矯正定期にSelectの値として設定しても見た目（value）には反映されずデフォルトのままになるので、value == 今選択されてるoptionとする
						// onChangeのsetValueとは関係なく、rhfではなくてreact-selectとかの事情
						value={
							selectedOptionInputValue
								? {
										label: selectedOptionInputValue.topic,
										value: selectedOptionInputValue.id,
									}
								: undefined
						}
						selectedOptionColorScheme={"pink"}
						onChange={(e) => {
							// resultの見た目用
							setValue(`chatMembers.${idx}.chatName`, e?.label ?? "", {
								shouldValidate: true,
							});
							// save as name input用
							setValue(`chatMembers.${idx}.outputName`, e?.label ?? "", {
								shouldValidate: true,
							});
							// 実際の値用
							setValue(`chatMembers.${idx}.chatId`, e?.value ?? "", {
								shouldValidate: true,
							});
						}}
						options={surumeCtx.chat_list_result?.result.map((v) => {
							return {
								label: v.topic ?? v.id,
								value: v.id,
							};
						})}
						isSearchable={true}
						isDisabled={isTriggered}
					/>
				);
			}}
		/>
	);
};
