package utils

import (
	"github.com/vert3xo/hosting-server/pkg/database"
	"gorm.io/gorm"
)

func UserExists(username string, db gorm.DB) bool {
	user := new(database.User)
	db.Where("username = ?", username).Limit(1).Find(&user)

	return user != (&database.User{})
}