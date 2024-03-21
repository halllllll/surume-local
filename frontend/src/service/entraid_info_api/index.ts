import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { entraIdKeys } from "./key";
import { getEntraIdInfo, postEntraIdInfo } from "./functions";
import { ServiceError } from "@/errors/errors";

export const useGetEntraIdInfo = () => {
	const { data, isPending, isError, error } = useSuspenseQuery({
		staleTime: 0,
		gcTime: 0,
		queryFn: getEntraIdInfo,
		queryKey: entraIdKeys.all,
		refetchOnWindowFocus: false,
	});

	if (isError) throw new ServiceError(`${error?.name} ${error?.message}`);

	return { data, isPending, isError };
};

export const usePostEntraIdInfo = () => {
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: postEntraIdInfo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: entraIdKeys.all });
		},
	});

	return { mutate };
};
