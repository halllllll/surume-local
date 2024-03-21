package main

import (
	"context"
	"io"
	"log"
	"os"

	"github.com/halllllll/surume-local/internal/common/config"
	"github.com/halllllll/surume-local/internal/db"
)

func main() {
	f, err := os.Open("./migrate/iikanji-ni-suru.sql")
	if err != nil {
		log.Fatal(err)
	}
	content, err := io.ReadAll(f)
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	cfg, err := config.New()
	if err != nil {
		log.Fatal(err)
	}
	datapath, err := cfg.CheckEnv()
	if err != nil {
		log.Fatal(err)
	}
	db, cleanupdb, err := db.NewDB(ctx, datapath)
	if err != nil {
		log.Fatal(err)
	}
	defer cleanupdb()

	_, err = db.ExecContext(ctx, string(content))
	if err != nil {
		log.Fatal(err)
	}
	log.Println("DONE")
}
