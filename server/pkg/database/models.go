package database

import "gorm.io/gorm"

type Status int

type User struct {
	gorm.Model
	Username	string
	Password	string
	Address		string
	Status		Status `gorm:"default:0"`
}

const (
	Online Status = iota
	Offline
	Error
)