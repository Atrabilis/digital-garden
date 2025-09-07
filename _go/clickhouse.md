---
title: "Clickhouse"
layout: default
---

# Notes on Go integration for Clickhouse

## Create and test connection
```go
package main

import (
	"fmt"
	"log"
	"os"

	ch "github.com/ClickHouse/clickhouse-go/v2"
	dotenv "github.com/joho/godotenv"
)

func main() {
	//Load .env file within same directory
	err := dotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	//Connect to ClickHouse
	conn, err := ch.Open(&ch.Options{
		Addr: []string{os.Getenv("CH_IP") + ":" + os.Getenv("CH_PORT")},
		Auth: ch.Auth{
			Database: "my_db",
			Username: os.Getenv("CH_USER"),
			Password: os.Getenv("CH_PASSWORD"),
		},
		Protocol: ch.HTTP, // HTTP and Native supported
	})
	if err != nil {
		log.Fatalf("Failed to connect to ClickHouse: %v", err)
	}
	defer conn.Close()

	//Test connection
	ver, err := conn.ServerVersion()
	if err != nil {
		log.Fatalf("Failed to get server version: %v", err)
	}
	fmt.Println("Server version:", ver)
}
```