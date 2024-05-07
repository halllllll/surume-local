import { useValidFolder } from "@/service/drive";
import { getAccessToken } from "@/service/graphClient";
import { useToast } from "@chakra-ui/react";
import type { FC } from "react";
import { type SubmitHandler, FormProvider, useForm } from "react-hook-form";
import { FormFolderName, type FormFolderNameSchema } from "./schema";
import { useMsal } from "@azure/msal-react";
import { yupResolver } from "@hookform/resolvers/yup";
import type { DriveItem } from "@/service/drive/type";
import { CheckingFolderForm } from "./CheckingFolderForm";
import { Text } from "@chakra-ui/react";

type Props = {
	setDriveItem: React.Dispatch<React.SetStateAction<DriveItem | null>>;
};
export const CheckingFolder: FC<Props> = ({ setDriveItem }) => {
	const methods = useForm<FormFolderNameSchema>({
		mode: "all",
		criteriaMode: "all",
		shouldFocusError: false,
		defaultValues: { folderName: "" },
		resolver: yupResolver<FormFolderNameSchema>(FormFolderName),
	});
	const { instance } = useMsal();
	const {
		mutate: checkMutate,
		isPending: checkIsPending,
		status: checkStatus,
		failureReason: _reason,
	} = useValidFolder();
	const toast = useToast();

	const onFormSubmit: SubmitHandler<FormFolderNameSchema> = async (
		formData,
	) => {
		const { accessToken } = await getAccessToken(instance);
		checkMutate(
			{ folderName: formData.folderName, token: accessToken },
			{
				onSettled: () => {},
				onSuccess: (data, arg) => {
					toast({
						title: `Find "${arg.folderName}" on Beneath Your OneDrive Root`,
						description: `id: ${data.id}, eTag: ${data.eTag}`,
						status: "info",
						isClosable: true,
						duration: 3000,
					});
					setDriveItem(data);
				},
				onError: (error) => {
					toast({
						title: "Avaritia",
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
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onFormSubmit)}>
					<CheckingFolderForm isPending={checkIsPending} />
				</form>
			</FormProvider>
			{checkStatus === "success" && <Text>Exist!</Text>}
		</>
	);
};
