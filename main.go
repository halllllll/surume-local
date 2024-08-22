package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	fileserver "github.com/halllllll/surume-local/file-server"
	"github.com/halllllll/surume-local/frontend"
	"github.com/halllllll/surume-local/internal/common/config"
	"github.com/halllllll/surume-local/internal/db"
	"github.com/halllllll/surume-local/internal/router"
	"github.com/pkg/browser"
	sloggin "github.com/samber/slog-gin"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

// info: Makefileのbuild参照。`make build`時にプロダクション用の値をセットする
var AppMode string

func main() {
	// go run(make dev)時と実行ファイルの実行時でカレントディレクトリを切り替える
	if err := os.Setenv("ENV", AppMode); err != nil {
		log.Fatal(err)
	}
	if os.Getenv("ENV") == string(config.EnvProd) {
		os.Setenv("GIN_MODE", "release")
		gin.SetMode(gin.ReleaseMode)
	}

	if err := run(context.Background()); err != nil {
		log.Printf("failed to terminated server: %v", err)
		os.Exit(1)
	}

}

func run(ctx context.Context) error {
	cfg, err := config.New()
	if err != nil {
		return err
	}
	datapath, err := cfg.CheckEnv()
	if err != nil {
		return err
	}
	db, cleanupdb, err := db.NewDB(ctx, datapath)
	if err != nil {
		return err
	}
	defer cleanupdb()
	logger, cleanuplog, err := cfg.CreateAppLog(datapath)
	if err != nil {
		return err
	}
	defer cleanuplog()

	staticServer := fileserver.NewStaticFileServer()

	r := gin.Default()
	r.ContextWithFallback = true

	// middlewares

	r.Use(sloggin.New(logger[string(config.GinLog)]))
	r.Use(gin.Recovery())
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			fmt.Sprintf("http://%s", cfg.Address),
			fmt.Sprintf("http://127.0.0.1:%d", cfg.Port),
		},
		AllowMethods: []string{
			"POST",
			"GET",
			"DELETE",
			"PUT",
			"OPTIONS", // for preflight request
		},
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
			"X-CSRF-Token",
			"accept",
			"origin",
			"Cache-Control",
			"X-Request-With",
		},
		AllowCredentials: true,           // need cookie
		MaxAge:           24 * time.Hour, //
	}))
	router.SetRoutes(r, db, logger[string(config.AppLog)])
	// static file server
	router.SetStaticFileRoutes(r, staticServer, logger[string(config.AppLog)])

	if cfg.Env == config.EnvProd {
		// フロントの埋め込みファイル参照はルーティング設定のあとにしないと404が返る
		frontend.RegisterHandlers(r)
		fileserver.RegisterHandlers(r)
		// TODO: ポート検知したい
		if err := browser.OpenURL(fmt.Sprintf("http://%s", cfg.Address)); err != nil {
			logger[string(config.AppLog)].Error(err.Error())
		}
	} else if cfg.Env == config.EnvDev {
		frontend.SetupProxy(r)
		fileserver.SetupProxy(r)
	}

	// err = r.Run(fmt.Sprintf(":%d", cfg.Port))
	// return err

	// graceful shutdown(air環境だと動作しないっぽい　ビルド後だと動作する)

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger[string(config.AppLog)].Error(fmt.Sprintf("down: %s", err.Error()))
		}
	}()

	quit := make(chan os.Signal, 10)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger[string(config.AppLog)].Info("shutdown server...")
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger[string(config.AppLog)].Info(fmt.Sprintf("shutdown server: %s", err.Error()))
		return err
	}
	select {
	case <-ctx.Done():
		logger[string(config.AppLog)].Info("timeout of 5 seconds.")
	}

	return err

}
