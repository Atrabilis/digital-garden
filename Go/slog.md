# Notes on Slog

```go
package main

import (
	"log/slog"
	"os"
)

func main() {

	// Log Levels explanation (with priority values):
	// DEBUG: Priority -4, Detailed information for debugging purposes (lowest priority)
	// INFO:  Priority  0, General information about application flow and important events
	// WARN:  Priority  4, Warning messages for potentially harmful situations that don't stop execution
	// ERROR: Priority  8, Error events that might still allow the application to continue running
	// FATAL: Priority 12, Severe errors that will presumably lead the application to abort (highest priority)
	//
	// Example with Level: slog.LevelInfo (priority 0):
	// - DEBUG messages (priority -4) will NOT be shown (< 0)
	// - INFO messages (priority 0) will be shown (>= 0)
	// - WARN messages (priority 4) will be shown (>= 0)
	// - ERROR messages (priority 8) will be shown (>= 0)

	//loggerJson options
	options := slog.HandlerOptions{
		Level:     slog.LevelError,
		AddSource: true, // Add source file and line number to the log message
	}

	// JSON Logger with different levels
	loggerJSON := slog.New(slog.NewJSONHandler(os.Stdout, &options))
	loggerJSON.Info("Server Started", "port", 8080, "host", "localhost")
	loggerJSON.Warn("Server Warning", "port", 8080, "host", "localhost")
	loggerJSON.Debug("Server Debug", "port", 8080, "host", "localhost")
	loggerJSON.Error("Server Crashed", "port", 8080, "host", "localhost")

	loggerText := slog.New(slog.NewTextHandler(os.Stdout, nil))
	loggerText.Info("Hello, World!")
}

//{"time":"2025-09-03T19:50:09.688176017-04:00","level":"ERROR","msg":"Server Crashed","port":8080,"host":"localhost"}
//time=2025-09-03T19:50:09.688-04:00 level=INFO msg="Hello, World!"

```