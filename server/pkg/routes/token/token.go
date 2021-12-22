package token

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	types "github.com/vert3xo/hosting-server/pkg"
	constants "github.com/vert3xo/hosting-server/pkg/data"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	app.Post("/refresh_token", func (c *fiber.Ctx) error {
		token := c.Cookies("refresh_token");

		if token == "" {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: "refresh_token not provided."})
		}

		tokenParsed, _ := jwt.Parse(token, func (t *jwt.Token) (interface{}, error) {
			return constants.SIGNING_KEY, nil
		})

		if claims, ok := tokenParsed.Claims.(jwt.MapClaims); ok {
			access_token, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
				ExpiresAt: time.Now().Add(time.Hour * 6).Unix(),
				Issuer: "hosting",
				Subject: claims["sub"].(string),
				Id: fmt.Sprint(0),
			}).SignedString(constants.SIGNING_KEY)

			return c.JSON(types.Response{Data: access_token, Error: nil})
		}
		return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: "Invalid refresh_token."})
	})
}
