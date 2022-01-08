package user

import (
	"archive/zip"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	types "github.com/vert3xo/hosting-server/pkg"
	constants "github.com/vert3xo/hosting-server/pkg/data"
	"github.com/vert3xo/hosting-server/pkg/database"
	authorization "github.com/vert3xo/hosting-server/pkg/middleware"
	"github.com/vert3xo/hosting-server/pkg/utils"
	"golang.org/x/crypto/bcrypt"
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

	user.Post("/", func(c *fiber.Ctx) error {
		request := new(types.UserUpdateRequest)
		err := c.BodyParser(request)
		if err != nil || request.Password == "" {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: fiber.ErrBadRequest.Message})
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.ErrInternalServerError.Code).JSON(types.Response{Data: nil, Error: fiber.ErrInternalServerError.Message})
		}

		db.Model(&database.User{}).Where("username = ?", username).Update("password", string(hashed))

		return c.JSON(types.Response{Data: "Success!", Error: nil})
	})

	user.Post("/upload", func (c *fiber.Ctx) error {
		file, err := c.FormFile("files")
		if err != nil {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: fiber.ErrBadRequest.Message})
		}

		path := fmt.Sprintf("%s/%s/%s", constants.WEB_LOCATION, username, file.Filename)

		err = c.SaveFile(file, path)
		if err != nil {
			return c.Status(fiber.ErrInternalServerError.Code).JSON(types.Response{Data: nil, Error: fiber.ErrInternalServerError.Message})
		}

		reader, err := zip.OpenReader(path)
		if err != nil {
			return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: fiber.ErrBadRequest.Message})
		}

		for _, f := range reader.File {
			filePath := filepath.Clean(f.Name)
			if f.FileInfo().IsDir() {
				err := os.Mkdir(fmt.Sprintf("%s/%s/%s", constants.WEB_LOCATION, username, filePath), 0755)
				if err != nil {
					log.Println(err)
				}
				continue
			}

			file, err := os.OpenFile(fmt.Sprintf("%s/%s/%s", constants.WEB_LOCATION, username, filePath), os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
			if err != nil {
				log.Println(err)
				continue
			}
			defer file.Close()

			archived, err := f.Open()
			if err != nil {
				log.Println(err)
				continue
			}
			defer archived.Close()

			if _, err := io.Copy(file, archived); err != nil {
				log.Println(err)
				continue
			}

		}

		reader.Close()

		err = os.Remove(path)
		if err != nil {
			log.Printf("%s could not be removed!", path)
		}

		return c.JSON(types.Response{Data: "Archive unpacked", Error: nil})
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

	// onion.Post("/upload", func(c *fiber.Ctx) error {
	// 	file, err := c.FormFile("key")
	// 	if err != nil {
	// 		return c.JSON(types.Response{Data: nil, Error: err})
	// 	}

	// 	if file.Size != 96 {
	// 		return c.Status(fiber.ErrBadRequest.Code).JSON(types.Response{Data: nil, Error: fiber.ErrBadRequest.Message})
	// 	}

	// 	path := fmt.Sprintf("%s/%s", constants.SERVICES_LOCATION, username)

	// 	os.Remove(path + "/hostname")
	// 	os.Remove(path + "/hs_ed25519_secret_key")
	// 	os.Remove(path + "/hs_ed25519_public_key")

	// 	err = c.SaveFile(file, path + "/hs_ed25519_secret_key")
	// 	if err != nil {
	// 		return c.Status(fiber.ErrInternalServerError.Code).JSON(types.Response{Data: nil, Error: err})
	// 	}
	// 	utils.ChownToUser(path + "/hs_ed25519_secret_key", constants.TOR_USER)

	// 	go utils.RestartService("tor")

	// 	return c.JSON(types.Response{Data: file, Error: nil})
	// })

	user.Delete("/", func(c *fiber.Ctx) error {
		user := new(database.User)
		db.Where("username = ?", username).First(&user)
		utils.DeleteUser(username)
		db.Delete(&user);

		return c.JSON(types.Response{Data: "Account has been deleted", Error: nil})
	})
}
