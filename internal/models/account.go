package models

type AccountID string

type User struct {
	AccountID AccountID `json:"account_id" db:"user_id"`
}
