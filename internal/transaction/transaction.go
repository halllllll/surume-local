package transaction

import (
	"context"
)

// 実は未実装

type Transaction interface {
	DoTx(context.Context, func(context.Context) error) error
}
