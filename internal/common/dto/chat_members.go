package dto

type ChatMembersBody struct {
	ChatId  string `json:"chatId" binding:"reqiured"`
	Content string `json:"workbookname" binding:"required"`
}
