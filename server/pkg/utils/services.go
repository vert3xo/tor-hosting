package utils

import (
	"os/exec"

	constants "github.com/vert3xo/hosting-server/pkg/data"
)

func RestartService(name string) {
	exec.Command("systemctl", "reload", name).Run()
}

func GenerateTorAddress(path string) {
	exec.Command(constants.ADDRESS_GENERATOR, path).Run()
}