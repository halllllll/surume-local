import { FolderNotFound, GraphError } from "@/errors/errors";
import { prepareClient, prepareClientWithBearer } from "../graphClient";
import type { DriveItem, EssentialFolderParts, UploadFileProps } from "./type";

export type ValidFolderReponse =
	| {
			exists: false;
	  }
	| {
			exists: true;
			folder: DriveItem;
	  };

export const isFolder = async (payload: {
	driveId: string;
	itemId: string;
	token: string;
}): Promise<boolean> => {
	const driveClient = payload.token
		? prepareClientWithBearer(payload.token)
		: prepareClient();
	const res = await driveClient.GET("/drives/{drive-id}/items/{driveItem-id}", {
		params: {
			path: {
				"drive-id": payload.driveId,
				"driveItem-id": payload.itemId,
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

export const uploadFile = async <T>(data: UploadFileProps): Promise<T> => {
	/*
		生成されたクライアントコードでこのエンドポイントAPIの使い方がいまいちよくわからない
		const driveClient = accessToken
			? prepareClientWithBearer(accessToken)
			: prepareClient();
		https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=http とbodyの型の乖離のため使用せず 
		const res = await driveClient.PUT(
			"/drives/{drive-id}/items/{driveItem-id}/content",
			{
				params: {
					path: {
						"drive-id": "",
						"driveItem-id": "",
					},
				},
				body: "",
			},
		);
		*/

	// 生fetchを使うことにする
	const res = await fetch(
		// 逆かもしれねェ
		`https://graph.microsoft.com/v1.0/drives/${data.distParentId}/items/${
			data.distDriveItemId
		}:/${encodeURIComponent(data.file.name)}:/content`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/octet-stream",
				Authorization: `Bearer ${data.token}`,
			},
			body: data.file,
		},
	);
	if (!res.ok) {
		const err = await res.json();
		throw err.error as unknown as GraphError;
	}
	return await res.json();
};

export const getDriveItemByNameUnderRoot = async (payload: {
	token: string;
	folderName: string;
}): Promise<DriveItem> => {
	// 現行のOASではpath-basedなOneDriveAPIが存在しないようである
	// https://learn.microsoft.com/en-us/graph/api/resources/driveitem?view=graph-rest-1.0
	// https://learn.microsoft.com/en-us/graph/onedrive-addressing-driveitems
	const accessToken = payload.token;
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
	const _driveId = driveId as string;
	const res = await isFolder({
		driveId: _driveId,
		itemId,
		token: payload.token,
	});
	if (!res) {
		throw new FolderNotFound(`${payload.folderName} is Not A Folder`);
	}
	return driveItem;
};
