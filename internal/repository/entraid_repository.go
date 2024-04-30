package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/halllllll/surume-local/internal/models"
)

type EntraIder interface {
	Count() (int, error)
	GetEntraIdInfo(context.Context) (*models.EntraIdApp, error)
	SetEntraIdInfo(context.Context, *models.EntraIdApp) error
	UpdateEntraIdInfo(context.Context, *models.EntraIdApp) error

	SetAccountID(context.Context, *models.AccountID) error
	GetAccountID(context.Context, *models.AccountID) (*models.User, error)
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

func (er *entraIdRepository) GetEntraIdInfo(ctx context.Context) (*models.EntraIdApp, error) {
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

func (er *entraIdRepository) SetEntraIdInfo(ctx context.Context, data *models.EntraIdApp) error {
	stmt := `
		INSERT INTO entraid_info (client_id, authority, localhost_port) VALUES (?, ?, ?)
	`
	_, err := er.db.ExecContext(ctx, stmt, data.ClientID, data.Authority, data.Port)
	if err != nil {
		return err
	}
	return nil
}

func (er *entraIdRepository) UpdateEntraIdInfo(ctx context.Context, data *models.EntraIdApp) error {
	stmt := `
		UPDATE entraid_info SET client_id = ?, authority = ?, localhost_port = ?
	`
	_, err := er.db.ExecContext(ctx, stmt, data.ClientID, data.Authority, data.Port)
	if err != nil {
		return err
	}
	return nil
}

func (er *entraIdRepository) GetAccountID(ctx context.Context, id *models.AccountID) (*models.User, error) {
	var user models.User
	tx, err := er.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	stmt := `
		SELECT user_id FROM user WHERE user_id = ?
	`
	if err := tx.QueryRowContext(ctx, stmt, id).Scan(&user); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	fmt.Println("やったね！")
	return &user, nil
}

func (er *entraIdRepository) SetAccountID(ctx context.Context, id *models.AccountID) error {

	stmt := `
		INSERT INTO user (user_id) VALUES (?)
		ON CONFLICT (user_id)
		DO NOTHING
	`
	_, err := er.db.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}
	return nil
}
