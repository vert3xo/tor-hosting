package database

import "gorm.io/gorm"

type Status int

type User struct {
	gorm.Model
	Username	string
	Password	string
	Address		string
	Disabled	bool	`gorm:"default:false"`
	Status		Status	`gorm:"default:0"`
	Admin		bool	`gorm:"default:false"`
}

const (
	Online Status = iota
	Offline
	Error
)