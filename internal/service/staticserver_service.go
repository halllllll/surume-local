package service

import (
	"context"
	"embed"
	"log/slog"
)

type StaticServrerer interface {
	Get(context.Context, string) ([]byte, int64, error)
}

type static struct {
	fs     *embed.FS
	logger *slog.Logger
}

func NewStaticServer(fs *embed.FS, logger *slog.Logger) StaticServrerer {
	return &static{fs, logger}
}

func (s *static) Get(ctx context.Context, filepath string) ([]byte, int64, error) {
	f, err := s.fs.Open(filepath)
	if err != nil {
		return nil, 0, err
	}
	defer f.Close()
	fileinfo, err := f.Stat()
	if err != nil {
		return nil, 0, err
	}
	data, err := s.fs.ReadFile(filepath)
	if err != nil {
		return nil, 0, err
	}
	return data, fileinfo.Size(), nil
}
