import { useMutation, useQueryClient } from "@tanstack/react-query";

// 初期化なのでuseSuspenseQueryは常に不要

import { initKeys } from "./key";
import { init } from "./functions";

export const useInit = () => {
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: init,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: initKeys.just });
		},
	});

	return { mutate };
};
