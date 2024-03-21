package models

import "time"

// entity
type EntraClientID string
type EntraAuthority string
type EntraLocalHostPost int

type EntraIdApp struct {
	ClientID  EntraClientID      `json:"clientid" db:"client_id"`
	Authority EntraAuthority     `json:"authority" db:"authority"`
	Port      EntraLocalHostPost `json:"port" db:"localhost_port"`
	Created   time.Time          `json:"created" db:"created_at"`
	Updated   time.Time          `json:"updated" db:"updated_at"`
}
