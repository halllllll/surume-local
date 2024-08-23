package dto

type FormDataKey string

const (
	TemplateXlsxFormDataKey FormDataKey = "xlsx"
	XlsxMimeType            string      = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	TemplateXlsxSheetName   string      = "payload"
	MaxBroadcast            int         = 200
)

var TemplateXlsxHeader = []string{"Target(only for view)", "*chat id", "*content"}

type RequestType string

var (
	Validate RequestType = "validate"
)

type RequestTo string

var (
	Broadcast   RequestTo = "broadcast"
	ChatMembers RequestTo = "chatmembers"
)

type TemplateXlsxRequest struct {
	Target RequestTo   `form:"target"`
	Type   RequestType `form:"type"`
}
