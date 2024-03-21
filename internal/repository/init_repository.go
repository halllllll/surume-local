package repository

import (
	"context"
	"database/sql"
)

type Initer interface {
	InitEntraId(context.Context) error
	InitHistory(context.Context) error
}

type initStr struct {
	db *sql.DB
}

func NewIniter(db *sql.DB) Initer {
	return &initStr{db}
}

func (i *initStr) InitEntraId(ctx context.Context) error {
	tx, err := i.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	stmt := `
		DELETE FROM entraid_info
	`

	_, err = tx.ExecContext(ctx, stmt)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	return nil

}

func (i *initStr) InitHistory(ctx context.Context) error {
	// 未実装
	return nil
}
