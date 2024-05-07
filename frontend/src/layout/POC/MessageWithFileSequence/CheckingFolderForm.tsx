import {
	Flex,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Button,
} from "@chakra-ui/react";
import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import type { FormFolderNameSchema } from "./schema";

type Props = {
	isPending: boolean;
};
export const CheckingFolderForm: FC<Props> = ({ isPending }) => {
	const methods = useFormContext<FormFolderNameSchema>();
	return (
		<Flex alignItems={"end"} gap={2}>
			<FormControl isInvalid={!!methods.formState.errors.folderName} isRequired>
				<Flex alignItems={"start"}>
					<FormLabel>folder name</FormLabel>
					<FormErrorMessage>
						{methods.formState.errors.folderName?.message}
					</FormErrorMessage>
				</Flex>
				<Input {...methods.register("folderName")} maxW={"sm"} />
			</FormControl>
			<Button
				type={"submit"}
				isDisabled={!methods.formState.isValid}
				isLoading={isPending}
			>
				Check
			</Button>
		</Flex>
	);
};
