import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Center,
	Divider,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Highlight,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	Textarea,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { useState, type FC, useRef } from "react";

import { format } from "date-fns";
import { type SubmitHandler, useForm, FormProvider } from "react-hook-form";
import type { ChatMessageData } from "@/types/types";
import { UploadFiles } from "@/component/button/UploadFiles";
import {
	useCreateFolder,
	useGetDriveItemByNameBeneathRoot,
} from "@/service/drive";
import { getAccessToken } from "@/service/graphClient";
import { SelectedFileField } from "@/view/SelectedFileField";
import { useMsal } from "@azure/msal-react";

// 機能テスト用の画面
// 面倒なのでyupとかは使わない
type Props = {
	target: string;
	files: File[];
	updateLoadingStatus: (v: boolean) => void;
};
const StatusExistFolder: FC<Props> = ({ target, updateLoadingStatus }) => {
	const {
		data: _data,
		isPending,
		isError,
		error,
	} = useGetDriveItemByNameBeneathRoot(target);
	if (isPending) {
		return (
			<Box>
				<Text>fetching...</Text>
			</Box>
		);
	}
	updateLoadingStatus(false);
	if (isError) {
		if (error?.code !== "itemNotFound") {
			throw error;
		}
		// methods.setValue("attachement.dist", target);
		return (
			<Box>
				<Box>
					<Highlight
						query={target}
						styles={{
							px: "1",
							py: "1",
							bg: "orange.100",
							fontSize: "1.5rem",
						}}
					>{`😭 Folder named "${target}" was NOT EXIST`}</Highlight>
				</Box>
			</Box>
		);
	}

	return (
		<Box>
			<Box>{`😘 "${target}" FOUND`}</Box>
		</Box>
	);
};

export const Post: FC = () => {
	const methods = useForm<ChatMessageData>({
		mode: "all",
		defaultValues: {
			chatId: "",
			content: "BIG LOVE",
		},
	});
	const [files, setFiles] = useState<File[]>([]);
	const [checkingBtnState, setCheckingBtnState] = useState<boolean>(false);
	const [checkingState, setCheckingState] = useState<boolean>(false);
	const drivefolderRef = useRef<HTMLInputElement>(null);
	const toast = useToast();

	const btnhandler = () => {
		const t = drivefolderRef.current?.value;
		if (t === "" || !t) {
			toast({
				status: "error",
				title: "Invalid Input Value",
				description: "不正な入力です",
			});
			return;
		}
		setCheckingBtnState(true);
		setCheckingState(true);
		methods.setValue("attachement.dist", t);
	};
	// const { mutate: postChatMessage } = usePostChatMessageText();
	const { mutate: createFolder } = useCreateFolder();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// validation
		const MAX_FILE_COUNT = 10;
		const MAX_FILE_SIZE = 1024 * 1024 * 8;
		const MAX_FILES_SIZE = 1024 * 1024 * 30;
		if (event.target.files && event.target.files.length > 0) {
			if (event.target.files.length > MAX_FILE_COUNT) {
				toast({
					status: "error",
					title: " Gula",
					description: `添付できるファイル上限数（${MAX_FILE_COUNT}）を超えています`,
				});
				return;
			}
			const selectedFileList = event.target.files;
			let selectedFiles: File[] = [];
			for (let i = 0; i < selectedFileList.length; i++) {
				selectedFiles = [...selectedFiles, selectedFileList[i]];
			}

			if (selectedFiles.every((f) => f.size > MAX_FILE_SIZE)) {
				toast({
					status: "error",
					title: " Gula",
					description: `添付できるファイルあたりサイズ上限（${MAX_FILE_SIZE} byte）を超えています`,
				});
				return;
			}
			if (
				selectedFiles
					.map((f) => f.size)
					.reduce((cur, pre) => {
						return cur + pre;
					}) > MAX_FILES_SIZE
			) {
				toast({
					status: "error",
					title: " Gula",
					description: `添付できるファイルのサイズ総量（${MAX_FILES_SIZE} byte）を超えています`,
				});
				return;
			}
			setFiles(selectedFiles);
		}
	};

	const post: SubmitHandler<ChatMessageData> = async (formData) => {
		if (files.length > 0 && !formData.attachement?.dist) {
			toast({
				title: "no dist",
				description: "should be check dist upload folder name",
				status: "error",
			});
			return;
		}
		if (files.length > 0 && formData.attachement?.dist) {
			// アップロード先を作成
			const uploadFolderName = `surume-${format(
				new Date(),
				"yyyy-MM-dd_HHmmss",
			)}`;
			const { instance } = useMsal();
			const { accountInfo: account } = await getAccessToken(instance);
			createFolder(
				{
					userId: account.localAccountId,
					parentFolderId: formData.attachement.dist,
					folderName: uploadFolderName,
				},
				{
					onSuccess: (result) => {
						console.log(result);
						toast({
							title: "Create Upload Folder",
							description: `${result.webUrl}`, // TODO: nullになるがあとで調査する。不要ではある
							status: "success",
						});
					},
					onError: (error) => {
						console.error(error);
						toast({
							title: error.name,
							description: error.message,
							status: "error",
						});
					},
				},
			);
		}

		// if file attachement
		// if(){
		//   const { accountInfo: info } = await getAccessToken();
		//   console.dir(info.localAccountId);
		//   // createFolder(
		//   //   {userId: info.localAccountId, }
		//   // )

		// }
		console.log("formdata");
		console.dir(formData);
		console.log("files?");
		for (const f of files) {
			console.log(f);
		}

		/*
    postChatMessage(
      { ...formData },
      {
        onSuccess: (result) => {
          console.log(result);
          toast({
            title: "success",
            description: `${result.webUrl}`, // TODO: nullになるがあとで調査する。不要ではある
            status: "success",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: error.name,
            description: error.message,
            status: "error",
          });
        },
      }
    );
    */
	};

	return (
		<VStack>
			<Center>
				<Heading as={"h2"} size={"lg"}>
					Manual Post
				</Heading>
			</Center>
			<Box w="max-content">
				<Alert status="info">
					<AlertIcon />
					here is developmental poc view, so including a log of bugs🐛
				</Alert>
			</Box>
			<Divider />
			<Box minW={"50vw"}>
				<Box p={5}>
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(post)}>
							<VStack spacing={4}>
								<FormControl
									isRequired
									isInvalid={methods.formState.errors.chatId !== undefined}
								>
									<FormLabel w="max-content" overflowWrap={"unset"}>
										chat id
									</FormLabel>
									<Input
										{...methods.register("chatId", {
											required: "required",
										})}
									/>
									<FormErrorMessage>
										{methods.formState.errors.chatId?.message}
									</FormErrorMessage>
								</FormControl>
								<FormControl
									isRequired
									isInvalid={methods.formState.errors.content !== undefined}
								>
									<FormLabel>content (plane text)</FormLabel>
									<Textarea
										{...methods.register("content", {
											required: "required",
											minLength: {
												value: 3,
												message: "minimum length should be 3 letters",
											},
										})}
										required
									/>
									<FormErrorMessage>
										{methods.formState.errors.content?.message}
									</FormErrorMessage>
								</FormControl>
								<UploadFiles handler={handleFileChange} files={files} />
								{files.length > 0 && (
									<Box>
										<SelectedFileField files={files} />
										<Text>
											{"upload dist folder name (JUST BENEATH OneDrive root)"}
										</Text>
										{checkingState && (
											<StatusExistFolder
												// biome-ignore lint/style/noNonNullAssertion: どうせfetchでエラー吐くだけなので
												target={drivefolderRef.current!.value}
												files={files}
												updateLoadingStatus={setCheckingBtnState}
											/>
										)}

										<Box>
											<InputGroup>
												<FormControl>
													<Input
														{...methods.register("attachement.dist")}
														ref={drivefolderRef}
													/>
													<InputRightElement w={"fit-content"}>
														<Button
															onClick={btnhandler}
															isLoading={checkingBtnState}
														>
															check
														</Button>
													</InputRightElement>
												</FormControl>
											</InputGroup>
										</Box>
									</Box>
								)}
								<Button
									type="submit"
									isDisabled={!methods.formState.isValid}
									isLoading={methods.formState.isLoading}
									loadingText="submitting"
									spinnerPlacement="start"
								>
									NEW CHAT MESSAGE
								</Button>
							</VStack>
						</form>
					</FormProvider>
				</Box>
			</Box>
		</VStack>
	);
};
