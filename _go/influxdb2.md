---
title: "Influxdb2"
layout: default
---

# Notes on Influxdb2 integration on Go

## Connect to Influx
```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	dotenv "github.com/joho/godotenv"
)

func main() {
	//Load .env file within same directory
	err := dotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	//create client, url and token required
	client := influxdb2.NewClient(os.Getenv("INFLUX_URL"), os.Getenv("INFLUX_TOKEN"))

    //Verify connection, does not verify credentials
	ping, err := client.Ping(context.Background())
	if err != nil {
		log.Fatalf("Error pinging InfluxDB: %v", err)
	}
	fmt.Println(ping) //true in case of success,
}

```

## Write API with asyncronous channel to handle errors

```go
writeAPI := client.WriteAPI(os.Getenv("INFLUXDB_ORG"), os.Getenv("PSDA"))
errCh := writeAPI.Errors()
go func() {
	for err := range errCh {
		fmt.Println("Error writing to InfluxDB", err)
	}
}()
```
