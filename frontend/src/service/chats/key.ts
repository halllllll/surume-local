export const chatKeys = {
	just: ["chats"] as const,
	member: ["member"] as const,
	paginate: (page: string) => [...chatKeys.just, page] as const,
	members: (chatId: string) => [...chatKeys.member, chatId],
} as const;
