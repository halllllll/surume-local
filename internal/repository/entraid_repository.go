package repository

import (
	"context"
	"database/sql"

	"github.com/halllllll/surume-local/internal/models"
)

type EntraIder interface {
	Count() (int, error)
	Get(context.Context) (*models.EntraIdApp, error)
	Set(context.Context, *models.EntraIdApp) error
	Update(context.Context, *models.EntraIdApp) error
}

type entraIdRepository struct {
	db *sql.DB
}

func NewEntraIdRepository(db *sql.DB) EntraIder {
	return &entraIdRepository{
		db,
	}
}

func (er *entraIdRepository) Count() (int, error) {
	var count int

	err := er.db.QueryRow("SELECT COUNT (*) FROM entraid_info").Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (er *entraIdRepository) Get(ctx context.Context) (*models.EntraIdApp, error) {
	var data models.EntraIdApp
	tx, err := er.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	stmt := `
		SELECT client_id, authority, created_at, localhost_port, updated_at FROM entraid_info
	`
	if err := tx.QueryRowContext(ctx, stmt).Scan(&data.ClientID, &data.Authority, &data.Created, &data.Port, &data.Updated); err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &data, nil
}

func (er *entraIdRepository) Set(ctx context.Context, data *models.EntraIdApp) error {
	stmt := `
		INSERT INTO entraid_info (client_id, authority, localhost_port) VALUES (?, ?, ?)
	`
	_, err := er.db.ExecContext(ctx, stmt, data.ClientID, data.Authority, data.Port)
	if err != nil {
		return err
	}
	return nil
}

func (er *entraIdRepository) Update(ctx context.Context, data *models.EntraIdApp) error {
	stmt := `
		UPDATE entraid_info SET client_id = ?, authority = ?, localhost_port = ?
	`
	_, err := er.db.ExecContext(ctx, stmt, data.ClientID, data.Authority, data.Port)
	if err != nil {
		return err
	}
	return nil

}
