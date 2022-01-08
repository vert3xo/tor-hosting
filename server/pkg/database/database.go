package database

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Database struct {
	Gorm	*gorm.DB
}

func NewDatabase(user, password, dbName, dbHost, dbPort string) Database {
	db, err := gorm.Open(mysql.Open(fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, dbHost, dbPort, dbName)), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	return Database{Gorm: db}
}