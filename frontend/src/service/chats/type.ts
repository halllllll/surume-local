import type { ChatLogsParam } from "@/layout/ChatLogs";
import type { components } from "@/types/oas";

export type ChatsAPIResponse =
	components["responses"]["microsoft.graph.chatCollectionResponse"]["content"]["application/json"];

export type ChatMembers =
	components["responses"]["microsoft.graph.conversationMemberCollectionResponse"]["content"]["application/json"];

export type ChatData =
	components["responses"]["microsoft.graph.chatMessageCollectionResponse"]["content"]["application/json"];

export type ChatUser = {
	"@odata.type": "microsoft.graph.identitySet";
} & Omit<components["schemas"]["microsoft.graph.identity"], "@odata.type">;
// | (Record<string, unknown> | null)

// export type ConversationMembers =
// 	components["responses"]["microsoft.graph.conversationCollectionResponse"]["content"]["application/json"];

export type ChatMessage = components["schemas"]["microsoft.graph.chatMessage"];

export type ConversationMember =
	components["schemas"]["microsoft.graph.conversationMember"];

export type ChatLogsParamWithNextLink = ChatLogsParam & {
	nextLink: string | null | undefined;
};
