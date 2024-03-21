package repository

import (
	"context"
	"database/sql"
	"log/slog"
)

// TODO: 後で実装する とりあえず保存とかは考えずサービスでバリデーションのみする
type Filer interface {
	Get(ctx context.Context)
	Delete(ctx context.Context)
	Save(ctx context.Context)
}

type fileRepository struct {
	db     *sql.DB
	logger *slog.Logger
}

func NewFileRepository(db *sql.DB, logger *slog.Logger) Filer {
	return &fileRepository{db, logger}
}

func (sr *fileRepository) Get(ctx context.Context) {

}

func (sr *fileRepository) Delete(ctx context.Context) {

}

func (sr *fileRepository) Save(ctx context.Context) {

}
