package main

import (
	"bytes"
	"crypto/ed25519"
	"crypto/sha512"
	"encoding/base32"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"golang.org/x/crypto/sha3"
)

func main() {
	if len(os.Args) != 2 {
		return
	}

	stat, err := os.Stat(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}

	if stat.IsDir() {
		generateNew()
	} else {
		loadSecretKey()
	}
}

func generateNew() {
	publicKey, secretKey, err := ed25519.GenerateKey(nil)
	if err != nil {
		log.Fatal(err)
	}

	hash := sha512.Sum512(secretKey[:32])
	hash[0] &= 248
	hash[31] &= 127
	hash[31] |= 64

	var checksumBytes bytes.Buffer
	checksumBytes.Write([]byte(".onion checksum"))
	checksumBytes.Write(publicKey)
	checksumBytes.Write([]byte{0x03})
	checksum := sha3.Sum256(checksumBytes.Bytes())

	var addressBytes bytes.Buffer
	addressBytes.Write([]byte(publicKey))
	addressBytes.Write([]byte(checksum[:2]))
	addressBytes.Write([]byte{0x03})

	hostname := strings.ToLower(base32.StdEncoding.EncodeToString(addressBytes.Bytes()) + ".onion")

	fmt.Println(".onion address:", hostname)
	path := os.Args[1]

	ioutil.WriteFile(path+"/hostname", []byte(hostname + "\n"), 0600)
	ioutil.WriteFile(path+"/hs_ed25519_secret_key", append([]byte("== ed25519v1-secret: type0 ==\x00\x00\x00"), hash[:]...), 0600)
	ioutil.WriteFile(path+"/hs_ed25519_public_key", append([]byte("== ed25519v1-public: type0 ==\x00\x00\x00"), publicKey...), 0600)
}

func loadSecretKey() {
	path := os.Args[1]
	secretKeyExp, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	privateKey := ed25519.NewKeyFromSeed(secretKeyExp[32:64])
	publicKey := privateKey.Public().(ed25519.PublicKey)

	var checksumBytes bytes.Buffer
	checksumBytes.Write([]byte(".onion checksum"))
	checksumBytes.Write(publicKey)
	checksumBytes.Write([]byte{0x03})
	checksum := sha3.Sum256(checksumBytes.Bytes())

	var addressBytes bytes.Buffer
	addressBytes.Write([]byte(publicKey))
	addressBytes.Write([]byte(checksum[:2]))
	addressBytes.Write([]byte{0x03})

	hostname := strings.ToLower(base32.StdEncoding.EncodeToString(addressBytes.Bytes()) + ".onion")

	fmt.Println(hostname)
}
