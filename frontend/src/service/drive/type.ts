import type { components } from "@/types/oas";

// TODO

export type DriveItemResponse =
	components["responses"]["microsoft.graph.driveItemCollectionResponse"]["content"]["application/json"]["value"]; // DriveItemのコレクションが返る

export type DriveItem = components["schemas"]["microsoft.graph.driveItem"];

// export type BaseItem = components["schemas"]["microsoft.graph.driveItem"];

export type EssentialFolderParts = {
	userId?: string;
	parentFolderId: string;
	targetFolderId: string;
	folderName: string;
};
