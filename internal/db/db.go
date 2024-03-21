package db

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"path/filepath"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

//go:embed schema.sql
var schema embed.FS

func NewDB(ctx context.Context, datapath string) (*sql.DB, func(), error) {
	db, err := sql.Open("sqlite3", filepath.Join(datapath, "surume.db"))

	if err != nil {
		return nil, func() {}, err
	}
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		fmt.Println("database connection failed")
		return nil, func() { _ = db.Close() }, err
	}

	schema, err := schema.ReadFile("schema.sql")
	if err != nil {
		return nil, func() {}, err
	}

	_, err = db.ExecContext(ctx, string(schema))
	if err != nil {
		return nil, func() { _ = db.Close() }, err
	}

	return db, func() { _ = db.Close() }, nil
}
