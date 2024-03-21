package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/halllllll/surume-local/internal/service"
)

type FileControllerer interface {
	ValidateTemplate(*gin.Context)
}

type fileControllerer struct {
	service service.FileServicer
}

func NewFileController(service service.FileServicer) FileControllerer {
	return &fileControllerer{service}
}

func (fc *fileControllerer) ValidateTemplate(ctx *gin.Context) {
	body, err := fc.service.CheckTemplate(ctx, *ctx.Request)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    body,
	})
	return
}
