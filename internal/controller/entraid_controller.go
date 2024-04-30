package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/halllllll/surume-local/internal/common/dto"
	"github.com/halllllll/surume-local/internal/models"
	"github.com/halllllll/surume-local/internal/service"
)

type EntraIdControllerer interface {
	Setup(*gin.Context)
	GetInfo(*gin.Context)
	SetAccountInfo(*gin.Context)
}

type entraIdController struct {
	service service.EntraIdServicer
}

func NewEntraIdController(service service.EntraIdServicer) EntraIdControllerer {
	return &entraIdController{service: service}
}

func (ec *entraIdController) GetInfo(ctx *gin.Context) {
	exist, data, err := ec.service.GetSingleRecordData(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}
	if !exist {
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"exist":   false,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"exist":   true,
		"data":    data,
	})
	return
}

func (ec *entraIdController) Setup(ctx *gin.Context) {
	// 確認

	var input dto.EntraIdInput
	if err := ctx.ShouldBindJSON(&input); err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}
	var data *models.EntraIdApp = &models.EntraIdApp{
		Authority: models.EntraAuthority(input.Authority),
		ClientID:  models.EntraClientID(input.ClientId),
		Port:      models.EntraLocalHostPost(input.Port),
	}
	result, err := ec.service.SetData(ctx, data)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}
	var status int
	switch result {
	case service.Update:
		status = http.StatusOK
	case service.Create:
		status = http.StatusCreated
	default:
		status = http.StatusInternalServerError
	}
	ctx.JSON(status, gin.H{
		"success": true,
		"result":  result,
	})
}

func (ec *entraIdController) SetAccountInfo(ctx *gin.Context) {
	var input dto.AccountInfo
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}
	var data *models.User = &models.User{AccountID: models.AccountID(input.EntraIdUserName)}
	_, err := ec.service.SetAccount(ctx, data)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"result":  fmt.Sprintf("echo: %s", input.EntraIdUserName),
	})
	return
}
