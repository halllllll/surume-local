package service

import (
	"context"

	"github.com/halllllll/surume-local/internal/common/dto"
	"github.com/halllllll/surume-local/internal/repository"
	"github.com/halllllll/surume-local/internal/transaction"
)

type InitServicer interface {
	DeleteTarget(context.Context, []dto.Target) error
}

type initService struct {
	repo repository.Initer
	tx   transaction.Transaction
}

func NewInitService(repo repository.Initer, tx transaction.Transaction) InitServicer {
	return &initService{repo, tx}
}

func (is *initService) DeleteTarget(ctx context.Context, targets []dto.Target) error {
	for _, v := range targets {
		switch v.String() {
		case "entraid_info":
			err := is.tx.DoTx(ctx, func(ctx context.Context) error {
				return is.repo.InitEntraId(ctx)
			})
			if err != nil {
				return err
			}

		case "history":
			// 未実装  is.repo.InitHistory()
		}
	}
	return nil
}
