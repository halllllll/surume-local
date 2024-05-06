import { useCreateFolder, useValidFolder } from "@/service/drive";
import type { DriveItem, EssentialFolderParts } from "@/service/drive/type";
import { getAccessToken } from "@/service/graphClient";
import { useMsal } from "@azure/msal-react";
import {
	Alert,
	AlertIcon,
	Box,
	Center,
	Divider,
	FormControl,
	FormLabel,
	Input,
	Heading,
	VStack,
	Button,
	Flex,
	Text,
	FormErrorMessage,
	useToast,
	List,
	ListItem,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, type FC } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
	folderName: yup
		.string()
		.label("folder name")
		.required()
		.test("length", "2 <= folder name length <= 30", (val) => {
			return val.length === 0 || (val.length >= 2 && val.length <= 30);
		}) // https://support.microsoft.com/en-us/office/restrictions-and-limitations-in-onedrive-and-sharepoint-64883a5d-228e-48f5-b3d2-eb39e07630fa
		.matches(/^\S.*\S$/, "Leading and trailing whitespaces are not allowed")
		.matches(
			/^[^*:<>\?\/\\\|]+$/,
			"Special characters * : < > ? / \\ | are not allowed",
		)
		.notOneOf(
			[
				"lock",
				"CON",
				"PRN",
				"AUX",
				"NUL",
				...Array.from(Array(10), (_, i) => `COM${i}`),
				...Array.from(Array(10), (_, i) => `LPT${i}`),
				"_vti_",
				"desktop.ini",
			],
			"Invalid folder name",
		)
		.notOneOf(["form"], "Invalid folder name")
		.matches(
			/^(?!~ \$)[^*:<>\?\/\\\|\s]+$/,
			"File names starting with '~ $' are not allowed",
		),
});

type SchemaType = yup.InferType<typeof schema>;

export const CheckingFolder: FC = () => {
	const methods = useForm<SchemaType>({
		mode: "all",
		criteriaMode: "all",
		shouldFocusError: false,
		defaultValues: { folderName: "" },
		resolver: yupResolver<SchemaType>(schema),
	});
	const { instance } = useMsal();

	const [targetDriveItem, setTargetDriveItem] = useState<DriveItem | null>(
		null,
	);
	const [targetDriveId, setTargetDriveId] = useState<string>("");
	// const val = methods.watch("folderName");
	const {
		mutate: checkMutate,
		isPending: checkIsPending,
		status: checkStatus,
		failureReason: _reason,
	} = useValidFolder();
	const toast = useToast();

	const onFormSubmit: SubmitHandler<SchemaType> = async (formData) => {
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
					console.log("Drive Item 確認");
					console.dir(data);
					setTargetDriveItem(data);
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					setTargetDriveId(data.id!);
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

	const { mutate: createMutate, isPending: createIsPending } =
		useCreateFolder();

	const onButtonPush = async () => {
		const { accessToken } = await getAccessToken(instance);
		const displayDate = new Intl.DateTimeFormat("ja-jp", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
			.formatToParts(new Date())
			.map((o) =>
				o.type === "literal" && o.value === "/"
					? "-"
					: o.type === "literal" && o.value === " "
						? "_"
						: o.type === "literal"
							? ""
							: o.value,
			)
			.join("");
		const folderName = `surume_${displayDate}`;
		const data: EssentialFolderParts = {
			// userId: accounts[0].username,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			parentFolderId: targetDriveItem!.parentReference!.driveId as string,
			targetFolderId: targetDriveId,
			folderName: folderName,
		};
		createMutate(
			{ data, token: accessToken },
			{
				onSettled: () => {},
				onSuccess: (data, arg) => {
					toast({
						title: `create folder "${arg.data.folderName} !"`,
						description: `url: ${data.webUrl}`,
						status: "info",
						isClosable: true,
						duration: 3000,
					});
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
			<VStack>
				<Center>
					<Heading as={"h2"}>Checking Folder</Heading>
				</Center>
				<Box w="max-content">
					<Alert status="info">
						<AlertIcon />
						here is developmental poc view, so including a log of bugs🐛
					</Alert>
				</Box>
				<Divider />
			</VStack>
			<Box p={5}>
				<Heading as={"h3"} size={"md"}>
					{"Check exist upload dist folder name (JUST BENEATH OneDrive root)"}
				</Heading>
				<VStack gap={10}>
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onFormSubmit)}>
							<Flex alignItems={"end"} gap={2}>
								<FormControl
									isInvalid={!!methods.formState.errors.folderName}
									isRequired
								>
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
									isLoading={checkIsPending}
								>
									Check
								</Button>
							</Flex>
						</form>
					</FormProvider>
					{checkStatus === "success" && (
						<Box>
							<Text>{"Drive Info"}</Text>
							<List spacing={5}>
								<ListItem>{`name: ${targetDriveItem?.name}`}</ListItem>
								<ListItem>{`including files: ${targetDriveItem?.children?.length}`}</ListItem>
								<ListItem>{`URL: ${targetDriveItem?.webUrl}`}</ListItem>
							</List>
							<Divider p={3} />
							<Box p={3}>
								<Button
									type={"button"}
									onClick={onButtonPush}
									isLoading={createIsPending}
								>
									create new children folder
								</Button>
							</Box>
						</Box>
					)}
				</VStack>
			</Box>
		</>
	);
};
