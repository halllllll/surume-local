package service

import (
	"context"
	"fmt"

	"github.com/halllllll/surume-local/internal/models"
	"github.com/halllllll/surume-local/internal/repository"
	"github.com/halllllll/surume-local/internal/transaction"
)

type Result string

var (
	Update Result = "UPDATE"
	Create Result = "CREATE"
)

type EntraIdServicer interface {
	DataExist() (bool, error)
	SetData(context.Context, *models.EntraIdApp) (Result, error)
	GetSingleRecordData(context.Context) (bool, *models.EntraIdApp, error)
	// Reset(context.Context, []string) error
}

type entraidService struct {
	repo repository.EntraIder
	tx   transaction.Transaction
}

func NewEntraIdService(repo repository.EntraIder, tx transaction.Transaction) EntraIdServicer {
	return &entraidService{repo, tx}
}

func (es *entraidService) DataExist() (bool, error) {
	count, err := es.repo.Count()
	if err != nil {
		return false, err
	}
	if count == 0 {
		return false, nil
	}
	return true, nil
}

func (es *entraidService) GetSingleRecordData(ctx context.Context) (bool, *models.EntraIdApp, error) {
	count, err := es.repo.Count()
	if err != nil {
		return false, nil, err
	}
	if count == 0 {
		return false, nil, nil
	}
	if count > 1 {
		return true, nil, fmt.Errorf("invalid database status (expected single record, but %d)", count)
	}
	info, err := es.repo.Get(ctx)
	if err != nil {
		return false, nil, err
	}
	return true, info, nil
}

func (es *entraidService) SetData(ctx context.Context, data *models.EntraIdApp) (Result, error) {
	var err error
	var result Result
	exist, _, err := es.GetSingleRecordData(ctx)
	if err != nil {
		return "", err
	}
	if exist {
		// 更新
		result = Update
		err = es.tx.DoTx(ctx, func(ctx context.Context) error {
			return es.repo.Update(ctx, data)
		})
	} else {
		// 新規追加
		result = Create
		err = es.tx.DoTx(ctx, func(ctx context.Context) error {
			return es.repo.Set(ctx, data)
		})
	}

	if err != nil {
		return "", err
	}
	return result, nil
}
