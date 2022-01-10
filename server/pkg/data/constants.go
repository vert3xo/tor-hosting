package constants

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var SIGNING_KEY = []byte(os.Getenv("JWT_SECRET"))
var SERVICES_LOCATION = "/home/tor/hidden_services"
var WEB_LOCATION = "/var/www"
var ADDRESS_GENERATOR = "/home/vert3xo/Documents/school/hosting/onion_utils/address_generator"
var TOR_USER = "tor"

func ConstsInit() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}