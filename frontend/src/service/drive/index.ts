import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { driveitemkeys } from './key';
import { createFolder, getDriveItemByNameUnderRoot } from './functions';
import type { DriveItem, DriveItemResponse, EssentialFolderParts } from './type';
import type { GraphError } from '@/errors/errors';

export const useGetDriveItemByNameBeneathRoot = (folderName: string) => {
  const { data, refetch, isPending, isError, isFetching, isLoading, error } = useQuery<
    DriveItemResponse,
    GraphError
  >({
    networkMode: 'offlineFirst',
    queryKey: driveitemkeys.byname(folderName),
    queryFn: () => getDriveItemByNameUnderRoot(folderName),
  });
  return { data, refetch, isPending, isError, isFetching, isLoading, error };
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation<DriveItem, GraphError, EssentialFolderParts>({
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

  return { mutate };
};
