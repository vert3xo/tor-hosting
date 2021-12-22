package database

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Database struct {
	Gorm	*gorm.DB
}

func NewDatabase(user, password, dbName string) Database {
	db, err := gorm.Open(mysql.Open(fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/%s?parseTime=true", user, password, dbName)), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	return Database{Gorm: db}
}