package dto

type ChatMessage struct {
	Name            string `json:"name"`
	ChatId          string `json:"chatId" binding:"reqiured"`
	Content         string `json:"content" binding:"required"`
	AttachementPath string `json:"attachementPath"`
}
