package dto

type EntraIdInput struct {
	ClientId  string `json:"clientid" binding:"required"`
	Authority string `json:"authority" binding:"required"`
	Port      int    `json:"port" binding:"required"`
}

type AccountInfo struct {
	EntraIdUserName string `json:"username" binding:"required"`
}
