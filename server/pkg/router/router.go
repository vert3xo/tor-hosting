package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/vert3xo/hosting-server/pkg/database"
	"github.com/vert3xo/hosting-server/pkg/routes/auth"
	"github.com/vert3xo/hosting-server/pkg/routes/token"
	"github.com/vert3xo/hosting-server/pkg/routes/user"
)

type Router struct {
	App	*fiber.App
	DB	database.Database
}

func NewRouter(App *fiber.App, DB database.Database) Router {
	return Router{
		App: App,
		DB: DB,
	}
}

func (this Router) SetupRoutes() {
	auth.SetupRoutes(this.App, this.DB.Gorm)
	token.SetupRoutes(this.App, this.DB.Gorm)
	user.SetupRoutes(this.App, this.DB.Gorm)
}
