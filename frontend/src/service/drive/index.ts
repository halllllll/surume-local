import { useMutation, useQueryClient } from "@tanstack/react-query";
import { driveitemkeys } from "./key";
import {
	createFolder,
	getDriveItemByNameUnderRoot,
	uploadFile,
	validFolder,
} from "./functions";
import type { DriveItem, EssentialFolderParts, UploadFileProps } from "./type";
import type { GraphError } from "@/errors/errors";

// mutationを使う
export const useGetDriveItemByNameBeneathRootMutate = () => {
	// const setSurumeCtx = useSurumeContext();
	const { mutate, isPending, status, failureReason, error } = useMutation<
		DriveItem,
		GraphError,
		{
			folderName: string;
			token: string;
		}
	>({
		mutationFn: getDriveItemByNameUnderRoot,
		mutationKey: driveitemkeys.all,
		onMutate: () => {},
		onSuccess: (_data) => {},
		onError: (_err) => {},
	});

	return { mutate, isPending, status, error, failureReason };
};

export const useValidFolder = () => {
	const { mutate, isPending, status, failureReason, error } = useMutation<
		DriveItem,
		GraphError,
		{
			folderName: string;
			token: string;
		}
	>({
		mutationFn: validFolder,
		mutationKey: driveitemkeys.all,
		onMutate: () => {},
		onSuccess: (_data) => {},
		onError: (_err) => {},
	});

	return { mutate, isPending, status, error, failureReason };
};

export const useCreateFolder = () => {
	const queryClient = useQueryClient();
	const { mutate, isPending, status, error, failureReason } = useMutation<
		DriveItem,
		GraphError,
		{ data: EssentialFolderParts; token?: string }
	>({
		mutationFn: createFolder,
		mutationKey: driveitemkeys.all,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: driveitemkeys.all });
		},
		retry: (failureCount, error) => {
			console.error(error);
			return failureCount < 3;
		},
	});

	return { mutate, isPending, status, error, failureReason };
};

export const useUploadFile = () => {
	const queryClient = useQueryClient();
	const { mutate, isPending, status, error, failureReason } = useMutation<
		DriveItem,
		GraphError,
		UploadFileProps
	>({
		mutationFn: uploadFile,
		mutationKey: driveitemkeys.all,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: driveitemkeys.all });
		},
		retry: (failureCount) => {
			return failureCount < 3;
		},
	});

	return { mutate, isPending, status, error, failureReason };
};

export const useUploadFiles = <T>(setEachResult: (t: T) => void) => {
	const queryClient = useQueryClient();
	const { mutate, isPending, status, error, failureReason } = useMutation<
		T,
		GraphError,
		UploadFileProps
	>({
		mutationFn: uploadFile,
		mutationKey: driveitemkeys.all,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: driveitemkeys.all });
			setEachResult(data);
		},
		retry: (failureCount, _error) => {
			return failureCount < 3;
		},
	});

	return { mutate, isPending, status, error, failureReason };
};
