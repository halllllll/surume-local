package service

import (
	"context"
	"fmt"
	"net/http"
	"path/filepath"
	"slices"

	"github.com/halllllll/surume-local/internal/common/dto"
	"github.com/halllllll/surume-local/internal/repository"
	"github.com/halllllll/surume-local/internal/transaction"
	"github.com/xuri/excelize/v2"
)

// TODO: とりあえず最小限のバリデーションだけ実装する
type FileServicer interface {
	CheckTemplate(context.Context, http.Request) ([]dto.ChatMessage, error)
}

type fileServicer struct {
	repo repository.Filer
	tx   transaction.Transaction
}

func NewFileServicer(repo repository.Filer, tx transaction.Transaction) FileServicer {
	return &fileServicer{repo, tx}
}

func (fs *fileServicer) CheckTemplate(ctx context.Context, req http.Request) ([]dto.ChatMessage, error) {
	file, header, err := req.FormFile(dto.TemplateXlsxFormDataKey)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	if header.Header.Get("Content-Type") != dto.XlsxMimeType {
		return nil, fmt.Errorf("invlid mime")
	}

	fileName := header.Filename
	if filepath.Ext(fileName) != ".xlsx" {
		return nil, fmt.Errorf("invalid file extension")
	}

	excel, err := excelize.OpenReader(file)
	if err != nil {
		return nil, err
	}
	defer excel.Close()

	// TODO: ハードコーディングするよりstatic serverからテンプレートを取得して比較したほうがいい気がする
	sheets := excel.GetSheetList()
	if !slices.Contains(sheets, dto.TemplateXlsxSheetName) {
		return nil, fmt.Errorf("invalid sheet name")
	}
	rows, err := excel.GetRows(dto.TemplateXlsxSheetName)
	if err != nil {
		return nil, err
	}
	if len(rows) == 1 {
		return nil, fmt.Errorf("no data")
	}

	// 上限
	if len(rows)-1 > dto.MaximumRowCount {
		return nil, fmt.Errorf("Over Maximum Count: %d", dto.MaximumRowCount)
	}
	// TODO: 必要なデータに整形して返す
	res := make([]dto.ChatMessage, len(rows)-1)

	for i, row := range rows[1:] {
		var chat dto.ChatMessage
		for j, cell := range row {
			if j == 0 {
				chat.Name = cell
			} else if j == 1 {
				chat.ChatId = cell
			} else if j == 2 {
				chat.Content = cell
			}
		}
		if chat.ChatId == "" || chat.Content == "" {
			return nil, fmt.Errorf("exist empty cell")
		}
		res[i] = chat
	}
	if len(res) < 1 {
		return nil, fmt.Errorf("no data")
	}
	// TODO: いったん全部送ってみる
	return res, nil
}
