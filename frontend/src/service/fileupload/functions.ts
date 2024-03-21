import { ExcelError } from "@/errors/errors";
import { ValidationReponse } from "./type";

export const upload = async (file: File): Promise<ValidationReponse> => {
	const formData = new FormData();
	formData.append("target", file);
	const res = await fetch("/api/util/validateTemplate", {
		method: "POST",
		body: formData,
	});

	if (!res.ok) {
		const resErr = res.clone();
		const resJson = await resErr.json();
		if (resErr.status === 400) {
			throw new ExcelError(`${resJson.error}`);
		}
		throw new Error(`${resErr.status} - ${resErr.statusText}`);
	}

	return res.json();
};
