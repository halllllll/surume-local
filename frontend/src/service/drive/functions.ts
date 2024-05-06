import { FolderNotFound, GraphError } from "@/errors/errors";
import { prepareClient, prepareClientWithBearer } from "../graphClient";
import type { DriveItem, EssentialFolderParts } from "./type";

export type ValidFolderReponse =
	| {
			exists: false;
	  }
	| {
			exists: true;
			folder: DriveItem;
	  };

export const isFolder = async (
	driveId: string,
	itemId: string,
	accessToken?: string,
): Promise<boolean> => {
	console.warn("gogo isfloder");
	const driveClient = accessToken
		? prepareClientWithBearer(accessToken)
		: prepareClient();
	const res = await driveClient.GET("/drives/{drive-id}/items/{driveItem-id}", {
		params: {
			path: {
				"drive-id": driveId,
				"driveItem-id": itemId,
			},
			body: {},
			query: {},
		},
	});
	if (res.error) {
		throw res.error.error;
	}
	return !!res.data.folder;
};

export const getDriveItemByNameUnderRoot = async (payload: {
	token: string;
	folderName: string;
}): Promise<DriveItem> => {
	// 現行のOASではpath-basedなOneDriveAPIが存在しないようである
	// https://learn.microsoft.com/en-us/graph/api/resources/driveitem?view=graph-rest-1.0
	// https://learn.microsoft.com/en-us/graph/onedrive-addressing-driveitems
	// const { instance } = useMsal();
	// const {accessToken} = await getAccessToken(instance);
	const accessToken = payload.token;
	console.warn(
		`foldername? ${payload.folderName}, encoded: ${encodeURIComponent(
			payload.folderName,
		)}`,
	);
	const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(
		payload.folderName,
	)}`;

	const res = await fetch(url, {
		method: "GET",
		cache: "no-cache",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const data = await res.json();
	if (!res.ok) {
		// TODO
		throw new GraphError(data.error);
	}
	return data;
};

export const createFolder = async (payload: {
	data: EssentialFolderParts;
	token?: string;
}): Promise<DriveItem> => {
	const { parentFolderId, targetFolderId, folderName } = payload.data;

	// msgraph-metadataのOASとtypescript-openapiのクライアントを使った以下のものは、これでも動くのだがOASに存在しないプロパティがあり、コンパイルエラーになる
	/*

			const driveClient = payload.token
				? prepareClientWithBearer(payload.token)
				: prepareClient();

			const res = await driveClient.POST(
				"/drives/{drive-id}/items/{driveItem-id}/children",
				{
					params: {
						path: {
							"drive-id": parentFolderId,
							"driveItem-id": targetFolderId,
						},
					},
					body: {
						folder: {},
						name: folderName,
						"@microsoft.graph.conflictbehavior": "rename", // 現在のところOASに存在しないProperty
					},
				},
			);
	*/
	// 仕方ないので生fetchする 未来に期待
	const res = await fetch(
		`https://graph.microsoft.com/v1.0/drives/${parentFolderId}/items/${targetFolderId}/children`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${payload.token}`,
			},
			body: JSON.stringify({
				name: folderName,
				folder: {},
				"@microsoft.graph.conflictBehavior": "rename",
			}),
		},
	);

	if (!res.ok) {
		const err = await res.json();
		throw err.error as unknown as GraphError;
	}
	return await res.json();
};

export const validFolder = async (payload: {
	token: string;
	folderName: string;
}): Promise<DriveItem> => {
	const driveItem = await getDriveItemByNameUnderRoot({
		token: payload.token,
		folderName: payload.folderName,
	});
	const driveId = driveItem.parentReference?.driveId;
	if (!driveId) {
		throw new GraphError({
			code: "",
			message: "Nothing DriveId",
		});
	}
	const itemId = driveItem.id;
	if (!itemId) {
		throw new GraphError({
			code: "",
			message: "Nothing ItemID",
		});
	}
	console.warn("get drive and item id");
	const _driveId = driveId as string;
	const res = await isFolder(_driveId, itemId, payload.token);
	if (!res) {
		throw new FolderNotFound(`${payload.folderName} is Not A Folder`);
	}
	return driveItem;
};
