import type { ChatLogsParam } from "@/scheme/chatLogs";

export const chatKeys = {
	just: ["chats"] as const,
	member: ["member"] as const,
	log: ["logs"] as const,
	paginate: (page: string) => [...chatKeys.just, page] as const,
	members: (chatId: string) => [...chatKeys.member, chatId] as const,
	logs: (p: ChatLogsParam) =>
		[...chatKeys.log, p.chatId + p.dateFrom + p.dateTo] as const,
} as const;
