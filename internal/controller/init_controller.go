package controller

import (
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/halllllll/surume-local/internal/common/dto"
	"github.com/halllllll/surume-local/internal/service"
)

type InitControllerer interface {
	Reset(*gin.Context)
}

type sys struct {
	system service.InitServicer
}

// データ割り振り（Deleteだけ独自）
func NewInitController(system service.InitServicer) InitControllerer {
	return &sys{
		system: system,
	}
}

func (s *sys) Reset(ctx *gin.Context) {
	// ここで割り振る
	// とりあえず配列として受け取れるかテスト
	var req dto.InitTargetRequest
	if err := ctx.Bind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	slices.Sort(req.Targets)
	targets := slices.Compact(req.Targets)
	filterd := []dto.Target{}
	for _, v := range targets {
		if slices.Contains(dto.TargetList, v) {
			idx := dto.Target(slices.Index(dto.TargetList, v))
			filterd = append(filterd, idx)
		}
	}
	if len(filterd) == 0 {
		// ctx.Status(http.StatusOK)
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    nil,
		})
		return
	}

	if err := s.system.DeleteTarget(ctx, filterd); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}
	ctx.Status(http.StatusNoContent)
}
