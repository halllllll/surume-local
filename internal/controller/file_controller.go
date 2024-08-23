package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/halllllll/surume-local/internal/common/dto"
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
	var body any
	var err error
	var req dto.TemplateXlsxRequest
	if err = ctx.Bind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest,
			gin.H{
				"success": false,
				"error":   err.Error(),
			})
		return
	}
	// TODO: とりあえずrequest typeはvalidate以外今のところ思いつかないので無視してtargetだけ考える

	switch req.Target {
	case "broadcast":
		body, err = fc.service.CheckBroadcastTemplate(ctx, *ctx.Request)
	default:
		err = fmt.Errorf("invalid target")
	}

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
