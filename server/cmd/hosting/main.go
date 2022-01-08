package main

import (
	"log"

	"github.com/joho/godotenv"
	types "github.com/vert3xo/hosting-server/pkg"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/vert3xo/hosting-server/pkg/database"
	"github.com/vert3xo/hosting-server/pkg/router"

	"os"
)

func main() {
  if godotenv.Load() != nil {
    log.Fatal("Error loading .env file!")
  }

  app := fiber.New()
  app.Use(cors.New(cors.Config{
    AllowOrigins: "http://localhost:3000, http://127.0.0.1:3000",
    AllowCredentials: true,
  }))

  db := database.NewDatabase(os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), )

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
