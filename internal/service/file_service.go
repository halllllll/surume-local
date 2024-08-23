package service

import (
	"context"
	"fmt"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"slices"
	"strings"

	"github.com/halllllll/surume-local/internal/common/dto"
	"github.com/halllllll/surume-local/internal/repository"
	"github.com/halllllll/surume-local/internal/transaction"
	"github.com/xuri/excelize/v2"
)

// TODO: とりあえず最小限のバリデーションだけ実装する
type FileServicer interface {
	CheckBroadcastTemplate(context.Context, http.Request) ([]dto.ChatMessage, error)
	CheckChatmembersTemplate(context.Context, http.Request) ([]dto.ChatMembersBody, error)
}

type fileServicer struct {
	repo repository.Filer
	tx   transaction.Transaction
}

func NewFileServicer(repo repository.Filer, tx transaction.Transaction) FileServicer {
	return &fileServicer{repo, tx}
}

func retrieve_xlsx(formDataKey dto.FormDataKey, req http.Request) (multipart.File, func(), error) {
	file, header, err := req.FormFile(string(formDataKey))
	if err != nil {
		return nil, nil, fmt.Errorf("no such formdata key")
	}

	close := func() {
		file.Close()
	}

	if header.Header.Get("Content-Type") != dto.XlsxMimeType {
		return nil, close, fmt.Errorf("invlid mime")
	}

	fileName := header.Filename
	if filepath.Ext(fileName) != ".xlsx" {
		return nil, close, fmt.Errorf("invalid file extension")
	}
	return file, close, nil
}

func (fs *fileServicer) CheckBroadcastTemplate(ctx context.Context, req http.Request) ([]dto.ChatMessage, error) {
	file, close, err := retrieve_xlsx(dto.TemplateXlsxFormDataKey, req)
	defer close()

	excel, err := excelize.OpenReader(file)
	if err != nil {
		return nil, err
	}
	defer excel.Close()

	// TODO: ハードコーディングするよりstatic serverからテンプレートを取得して比較したほうがいい気がする
	sheets := excel.GetSheetList()
	// correct sheet name
	if !slices.Contains(sheets, dto.TemplateXlsxSheetName) {
		return nil, fmt.Errorf("invalid sheet name")
	}
	rows, err := excel.GetRows(dto.TemplateXlsxSheetName)
	if err != nil {
		return nil, err
	}
	// empty
	if len(rows) == 1 {
		return nil, fmt.Errorf("no data")
	}

	// upto
	if len(rows)-1 > dto.MaxBroadcast {
		return nil, fmt.Errorf("Over Maximum Count: %d", dto.MaxBroadcast)
	}

	// TODO: 必要なデータに整形して返す
	res := make([]dto.ChatMessage, len(rows)-1)

	for i, row := range rows[1:] {
		var chat dto.ChatMessage
		for j, cell := range row {
			if j == 0 {
				chat.Name = cell
			} else if j == 1 {
				chat.ChatId = strings.TrimSpace(cell)
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

func (fs *fileServicer) CheckChatmembersTemplate(ctx context.Context, req http.Request) ([]dto.ChatMembersBody, error) {
	// valid sheet name

	return nil, nil
}
