import { ServiceError } from "@/errors/errors";
import {
	GetEntraIdInfoResponse,
	PostEntraIdInfoRequest,
	PostEntraIdInfoResponse,
} from "./type";

export const getEntraIdInfo = async (): Promise<GetEntraIdInfoResponse> => {
	const res = await fetch("/api/entraid", {
		method: "GET",
	});

	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

	return res.json();
};

export const postEntraIdInfo = async (
	data: PostEntraIdInfoRequest,
): Promise<PostEntraIdInfoResponse> => {
	const res = await fetch("/api/system/entraid", {
		method: "POST",
		body: JSON.stringify(data),
	});

	if (!res.ok) throw new ServiceError(`${res.status} ${res.statusText}`);
	return res.json();
};
