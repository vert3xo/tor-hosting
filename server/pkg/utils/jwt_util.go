package utils

import (
	"github.com/golang-jwt/jwt"
	constants "github.com/vert3xo/hosting-server/pkg/data"
)

func VerifyToken(token string) (*jwt.Token, bool) {
	if token == "" {
		return nil, false
	}
	parsed, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return constants.SIGNING_KEY, nil
	})
	
	if err == nil {
		return parsed, true
	}
	return nil, false
}
