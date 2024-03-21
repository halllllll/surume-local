export const chatKeys = {
	just: ["chats"] as const,
	paginate: (page: string) => [...chatKeys.just, page] as const,
} as const;
