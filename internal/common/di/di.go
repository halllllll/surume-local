package di

import (
	"database/sql"
	"embed"
	"log/slog"

	"github.com/halllllll/surume-local/internal/controller"
	"github.com/halllllll/surume-local/internal/repository"
	"github.com/halllllll/surume-local/internal/service"
)

func InitCount(db *sql.DB, logger *slog.Logger) controller.CountControler {
	tx := repository.NewTransaction(db)

	r := repository.NewCountRepository(db, logger)
	s := service.NewCountSerivce(r, tx, logger)

	return controller.NewCountController(s, logger)
}

func InitEntraId(db *sql.DB) controller.EntraIdControllerer {
	// tx := repository.NewTransaction(db)

	r := repository.NewEntraIdRepository(db)
	s := service.NewEntraIdService(r, repository.NewTransaction(db))

	return controller.NewEntraIdController(s)
}

func InitStaticServer(srv *embed.FS, logger *slog.Logger) controller.StaticFileContorollerer {

	// embedしたディレクトリにあるファイルをControllerで返す
	s := service.NewStaticServer(srv, logger)
	return controller.NewStaticServerController(s)

}

func Init(db *sql.DB, logger *slog.Logger) controller.InitControllerer {
	tx := repository.NewTransaction(db)

	r := repository.NewIniter(db)
	s := service.NewInitService(r, tx)

	return controller.NewInitController(s)
}

func Utils(db *sql.DB, logger *slog.Logger) controller.FileControllerer {
	tx := repository.NewTransaction(db)
	r := repository.NewFileRepository(db, logger)
	s := service.NewFileServicer(r, tx)

	return controller.NewFileController(s)

}
