import { useMutation, useQueryClient } from "@tanstack/react-query";
import { driveitemkeys } from "./key";
import {
	createFolder,
	getDriveItemByNameUnderRoot,
	validFolder,
} from "./functions";
import type { DriveItem, EssentialFolderParts } from "./type";
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
			// return failureCount < 3;
			return failureCount < 1;
		},
	});

	return { mutate, isPending, status, error, failureReason };
};
