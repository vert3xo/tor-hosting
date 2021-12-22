package main

import (
	types "github.com/vert3xo/hosting-server/pkg"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/vert3xo/hosting-server/pkg/database"
	"github.com/vert3xo/hosting-server/pkg/router"
)

const (
  dbName = "hosting"
  dbUser = "vert3xo"
  dbPass = "vgui6sx2"
)

func main() {
  app := fiber.New()
  app.Use(cors.New(cors.Config{
    AllowOrigins: "http://localhost:3000, http://127.0.0.1:3000",
    AllowCredentials: true,
  }))

  db := database.NewDatabase(dbUser, dbPass, dbName)
  db.Gorm.AutoMigrate(&database.User{})

  r := router.NewRouter(app, db)
  r.SetupRoutes()

  app.Get("/", func(c *fiber.Ctx) error {
    return c.SendString("Hello, World!")
  })

  app.All("/coffee", func(c *fiber.Ctx) error {
    c.Status(fiber.ErrTeapot.Code)
    return c.JSON(types.Response{Data: nil, Error: "The server is a teapot."})
  })

  app.Listen(":5000")
}
