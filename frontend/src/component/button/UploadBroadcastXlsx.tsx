import { useSurumeContext } from "@/hooks/context";
import { useToast } from "@chakra-ui/react";
import type { FC } from "react";
import { useTemplateValidate } from "@/service/fileupload";
import type { FormatedChatMessageData } from "@/types/types";
import { useMsal } from "@azure/msal-react";
import { getAccessToken } from "@/service/graphClient";
import { ValidateXlsx } from "./ValidateChatmemberXlsx";

export const UploadXlsxFile: FC = () => {
	const { mutate: uploadFileMutate, isPending: disabled } =
		useTemplateValidate();
	const { setSurumeCtx } = useSurumeContext();
	const toast = useToast();
	const { instance } = useMsal();

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];

			const { accountInfo } = await getAccessToken(instance);
			accountInfo;

			uploadFileMutate(
				// TODO: IDトークンの検証はサーバー側では未実装
				{
					file,
					token: accountInfo?.idToken as string,
					type: "validate",
					target: "broadcast",
					path: "/api/util/validateTemplate",
				},
				{
					onSettled: () => {},
					onSuccess: (result) => {
						if (!result.success) {
							toast({
								title: "Ira",
								description: `NOT SUCCESS - ${result.error}`,
								status: "error",
							});
							return;
						}
						// add status field
						const payload: FormatedChatMessageData[] = result.data.map(
							(d, idx) => {
								return {
									...d,
									status: "Ready",
									indexOrder: idx,
								};
							},
						);
						setSurumeCtx({ type: "SetChatsMessage", payload });
					},
					onError: (err) => {
						setSurumeCtx({ type: "ResetChatsMessages" }); // 無いほうがいいかも？
						toast({
							title: "Superbia",
							description: `${err.name} - ${err.message}`,
							status: "error",
							isClosable: true,
							duration: 8000,
							position: "top",
						});
					},
				},
			);
		}
	};

	return (
		<ValidateXlsx
			inputFileChangeHandle={handleFileChange}
			isDisabled={disabled}
		/>
	);
};
