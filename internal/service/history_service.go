package service

import "github.com/halllllll/surume-local/internal/transaction"

type HistoryServicer interface {
	// 未実装
}

type history struct {
	// 未実装
	// repository
	tx transaction.Transaction
}

func NewHistorySerivce(tx transaction.Transaction) HistoryServicer {
	return &history{tx}
}

// メソッド　未実装
