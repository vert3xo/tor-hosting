package admin

import (
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	types "github.com/vert3xo/hosting-server/pkg"
	constants "github.com/vert3xo/hosting-server/pkg/data"
	"github.com/vert3xo/hosting-server/pkg/database"
	authorization "github.com/vert3xo/hosting-server/pkg/middleware"
	"github.com/vert3xo/hosting-server/pkg/utils"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	var username string

	admin := app.Group("/admin", authorization.IsAuthorized, func(c *fiber.Ctx) error {
		user := new(database.User)

		token, _ := utils.VerifyToken(strings.Split(c.Get("Authorization", ""), " ")[1])
		claims := token.Claims.(jwt.MapClaims)

		db.Where("username = ?", claims["sub"].(string)).Limit(1).Find(&user)
		if *user == (database.User{}) || !user.Admin {
			return c.Status(fiber.ErrUnauthorized.Code).JSON(types.Response{Data: nil, Error: fiber.ErrUnauthorized.Message})
		}

		username = user.Username
		return c.Next()
	})

	adminUser := admin.Group("/user")

	adminUser.Get("/", func(c *fiber.Ctx) error {
		var users []database.User
		db.Model(database.User{}).Find(&users)

		return c.JSON(types.Response{Data: users, Error: nil})
	})

	adminUser.Post("/create", func(c *fiber.Ctx) error {
		user := new(types.CreateUserRequest)
		if err := c.BodyParser(user); err != nil || user.Username == "" || user.Password == "" || user == (&types.CreateUserRequest{}) {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: fiber.ErrBadRequest.Message})
		}

		dbUser := new(database.User)
		db.Where("username = ?", user.Username).Limit(1).Find(dbUser)
		if dbUser.Username != "" {
			return c.Status(fiber.ErrConflict.Code).JSON(types.Response{Data: nil, Error: "User already exists!"})
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.ErrInternalServerError.Code).JSON(types.Response{Data: nil, Error: fiber.ErrInternalServerError.Message})
		}

		utils.SetupUser(user.Username)

		address, err := os.ReadFile(fmt.Sprintf("%s/%s/hostname", constants.SERVICES_LOCATION, username))
		if err != nil {
			return c.Status(fiber.ErrInternalServerError.Code).JSON(types.Response{Data: nil, Error: fiber.ErrInternalServerError.Message})
		}

		dbUser = &database.User{Username: user.Username, Password: string(hashed), Address: strings.Trim(string(address), "\n"), Admin: user.Admin}

		db.Create(&dbUser)

		return c.JSON(types.Response{Data: "User created", Error: nil})
	})
	
	adminUser.Post("/:username", func(c *fiber.Ctx) error {
		username := c.Params("username")

		if (!utils.UserExists(username, *db)) {
			return c.Status(fiber.ErrNotFound.Code).JSON(types.Response{Data: nil, Error: "User does not exist!"})
		}

		update := new(types.UserUpdateRequest)

		err := c.BodyParser(update)

		if err != nil || update.Password == "" {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: fiber.ErrBadRequest.Message})
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(update.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.ErrInternalServerError.Code).JSON(types.Response{Data: nil, Error: fiber.ErrInternalServerError.Message})
		}

		db.Model(&database.User{}).Where("username = ?", username).Update("password", string(hashed))

		return c.JSON(types.Response{Data: "Password changed", Error: nil})
	})

	adminUser.Post("/enable/:username", func(c *fiber.Ctx) error {
		username := c.Params("username")

		if (!utils.UserExists(username, *db)) {
			return c.Status(fiber.ErrNotFound.Code).JSON(types.Response{Data: nil, Error: "User does not exist!"})
		}

		db.Model(&database.User{}).Where("username = ?", username).Update("disabled", 0)

		return c.JSON(types.Response{Data: "Account has been enabled", Error: nil})
	})

	adminUser.Post("/disable/:username", func(c *fiber.Ctx) error {
		username := c.Params("username")

		if (!utils.UserExists(username, *db)) {
			return c.Status(fiber.ErrNotFound.Code).JSON(types.Response{Data: nil, Error: "User does not exist!"})
		}

		db.Model(&database.User{}).Where("username = ?", username).Update("disabled", true)

		return c.JSON(types.Response{Data: "Account has been disabled!", Error: nil})
	})

	adminUser.Delete("/:username", func(c *fiber.Ctx) error {
		username := c.Params("username")

		user := new(database.User)
		db.Where("username = ?", username).Limit(1).Find(user)

		if user == (&database.User{}) {
			return c.Status(fiber.ErrNotFound.Code).JSON(types.Response{Data: nil, Error: fiber.ErrNotFound.Message})
		}

		utils.DeleteUser(username)
		db.Delete(&user)

		return c.JSON(types.Response{Data: "User deleted!", Error: nil})
	})
}
