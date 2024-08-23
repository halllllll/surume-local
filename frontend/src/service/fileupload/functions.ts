import { ExcelError } from "@/errors/errors";
import type { Target, UploadType, ValidationReponse } from "./type";

// upload xlsx for validation at server
// * NOT FOR uploading as chat message attachement
export const upload = async (payload: {
	file: File;
	token: string;
	type: UploadType;
	target: Target;
	path: string;
}): Promise<ValidationReponse> => {
	const formData = new FormData();
	formData.append("xlsx", payload.file);
	formData.append("target", payload.target);
	formData.append("type", payload.type);
	const res = await fetch(payload.path, {
		method: "POST",
		body: formData,
		// TODO: IDトークンの検証はサーバー側では未実装
		headers: {
			Authorization: `Bearer ${payload.token}`,
		},
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
