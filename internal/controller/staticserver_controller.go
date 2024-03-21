package controller

import (
	"errors"
	"fmt"
	"io/fs"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/halllllll/surume-local/internal/service"
)

type StaticFileContorollerer interface {
	GetFile(*gin.Context)
}

type staticFiler struct {
	service service.StaticServrerer
}

// 静的ファイルサーバーなのでserviceやrepositoryは介さないことにする
func NewStaticServerController(service service.StaticServrerer) StaticFileContorollerer {
	return &staticFiler{service: service}
}

func (sf *staticFiler) GetFile(ctx *gin.Context) {
	filename := ctx.Param("filepath")
	data, size, err := sf.service.Get(ctx, "static"+filename)
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			ctx.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "not found",
			})
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   err.Error(),
			})
		}
		return
	}
	ctx.Header("Content-Disposition", "attachment; filename="+filepath.Base(filename))
	ctx.Header("Content-Type", "application/text/plain")
	ctx.Header("Accept-Length", fmt.Sprintf("%d", size))
	ctx.Writer.Write(data)
	ctx.JSON(http.StatusOK, gin.H{
		"msg": "Download file successfully",
	})
	return
}
