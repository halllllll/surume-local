import type { components } from "@/types/oas";

export type ChatsAPIResponse =
	components["responses"]["microsoft.graph.chatCollectionResponse"]["content"]["application/json"];

export type ChatMembers =
	components["responses"]["microsoft.graph.conversationMemberCollectionResponse"]["content"]["application/json"];

// export type ConversationMembers =
// 	components["responses"]["microsoft.graph.conversationCollectionResponse"]["content"]["application/json"];

export type Chat = components["schemas"]["microsoft.graph.chat"];

export type ConversationMember =
	components["schemas"]["microsoft.graph.conversationMember"];
