package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	types "github.com/vert3xo/hosting-server/pkg"
	jwt_util "github.com/vert3xo/hosting-server/pkg/utils"
)

const BEARER string = "Bearer"

func IsAuthorized(c *fiber.Ctx) error {
	authorization := strings.Split(c.Get("Authorization", ""), " ")
	if len(authorization) != 2 || authorization[0] != BEARER {
		return c.Status(fiber.ErrUnauthorized.Code).JSON(types.Error{Msg: fiber.ErrUnauthorized.Message, Code: fiber.ErrUnauthorized.Code})
	}

	if _, ok := jwt_util.VerifyToken(authorization[1]); !ok {
		return c.Status(fiber.ErrUnauthorized.Code).JSON(types.Error{Msg: fiber.ErrUnauthorized.Message, Code: fiber.ErrUnauthorized.Code})
	}

	return c.Next()
}
