---
title: "Lumberjack"
layout: default
---

#notes on Lumberjack

```go
package main

import (
	"log/slog"
	"os"
	"time"

	"gopkg.in/natefinch/lumberjack.v2"
)

func main() {
	// ----------------------------------------------------------
	// STEP 1. Configure a lumberjack rotating writer
	// ----------------------------------------------------------
	// lumberjack.Logger implements io.Writer with rotation logic.
	// Fields:
	//   Filename   -> path to the "current" active log file
	//   MaxSize    -> maximum size in MB before rotating (0 = no limit)
	//   MaxAge     -> maximum number of days to keep old log files (0 = forever)
	//   MaxBackups -> maximum number of old log files to retain (0 = keep all)
	//   LocalTime  -> use local time in rotated file names (false = UTC)
	//   Compress   -> gzip old log files (true) or keep plain (false)
	//
	// Important:
	// - Rotation happens *on write*, not in a background goroutine.
	// - app.log will always be the active file; older ones will be renamed.
	// - Old files will be deleted/compressed depending on MaxBackups/MaxAge.
	lj := &lumberjack.Logger{
		Filename:   "app.json", // "active" log file (always written to)
		MaxSize:    1,          // rotate after 1 MB (for testing)
		MaxBackups: 3,          // keep at most 3 old files
		MaxAge:     7,          // keep rotated files for 7 days
		Compress:   true,       // compress old files with gzip
	}

	// ----------------------------------------------------------
	// STEP 2. Create a slog Handler that writes JSON logs to lumberjack
	// ----------------------------------------------------------
	// slog.NewJSONHandler takes any io.Writer. Because lumberjack.Logger
	// implements io.Writer, it can be used directly here.
	//
	// HandlerOptions:
	//   Level -> minimum log level to write (default = INFO)
	//   AddSource -> if true, include source file:line (costs performance)
	handler := slog.NewJSONHandler(lj, &slog.HandlerOptions{
		Level: slog.LevelInfo, // only INFO, WARN, ERROR logs will be written
	})

	// ----------------------------------------------------------
	// STEP 3. Create a Logger from the handler
	// ----------------------------------------------------------
	// slog.New(handler) returns a Logger. You can also attach fixed
	// attributes using .With(...). Those attributes will appear in every log.
	logger := slog.New(handler).With(
		slog.String("service", "app"),
		slog.String("env", "dev"),
		slog.String("version", "1.0.0"),
	)

	// ----------------------------------------------------------
	// STEP 4. Write some logs
	// ----------------------------------------------------------
	// slog levels: Debug, Info, Warn, Error
	logger.Info("server started", "port", 8080)
	logger.Warn("high latency", "path", "/users", "duration_ms", 950)
	logger.Error("db timeout", "operation", "SELECT", "retryable", true)

	// ----------------------------------------------------------
	// STEP 5. Force many logs to exceed 1 MB and trigger rotation
	// ----------------------------------------------------------
	// Once app.json exceeds 1 MB, lumberjack will:
	//   - Rename app.json -> app-<timestamp>.log.gz
	//   - Create a new empty app.json
	//   - Enforce MaxBackups (3) and MaxAge (7 days)
	for i := 0; i < 10000; i++ {
		logger.Info("looping", "iteration", i, "ts", time.Now().UTC())
	}

	// ----------------------------------------------------------
	// RESULT:
	// ----------------------------------------------------------
	// In the directory you will see:
	//   app.json                        -> active log file
	//   app-2025-09-04T05-35-15.log.gz  -> old compressed copy
	//   app-2025-09-04T05-35-30.log.gz  -> next rotated copy
	//   ...
	// At most 3 rotated files (MaxBackups=3) will be kept, and older than
	// 7 days (MaxAge=7) will be deleted.
	//
	// Each line inside the logs is JSON, e.g.:
	// {
	//   "time":"2025-09-04T05:35:15Z",
	//   "level":"INFO",
	//   "msg":"server started",
	//   "service":"app",
	//   "env":"dev",
	//   "version":"1.0.0",
	//   "port":8080
	// }
	//
	// This makes logs structured and ready for ingestion in ELK, Loki, etc.
	//
	// ----------------------------------------------------------
	// END
}
```