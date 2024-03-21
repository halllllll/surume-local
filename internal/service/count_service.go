package service

import (
	"context"
	"log/slog"

	"github.com/halllllll/surume-local/internal/models"
	"github.com/halllllll/surume-local/internal/repository"
	"github.com/halllllll/surume-local/internal/transaction"
)

type CountServicer interface {
	Set(context.Context, int) error
	Get(context.Context, int) (*models.Count, error)
	GetAll(context.Context) (*models.Counts, error)
}

type countService struct {
	repo repository.Counter
	tx   transaction.Transaction
	log  *slog.Logger
}

func NewCountSerivce(repo repository.Counter, tx transaction.Transaction, logger *slog.Logger) CountServicer {
	return &countService{repo: repo, tx: tx, log: logger}
}

func (cs *countService) Set(ctx context.Context, count int) error {
	err := cs.tx.DoTx(ctx, func(ctx context.Context) error {
		return cs.repo.Add(ctx, models.CountValue(count))
	})
	if err != nil {
		return err
	}
	return nil
}

func (cs *countService) Get(ctx context.Context, id int) (*models.Count, error) {
	// getほにゃらら系はとりあえずトランザクションを貼らない
	return cs.repo.FindById(ctx, models.CountId(id))
}

func (cs *countService) GetAll(ctx context.Context) (*models.Counts, error) {
	return cs.repo.FindAll(ctx)
}
