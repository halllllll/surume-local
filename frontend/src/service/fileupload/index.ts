import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upload } from './functions';
import { uploadFileKeys } from './key';

export const useTemplateValidate = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uploadFileKeys.template });
    },
  });

  return { mutate, isPending };
};
