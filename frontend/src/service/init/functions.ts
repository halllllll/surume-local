import { InitTargetResponse, InitTargetsRequest } from "./type";

export const init = async (
	data: InitTargetsRequest,
): Promise<InitTargetResponse> => {
	// DELETEにrequest bodyを含めるかどうかは実装によるらしく主流とかはとくに無いっぽい
	// ここではクエリパラメータとして渡す
	const param = data.target.map((v) => `targets=${v}`).join("&");
	const res = await fetch(`/api/system/reset?${param}`, {
		method: "DELETE",
		// body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
	// 成功 NoContent
	if (res.status === 204) {
		return { success: true, data: null };
	}
	return res.json();
};
