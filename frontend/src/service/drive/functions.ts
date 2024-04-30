import { GraphError } from "@/errors/errors";
import { getAccessToken, prepareClient } from "../graphClient";
import type {
	DriveItem,
	DriveItemResponse,
	EssentialFolderParts,
} from "./type";
import { useMsal } from "@azure/msal-react";

export const getDriveItemByNameUnderRoot = async (
	folderName: string,
): Promise<DriveItemResponse> => {
	// 現行のOASではpath-basedなOneDriveAPIが存在しないようである
	// https://learn.microsoft.com/en-us/graph/api/resources/driveitem?view=graph-rest-1.0
	// https://learn.microsoft.com/en-us/graph/onedrive-addressing-driveitems
	const { instance } = useMsal();
	const at = await getAccessToken(instance);
	const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(
		folderName,
	)}`;

	const res = await fetch(url, {
		method: "GET",
		cache: "no-cache",
		headers: {
			Authorization: `Bearer ${at.accessToken}`,
		},
	});

	const data = await res.json();
	if (!res.ok) {
		// TODO
		throw new GraphError(data.error);
	}
	return data;
};

export const createFolder = async (
	data: EssentialFolderParts,
): Promise<DriveItem> => {
	const { userId, parentFolderId, folderName } = data;
	const client = prepareClient();
	const res = await client.POST(
		"/drives/{drive-id}/items/{driveItem-id}/children",
		{
			params: {
				path: {
					"drive-id": userId, // ????
					"driveItem-id": parentFolderId, // ?????
				},
			},
			body: {
				"@odata.type": "#microsoft.graph.baseItem",
				folder: {},
				name: folderName,
				// "@microsoft.graph.conflictbehavior": "rename", 現在のところOASに存在しないProperty
			},
		},
	);

	if (res.error) {
		throw new GraphError(res.error.error);
	}
	return res.data;
};
