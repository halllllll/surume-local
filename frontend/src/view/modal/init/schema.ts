import * as yup from "yup";
import { initDBTargets } from "./type";
import type { InferType } from "yup";

// https://qiita.com/ksh-fthr/items/e465097596c47f58ffa0
const T = initDBTargets.reduce(
	(obj, x) => {
		obj[x] = yup.boolean().required();
		return obj;
	},
	{} as { [key in (typeof initDBTargets)[number]]: yup.BooleanSchema },
);

const schema = yup.object({
	target: yup
		.object()
		.shape(T)
		.test(
			"at-least-one-checked",
			"At least one checkbox must be checked",
			(value) => Object.values(value).some((v) => v),
		)
		.required(),
});

export type InitSchemaType = InferType<typeof schema>;
export { schema as InitSchema };
