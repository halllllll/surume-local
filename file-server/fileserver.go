package fileserver

import (
	"embed"
	"fmt"
	"log"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	static "github.com/soulteary/gin-static"
)

var (
	//go:embed static/*
	storage embed.FS
	devPort int = 5173 // vite dev server port
)

func NewStaticFileServer() *embed.FS {
	return &storage
}

// for production
func RegisterHandlers(r *gin.Engine) {
	// 静的ファイル(embed対応)へのアクセスを設定
	r.Use(static.ServeEmbed("static", storage))
}

// for development
func SetupProxy(r *gin.Engine) {
	targetURL, err := url.Parse(fmt.Sprintf("http://localhost:%d", devPort))
	if err != nil {
		log.Fatal(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	r.NoRoute(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.URL.Path, "/static") {
			proxy.ServeHTTP(c.Writer, c.Request)
		} else if c.Request.URL.Path == "/static" {
			c.Request.URL.Path = "/"
			r.HandleContext(c)
		} else {
			c.Next()
		}
	})
}
