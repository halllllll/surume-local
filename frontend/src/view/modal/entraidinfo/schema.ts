import type { PostEntraIdInfoRequest } from "@/service/entraid_info_api/type";
import * as yup from "yup";

const schema: yup.ObjectSchema<PostEntraIdInfoRequest> = yup.object().shape({
	clientid: yup
		.string()
		.trim()
		.required()
		.matches(/^[a-z0-9]+(-[a-z0-9]+)+$/, "invalid client id format")
		.min(5, "too short"),
	authority: yup
		.string()
		.trim()
		.required()
		.matches(
			/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
			"インターネットドメインの形式ではありません",
		),
	port: yup
		.number()
		.positive()
		.integer()
		.max(65535)
		.required("port number is a required field")
		.typeError("数値を入力してください"),
});

export { schema as EntraIdSchema };
