import * as yup from "yup";

export const FormFolderName = yup.object({
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

export type FormFolderNameSchema = yup.InferType<typeof FormFolderName>;
