// dto

import { OperationResult } from "@/types/types";
import { initDBTargets } from "@/service/entraid_info_api/type";

export type InitTargetsRequest = {
	target: (typeof initDBTargets)[number][];
};
export type InitTargetResponse = OperationResult<null>;
