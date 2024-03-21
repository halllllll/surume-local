package dto

const (
	TemplateXlsxFormDataKey string = "target"
	XlsxMimeType            string = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	TemplateXlsxSheetName   string = "payload"
	MaximumRowCount         int    = 200
)

var TemplateXlsxHeader = []string{"Target(only for view)", "*chat id", "*content"}
