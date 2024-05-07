import type { components } from "@/types/oas";

// TODO

export type DriveItemResponse =
	components["responses"]["microsoft.graph.driveItemCollectionResponse"]["content"]["application/json"]["value"]; // DriveItemのコレクションが返る

export type DriveItem = components["schemas"]["microsoft.graph.driveItem"];

// export type RequiredDrive = SomeRequired<
// 	DriveItem,
// 	"id" | "parentReference" | "eTag" | "cTag" | "folder"
// >;
// export type RequiredFile = SomeRequired<
// 	DriveItem,
// 	"id" | "parentReference" | "eTag" | "cTag" | "file"
// >;

// export type BaseItem = components["schemas"]["microsoft.graph.driveItem"];

export type EssentialFolderParts = {
	userId?: string;
	parentFolderId: string;
	targetFolderId: string;
	folderName: string;
};

export type UploadFileProps = {
	token: string;
	distDriveItemId: string;
	distParentId: string;
	file: File;
};

export type UploadFilesProps = {
	token: string;
	distDriveItemId: string;
	distParentId: string;
	files: File[];
};
