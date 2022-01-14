package auth

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	types "github.com/vert3xo/hosting-server/pkg"
	constants "github.com/vert3xo/hosting-server/pkg/data"
	"github.com/vert3xo/hosting-server/pkg/database"
	"github.com/vert3xo/hosting-server/pkg/utils"
	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	app.Post("/:username/key_upload", func(c *fiber.Ctx) error {
		file, err := c.FormFile("key")
		if err != nil {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: err})
		}

		if file.Size != 96 {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: "Invalid Tor key file"})
		}

		err = c.SaveFile(file, fmt.Sprintf("/home/tor/hidden_services/%s/%s", c.Params("username"), "hs_ed25519_secret_key"))
		if err != nil {
			return c.Status(fiber.ErrBadGateway.Code).JSON(types.Response{Data: nil, Error: err})
		}

		return c.JSON(types.Response{Data: file, Error: nil})
	})

	app.Post("/register", func(c *fiber.Ctx) error {
		user := new(types.AuthRequest)

		if err := c.BodyParser(user); err != nil || user.Username == "" || user.Password == "" {
			c.Status(fiber.ErrBadRequest.Code)
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: "Invalid request"})
		}

		dbUser := new(database.User)

		db.Where("username = ?", user.Username).Limit(1).Find(&dbUser)

		if dbUser.Username != "" {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: "User already exists."})
		} else {

			hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
			if err != nil {
				c.Status(fiber.ErrInternalServerError.Code)
				return c.Status(fiber.ErrInternalServerError.Code).JSON(types.Response{Data: nil, Error: "An error occurred, please try again later."})
			}

			utils.SetupUser(user.Username)

			address, err := os.ReadFile(fmt.Sprintf("%s/%s/hostname", constants.SERVICES_LOCATION, user.Username))
			if err != nil {
				return c.Status(fiber.ErrInternalServerError.Code).JSON(types.Response{Data: nil, Error: err.Error()})
			}

			dbUser = &database.User{Username: user.Username, Password: string(hashed), Address: strings.Trim(string(address), "\n"), Admin: false}

			db.Create(&dbUser)

			return c.JSON(types.Response{Data: "Account created", Error: nil})
		}
	})

	app.Post("/login", func(c *fiber.Ctx) error {
		user := new(types.AuthRequest)

		if err := c.BodyParser(user); err != nil || user.Username == "" || user.Password == "" {
			c.Status(fiber.ErrBadRequest.Code)
			return c.JSON(types.Response{Data: nil, Error: "Invalid request"})
		}

		dbUser := new(database.User)

		db.Where("username = ?", user.Username).Limit(1).Find(&dbUser)

		if (dbUser.Username == "" || bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)) != nil) {
			c.Status(fiber.ErrNotFound.Code)
			return c.JSON(types.Response{Data: nil, Error: "Invalid credentials"})
		}

		if dbUser.Disabled {
			return c.Status(fiber.ErrUnauthorized.Code).JSON(types.Response{Data: nil, Error: "Your account is disabled!"})
		}

		access_token, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 6).Unix(),
			Issuer: "hosting",
			Subject: user.Username,
			Id: fmt.Sprint(0),
		}).SignedString(constants.SIGNING_KEY)

		refresh_token, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
			Issuer: "hosting",
			Subject: user.Username,
			Id: fmt.Sprint(1),
		}).SignedString(constants.SIGNING_KEY)

		c.Cookie(&fiber.Cookie{
			Name: "refresh_token",
			Value: refresh_token,
			Expires: time.Now().Add(time.Hour * 24 * 7),
			HTTPOnly: true,
		})

		return c.JSON(types.Response{Data: map[string]string{
			"access_token": access_token,
		}, Error: nil})
	})
}