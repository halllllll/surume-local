package dto

// oasでも定義されてるスキーマ
type Target int // エイリアスにする

var TargetList []string = []string{
	"entraid_info",
	"history",
}

func (t Target) String() string {
	return TargetList[t]
}

const (
	EtraId_Info Target = iota
	History
)

type InitTargetRequest struct {
	Targets []string `form:"targets" url:"targets" binding:"required"`
}
