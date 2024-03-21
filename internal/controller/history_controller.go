package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/halllllll/surume-local/internal/service"
)

type HistoryControllerer interface {
	Setlog(*gin.Context) // 未実装
}

func NewHistoryController(service service.HistoryServicer) HistoryControllerer {
	return &historyController{service}
}

type historyController struct {
	service service.HistoryServicer
}

func (hc *historyController) Setlog(ctx *gin.Context) {
	// 未実装
}
