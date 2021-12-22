package user

import (
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	types "github.com/vert3xo/hosting-server/pkg"
	constants "github.com/vert3xo/hosting-server/pkg/data"
	"github.com/vert3xo/hosting-server/pkg/database"
	authorization "github.com/vert3xo/hosting-server/pkg/middleware"
	"github.com/vert3xo/hosting-server/pkg/utils"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	var username string

	user := app.Group("/user", authorization.IsAuthorized, func(c *fiber.Ctx) error {
		user := new(database.User)

		token, _ := utils.VerifyToken(strings.Split(c.Get("Authorization", ""), " ")[1])
		claims := token.Claims.(jwt.MapClaims)

		db.Where("username = ?", claims["sub"].(string)).Limit(1).Find(&user)
		if *user == (database.User{}) {
			return c.Status(fiber.ErrUnauthorized.Code).JSON(types.Error{Msg: fiber.ErrUnauthorized.Message, Code: fiber.ErrUnauthorized.Code})
		}

		username = claims["sub"].(string)
		return c.Next()
	})

	user.Get("/", func(c *fiber.Ctx) error {
		user := new(database.User)
		db.Where("username = ?", username).First(&user)
		return c.JSON(types.Response{Data: user, Error: nil})
	})

	onion := user.Group("/onion", func(c *fiber.Ctx) error {
		return c.Next()
	})

	onion.Post("/regenerate", func(c *fiber.Ctx) error {
		path := fmt.Sprintf("%s/%s", constants.SERVICES_LOCATION, username)
		os.Remove(path + "/hostname")
		os.Remove(path + "/hs_ed25519_secret_key")
		os.Remove(path + "/hs_ed25519_public_key")

		utils.GenerateTorAddress(path)
		utils.ChownToUser(path + "/hostname", constants.TOR_USER)
		utils.ChownToUser(path + "/hs_ed25519_secret_key", constants.TOR_USER)
		utils.ChownToUser(path + "/hs_ed25519_public_key", constants.TOR_USER)

		address, err := os.ReadFile(path + "/hostname")
		if err != nil {
			return c.JSON(types.Response{Data: nil, Error: err})
		}

		db.Model(&database.User{}).Where("username = ?", username).Update("address", strings.Trim(string(address), "\n"))

		go utils.RestartService("tor")
		return c.JSON(types.Response{Data: "Address regenerated!", Error: nil})
	})

	user.Delete("/", func(c *fiber.Ctx) error {
		user := new(database.User)
		db.Where("username = ?", username).First(&user)
		utils.DeleteUser(username)
		db.Delete(&user);

		return c.JSON(types.Response{Data: "Account has been deleted", Error: nil})
	})
}
