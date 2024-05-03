import type { PostEntraIdInfoRequest } from "@/service/entraid_info_api/type";
import type { FC } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { EntraIdSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	useGetEntraIdInfo,
	usePostEntraIdInfo,
} from "@/service/entraid_info_api";
import {
	ModalCloseButton,
	ModalBody,
	FormControl,
	FormLabel,
	Input,
	ModalFooter,
	Box,
	Button,
	Text,
	FormErrorMessage,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useSurumeContext } from "@/hooks/context";

// Form いい感じのアーキテクチャができないのでいっそまとめる（あとで分割するいい方法が思いついたときに混乱しないように）

export const EntraIdForm: FC<{ onClose: () => void }> = ({ onClose }) => {
	// suspense内でデータフェッチ(tanstack query)
	const { data: result } = useGetEntraIdInfo();
	// placeholder ここで書く意味ないかも
	const ph_clientId = "Aa-2022-0401";
	const ph_authority = "app.surume.local";
	const ph_port = "24601";

	// 送信はtanstack queryでやる
	const { mutate: submitEntraIdInfo } = usePostEntraIdInfo();
	// contextにentra id infoをset
	// （ほかにもっといい方法ありそう）
	const { setSurumeCtx } = useSurumeContext();

	// rhf
	const methods = useForm<PostEntraIdInfoRequest>({
		mode: "all",
		criteriaMode: "all",
		shouldFocusError: false,
		defaultValues: {
			clientid:
				result.success && result.exist ? result.data.clientid : undefined,
			authority:
				result.success && result.exist ? result.data.authority : undefined,
			port: result.success && result.exist ? result.data.port : undefined,
		},
		resolver: yupResolver(EntraIdSchema),
	});

	// 通信の可否はtoastで表示
	const toast = useToast();

	const onFormSubmit: SubmitHandler<PostEntraIdInfoRequest> = (formData) => {
		submitEntraIdInfo(
			{ ...formData },
			{
				onSettled: () => {},
				onSuccess: (_data) => {
					toast({
						title: "設定しました",
						status: "success",
						isClosable: true,
						duration: 3000,
					});
					setSurumeCtx({
						type: "SetEntraIdInfo",
						payload: { ...formData }, // ほんとはちゃんと取得した値を使ったほうがよさそう
					});

					onClose();
				},
				onError: (error) => {
					toast({
						title: "失敗しました",
						description: `${error.name} - ${error.message}`,
						status: "error",
						isClosable: true,
						duration: 8000,
					});
				},
			},
		);
	};

	return (
		<>
			<ModalCloseButton />
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onFormSubmit)}>
					<ModalBody pb={6}>
						<Box>
							<Text mb={5}>
								SURUME(Local)用に登録したEntraアプリケーション情報を設定してください
							</Text>
						</Box>
						<VStack spacing={4}>
							<FormControl
								isRequired
								isInvalid={methods.formState.errors.clientid !== undefined}
							>
								<FormLabel>Client ID</FormLabel>
								<Input
									{...methods.register("clientid")}
									placeholder={ph_clientId}
								/>
								<FormErrorMessage>
									{methods.formState.errors.clientid?.message}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								isRequired
								isInvalid={methods.formState.errors.authority !== undefined}
							>
								<FormLabel>Authority</FormLabel>
								<Input
									{...methods.register("authority")}
									placeholder={ph_authority}
								/>
								<FormErrorMessage>
									{methods.formState.errors.authority?.message}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								isRequired
								isInvalid={methods.formState.errors.port !== undefined}
							>
								<FormLabel>Port (localhost)</FormLabel>
								<Input
									{...methods.register("port")}
									placeholder={ph_port}
									type="number"
								/>
								<FormErrorMessage>
									{methods.formState.errors.port?.message}
								</FormErrorMessage>
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button
							type="submit"
							colorScheme="blue"
							mr={3}
							isDisabled={!methods.formState.isValid}
							isLoading={methods.formState.isLoading}
							loadingText="submitting..."
							spinnerPlacement="start"
						>
							Save
						</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</form>
			</FormProvider>
		</>
	);
};
