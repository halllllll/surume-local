package router

import (
	"database/sql"
	"embed"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/halllllll/surume-local/internal/common/di"
)

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
	return
}

func SetRoutes(r *gin.Engine, db *sql.DB, logger *slog.Logger) {

	countCtrl := di.InitCount(db, logger)
	r.MaxMultipartMemory = 15 << 20 // 15 MiB
	api := r.Group("/api")

	utilsCtrl := di.Utils(db, logger)
	entraIdCtrl := di.InitEntraId(db)
	delete := di.Init(db, logger)

	{
		api.GET("/entraid", entraIdCtrl.GetInfo)
		api.POST("/system/entraid", entraIdCtrl.Setup)
		api.DELETE("/system/reset", delete.Reset)

		api.POST("/count", countCtrl.AddCount)
		api.GET("/count/:id", countCtrl.GetCount)
		api.GET("/count", countCtrl.GetCounts)
		api.POST("/util/validateTemplate", utilsCtrl.ValidateTemplate)
	}

	r.GET("/health", healthHandler)
}

func SetStaticFileRoutes(r *gin.Engine, server *embed.FS, logger *slog.Logger) {
	staticFileServer := r.Group("/static")
	static := di.InitStaticServer(server, logger)

	staticFileServer.GET("/*filepath", static.GetFile)

}
