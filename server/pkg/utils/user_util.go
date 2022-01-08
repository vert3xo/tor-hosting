package utils

import (
	"fmt"
	"io/fs"
	"io/ioutil"
	"os"
	"os/user"
	"strconv"
	"strings"

	constants "github.com/vert3xo/hosting-server/pkg/data"
)

func SetupUser(username string) {
	os.Mkdir(fmt.Sprintf("%s/%s", constants.WEB_LOCATION, username), 0777)

	writeTorFiles(username)
	writeNginxFiles(username)
}

func DeleteUser(username string) {
	os.RemoveAll(fmt.Sprintf("%s/%s", constants.SERVICES_LOCATION, username))
	os.RemoveAll(fmt.Sprintf("%s/%s", constants.WEB_LOCATION, username))
	os.Remove(fmt.Sprintf("/etc/nginx/conf.d/%s.conf", username))
	deleteFromTo("/etc/tor/torrc", fmt.Sprintf("#%s start block", username), fmt.Sprintf("#%s end block", username))
	go RestartService("tor")
}

func writeNginxFiles(username string) {
	contentBytes, _ := os.ReadFile("./assets/site.sample.conf")

	contents := strings.Replace(string(contentBytes), "${username}", username, -1)
	os.WriteFile(fmt.Sprintf("/etc/nginx/conf.d/%s.conf", username), []byte(contents), 0644)

	copyFile("./assets/index.template.html", fmt.Sprintf("/var/www/%s/index.template.html", username), 0666)

	go RestartService("nginx")
}

func writeTorFiles(username string) {
	path := fmt.Sprintf("%s/%s", constants.SERVICES_LOCATION, username)
	os.Mkdir(path, 0700)
	ChownToUser(path, constants.TOR_USER)
	GenerateTorAddress(path)
	ChownToUser(path+"/hostname", constants.TOR_USER)
	ChownToUser(path+"/hs_ed25519_secret_key", constants.TOR_USER)
	ChownToUser(path+"/hs_ed25519_public_key", constants.TOR_USER)

	content, _ := os.ReadFile("/etc/tor/torrc")
	if !strings.Contains(string(content), fmt.Sprintf("#%s start block", username)) {
		f, _ := os.OpenFile("/etc/tor/torrc", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		defer f.Close()

		f.WriteString(
			fmt.Sprintf(
				"\n#%s start block\nHiddenServiceDir %s/%s\nHiddenServicePort 80 unix:/var/run/%s.sock\n#%s end block\n", username, constants.SERVICES_LOCATION, username, username, username,
			),
		)

		go RestartService("tor")
	}
}

func ChownToCurrentUser(path string) error {
	info, err := user.Current()
	if err != nil {
		return err
	}

	uid, err := strconv.Atoi(info.Uid)
	if err != nil {
		return err
	}

	gid, err := strconv.Atoi(info.Gid)
	if err != nil {
		return err
	}

	err = os.Chown(path, uid, gid)
	if err != nil {
		return err
	}

	return nil
}

func ChownToUser(path, username string) error {
	info, err := user.Lookup(username)
	if err != nil {
		return err
	}

	uid, err := strconv.Atoi(info.Uid)
	if err != nil {
		return err
	}

	gid, err := strconv.Atoi(info.Gid)
	if err != nil {
		return err
	}

	err = os.Chown(path, uid, gid)

	return err
}

func copyFile(oldPath, newPath string, perms fs.FileMode) {
	contentBytes, _ := os.ReadFile(oldPath)

	os.WriteFile(newPath, contentBytes, perms)
}

func deleteFromTo(filepath, from, to string) error {
	f, err := ioutil.ReadFile(filepath)
	if err != nil {
		return err
	}

	contents := strings.Split(string(f), "\n")

	blockFound := false
	for i, line := range contents {
		if line == from {
			blockFound = true
			contents[i] = ""
			continue
		}

		if line == to {
			contents[i] = ""
			contents[i+1] = ""
			break
		}

		if blockFound {
			contents[i] = ""
		}
	}

	file, err := os.OpenFile(filepath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}
	file.WriteString(strings.Join(contents[:], ""))
	defer file.Close()

	return nil
}
