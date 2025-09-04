# Notes on Slog

## Example script
```go
package main

import (
	"fmt"
	"log/slog"
	"os"
	"time"
)

func main() {

	// Log Levels explanation (with priority values):
	// DEBUG: -4 | INFO: 0 | WARN: 4 | ERROR: 8
	// Default handler level is INFO (so DEBUG is hidden unless Level <= DEBUG)

	// Handler options
	options := slog.HandlerOptions{
		Level:     slog.LevelDebug,
		AddSource: true, // Add source file and line number to the log message

		// ReplaceAttr is called for EVERY attribute (time, level, msg, and your key/values).
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			// Debug output to observe what's being processed
			fmt.Println(">>> ReplaceAttr invoked")
			fmt.Println("groups:", groups) // shows the active group stack, e.g. [] or [http] or [http request]
			fmt.Println("key   :", a.Key)
			fmt.Println("value :", a.Value)

			// Example 1: Modify specific attributes based on their key
			if a.Key == "port" {
				fmt.Println("   -> 'port' detected, modifying value")
				a.Value = slog.AnyValue("Port has been modified")
			}

			// Example 2: Pretty timestamp (rename 'time' -> 'timestamp' with RFC3339Nano)
			if a.Key == slog.TimeKey {
				return slog.String("timestamp", a.Value.Time().UTC().Format(time.RFC3339Nano))
			}

			// Example 3: Rename "msg" -> "message"
			if a.Key == slog.MessageKey {
				return slog.Attr{Key: "message", Value: a.Value}
			}

			// Return the (possibly modified) attribute
			return a
		},
	}

	// JSON Logger
	loggerJSON := slog.New(slog.NewJSONHandler(os.Stdout, &options))

	// 0) Ungrouped logs (top-level attributes)
	loggerJSON.Info("Server Started", "port", 8080, "host", "localhost")
	fmt.Println("--------------------------------")
	loggerJSON.Warn("Server Warning", "port", 8080, "host", "localhost")
	fmt.Println("--------------------------------")
	loggerJSON.Debug("Server Debug", "port", 8080, "host", "localhost")
	fmt.Println("--------------------------------")
	loggerJSON.Error("Server Crashed", "port", 8080, "host", "localhost")
	fmt.Println("================================")

	// 1) Single group: "http"
	httpLogger := loggerJSON.WithGroup("http")
	httpLogger.Info("request handled",
		"method", "GET",
		"path", "/healthz",
		"status", 200,
	)
	fmt.Println("================================")

	// 2) Another single group: "serial"
	serialLogger := loggerJSON.WithGroup("serial")
	serialLogger.Warn("device warning",
		"port", "ttyUSB0",
		"baudrate", 9600,
	)
	fmt.Println("================================")

	// 3) Nested groups: http -> request
	httpReqLogger := loggerJSON.WithGroup("http").WithGroup("request")
	httpReqLogger.Debug("request details",
		"id", "req-123",
		"method", "POST",
		"path", "/api/items",
		"latency_ms", 42,
	)
	fmt.Println("================================")

	// 4) Sibling groups in a single log line using slog.Group(...)
	// This does NOT change the logger; it just adds grouped attributes to THIS log entry.
	loggerJSON.Info("multiple groups example",
		slog.Group("http",
			slog.String("method", "PUT"),
			slog.String("path", "/api/users"),
			slog.Int("status", 204),
		),
		slog.Group("serial",
			slog.String("port", "ttyACM0"),
			slog.Int("baudrate", 115200),
		),
	)
	fmt.Println("================================")

	// 5) Another domain: "db" group
	dbLogger := loggerJSON.WithGroup("db")
	dbLogger.Error("query failed",
		"query", "SELECT * FROM users WHERE id=$1",
		"args", []int{42},
		"rows", 0,
		"took_ms", 17,
	)

	// 6) Text handler for human-readable output (dev convenience)
	loggerText := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level:     slog.LevelDebug,
		AddSource: true,
	}))
	loggerText.Info("Hello, World! (text handler)")
}

```

## Output

```
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.561898514 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : INFO
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 54}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 54
>>> ReplaceAttr invoked
groups: []
key   : msg
value : Server Started
>>> ReplaceAttr invoked
groups: []
key   : port
value : 8080
   -> 'port' detected, modifying value
>>> ReplaceAttr invoked
groups: []
key   : host
value : localhost
{"timestamp":"2025-09-04T01:46:59.561898514Z","level":"INFO","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":54},"message":"Server Started","port":"Port has been modified","host":"localhost"}
--------------------------------
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.56243416 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : WARN
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 56}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 56
>>> ReplaceAttr invoked
groups: []
key   : msg
value : Server Warning
>>> ReplaceAttr invoked
groups: []
key   : port
value : 8080
   -> 'port' detected, modifying value
>>> ReplaceAttr invoked
groups: []
key   : host
value : localhost
{"timestamp":"2025-09-04T01:46:59.56243416Z","level":"WARN","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":56},"message":"Server Warning","port":"Port has been modified","host":"localhost"}
--------------------------------
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.56256996 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : DEBUG
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 58}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 58
>>> ReplaceAttr invoked
groups: []
key   : msg
value : Server Debug
>>> ReplaceAttr invoked
groups: []
key   : port
value : 8080
   -> 'port' detected, modifying value
>>> ReplaceAttr invoked
groups: []
key   : host
value : localhost
{"timestamp":"2025-09-04T01:46:59.56256996Z","level":"DEBUG","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":58},"message":"Server Debug","port":"Port has been modified","host":"localhost"}
--------------------------------
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.562706697 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : ERROR
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 60}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 60
>>> ReplaceAttr invoked
groups: []
key   : msg
value : Server Crashed
>>> ReplaceAttr invoked
groups: []
key   : port
value : 8080
   -> 'port' detected, modifying value
>>> ReplaceAttr invoked
groups: []
key   : host
value : localhost
{"timestamp":"2025-09-04T01:46:59.562706697Z","level":"ERROR","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":60},"message":"Server Crashed","port":"Port has been modified","host":"localhost"}
================================
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.562846636 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : INFO
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 65}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 65
>>> ReplaceAttr invoked
groups: []
key   : msg
value : request handled
>>> ReplaceAttr invoked
groups: [http]
key   : method
value : GET
>>> ReplaceAttr invoked
groups: [http]
key   : path
value : /healthz
>>> ReplaceAttr invoked
groups: [http]
key   : status
value : 200
{"timestamp":"2025-09-04T01:46:59.562846636Z","level":"INFO","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":65},"message":"request handled","http":{"method":"GET","path":"/healthz","status":200}}
================================
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.56297918 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : WARN
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 74}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 74
>>> ReplaceAttr invoked
groups: []
key   : msg
value : device warning
>>> ReplaceAttr invoked
groups: [serial]
key   : port
value : ttyUSB0
   -> 'port' detected, modifying value
>>> ReplaceAttr invoked
groups: [serial]
key   : baudrate
value : 9600
{"timestamp":"2025-09-04T01:46:59.56297918Z","level":"WARN","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":74},"message":"device warning","serial":{"port":"Port has been modified","baudrate":9600}}
================================
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.56311242 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : DEBUG
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 82}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 82
>>> ReplaceAttr invoked
groups: []
key   : msg
value : request details
>>> ReplaceAttr invoked
groups: [http request]
key   : id
value : req-123
>>> ReplaceAttr invoked
groups: [http request]
key   : method
value : POST
>>> ReplaceAttr invoked
groups: [http request]
key   : path
value : /api/items
>>> ReplaceAttr invoked
groups: [http request]
key   : latency_ms
value : 42
{"timestamp":"2025-09-04T01:46:59.56311242Z","level":"DEBUG","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":82},"message":"request details","http":{"request":{"id":"req-123","method":"POST","path":"/api/items","latency_ms":42}}}
================================
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.563261676 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : INFO
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 92}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 92
>>> ReplaceAttr invoked
groups: []
key   : msg
value : multiple groups example
>>> ReplaceAttr invoked
groups: [http]
key   : method
value : PUT
>>> ReplaceAttr invoked
groups: [http]
key   : path
value : /api/users
>>> ReplaceAttr invoked
groups: [http]
key   : status
value : 204
>>> ReplaceAttr invoked
groups: [serial]
key   : port
value : ttyACM0
   -> 'port' detected, modifying value
>>> ReplaceAttr invoked
groups: [serial]
key   : baudrate
value : 115200
{"timestamp":"2025-09-04T01:46:59.563261676Z","level":"INFO","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":92},"message":"multiple groups example","http":{"method":"PUT","path":"/api/users","status":204},"serial":{"port":"Port has been modified","baudrate":115200}}
================================
>>> ReplaceAttr invoked
groups: []
key   : time
value : 2025-09-03 21:46:59.563427857 -0400 -04
>>> ReplaceAttr invoked
groups: []
key   : level
value : ERROR
>>> ReplaceAttr invoked
groups: []
key   : source
value : &{main.main /home/angel/Desktop/repos/digital-garden/go-test/test.go 107}
>>> ReplaceAttr invoked
groups: []
key   : function
value : main.main
>>> ReplaceAttr invoked
groups: []
key   : file
value : /home/angel/Desktop/repos/digital-garden/go-test/test.go
>>> ReplaceAttr invoked
groups: []
key   : line
value : 107
>>> ReplaceAttr invoked
groups: []
key   : msg
value : query failed
>>> ReplaceAttr invoked
groups: [db]
key   : query
value : SELECT * FROM users WHERE id=$1
>>> ReplaceAttr invoked
groups: [db]
key   : args
value : [42]
>>> ReplaceAttr invoked
groups: [db]
key   : rows
value : 0
>>> ReplaceAttr invoked
groups: [db]
key   : took_ms
value : 17
{"timestamp":"2025-09-04T01:46:59.563427857Z","level":"ERROR","source":{"function":"main.main","file":"/home/angel/Desktop/repos/digital-garden/go-test/test.go","line":107},"message":"query failed","db":{"query":"SELECT * FROM users WHERE id=$1","args":[42],"rows":0,"took_ms":17}}
time=2025-09-03T21:46:59.563-04:00 level=INFO source=/home/angel/Desktop/repos/digital-garden/go-test/test.go:119 msg="Hello, World! (text handler)"
```

Slog receives a io.writer as destiny so you can write to a file too

```go
package main

import (
	"log"
	"log/slog"
	"os"
)

func main() {
	logfile, err := os.OpenFile("log.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer logfile.Close()

	logger := slog.New(slog.NewTextHandler(logfile, nil))

	logger.Info("Hello, World!")

}
```

or you can write to multiple destinies with io.MultiWriter

```go
package main

import (
	"io"
	"log/slog"
	"os"
)

func main() {
	f, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	multi := io.MultiWriter(os.Stdout, f)

	logger := slog.New(slog.NewJSONHandler(multi, nil))

	logger.Info("server started", "port", 8080)
	logger.Error("something failed", "err", "connection refused")

}
```

With this you can have multiple destinations, for example, handle logger s for errors, inf, warnings, etc.

```go
package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"time"
)

/*
 * levelRangeHandler: A custom logging handler that acts as a "gatekeeper" or filter.
 * It only allows log records within a specific level range [min..max] to pass through,
 * then delegates the actual writing to a real handler (delegate).
 *
 * This pattern is useful for creating specialized log outputs where you want different
 * log levels to go to different destinations (e.g., INFO to one file, WARN to another,
 * ERROR+ to a third file).
 *
 * Performance consideration: This handler performs a quick level check before delegating,
 * which prevents unnecessary work if the log level is outside the desired range.
 */
type levelRangeHandler struct {
	min, max slog.Level   // Defines the inclusive range of log levels to accept
	delegate slog.Handler // The actual handler that will write the log record
}

func (h *levelRangeHandler) Enabled(ctx context.Context, lvl slog.Level) bool {
	// Fast level filtering: if the log level is outside our range, immediately reject it.
	// This prevents unnecessary processing and improves performance.
	if lvl < h.min || lvl > h.max {
		return false
	}
	// If the level is within our range, check with the delegate handler.
	// This respects the delegate's own level policy (e.g., its internal minimum level).
	// This is important because the delegate might have its own filtering logic.
	return h.delegate.Enabled(ctx, lvl)
}

func (h *levelRangeHandler) Handle(ctx context.Context, r slog.Record) error {
	// Double-check the level range before processing the record.
	// This is a safety check in case Enabled() wasn't called or the level changed.
	if r.Level < h.min || r.Level > h.max {
		return nil // Silently ignore records outside our range
	}
	// Delegate the actual handling to the wrapped handler.
	// This is where the real work happens (formatting, writing to file/stdout, etc.)
	return h.delegate.Handle(ctx, r)
}

func (h *levelRangeHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	// Creates a new handler with additional attributes while preserving the level filter.
	// This is part of the slog.Handler interface and allows for attribute inheritance.
	// The new handler will have the same level range but with additional attributes
	// that will be included in all log records processed by this handler.
	return &levelRangeHandler{
		min:      h.min,
		max:      h.max,
		delegate: h.delegate.WithAttrs(attrs), // Propagate attributes to the delegate
	}
}

func (h *levelRangeHandler) WithGroup(name string) slog.Handler {
	// Creates a new handler with a group name while preserving the level filter.
	// Groups in slog allow you to organize related attributes under a common namespace.
	// For example, with group "http", attributes like "method" and "path" become "http.method" and "http.path".
	// This maintains the same level filtering behavior while adding the group structure.
	return &levelRangeHandler{
		min:      h.min,
		max:      h.max,
		delegate: h.delegate.WithGroup(name), // Propagate group to the delegate
	}
}

/*
 * multiHandler: A fan-out handler that forwards each log record to multiple child handlers.
 * This is useful when you want to send the same log to multiple destinations simultaneously
 * (e.g., both to a file and to stdout, or to different files with different formats).
 *
 * Note: The Go standard library doesn't currently provide an official "multi" handler,
 * so this is a minimal but sufficient implementation for most use cases.
 *
 * Performance consideration: This handler will call all child handlers even if some fail,
 * which ensures maximum reliability but may impact performance with many handlers.
 */
type multiHandler struct{ children []slog.Handler }

// Multi is a convenience helper to build a multiHandler in one call.
// It takes a variadic list of handlers and returns a single handler that forwards to all of them.
func Multi(hs ...slog.Handler) slog.Handler { return &multiHandler{children: hs} }

func (m *multiHandler) Enabled(ctx context.Context, lvl slog.Level) bool {
	// A log level is enabled if ANY of the child handlers would process it.
	// This uses an OR logic: if at least one child handler wants to process the log,
	// then the multi-handler should be enabled for that level.
	// This ensures we don't miss logs that should go to at least one destination.
	for _, h := range m.children {
		if h.Enabled(ctx, lvl) {
			return true
		}
	}
	return false
}

func (m *multiHandler) Handle(ctx context.Context, r slog.Record) error {
	var firstErr error
	// Iterate through all child handlers and forward the log record to each one.
	// We check Enabled() again here as a safety measure, even though it was already
	// checked at the multi-handler level. This allows individual handlers to have
	// their own filtering logic.
	for _, h := range m.children {
		if h.Enabled(ctx, r.Level) {
			if err := h.Handle(ctx, r); err != nil && firstErr == nil {
				// Capture the first error encountered, but continue processing other handlers.
				// This ensures that if one handler fails, the others still get a chance to process the log.
				// This is important for reliability: we don't want one broken handler to prevent
				// logs from reaching other destinations.
				firstErr = err
			}
		}
	}
	return firstErr
}

func (m *multiHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	// Create a new multi-handler where each child handler has the additional attributes.
	// This ensures that when attributes are added to the multi-handler, they propagate
	// to all child handlers, maintaining consistency across all destinations.
	out := make([]slog.Handler, len(m.children))
	for i, h := range m.children {
		out[i] = h.WithAttrs(attrs) // Each child gets the new attributes
	}
	return &multiHandler{children: out}
}

func (m *multiHandler) WithGroup(name string) slog.Handler {
	// Create a new multi-handler where each child handler has the group name applied.
	// This ensures that when a group is added to the multi-handler, it propagates
	// to all child handlers, maintaining consistent grouping across all destinations.
	out := make([]slog.Handler, len(m.children))
	for i, h := range m.children {
		out[i] = h.WithGroup(name) // Each child gets the group name
	}
	return &multiHandler{children: out}
}

/*
 * Helper functions for creating actual JSON handlers that write to stdout or files.
 * These are the "real" handlers that do the actual work of formatting and writing logs.
 *
 * Performance note: We set a minimum level on the actual handler to avoid unnecessary work.
 * This is a double optimization: the levelRangeHandler filters by range, and the underlying
 * JSON handler filters by minimum level. This prevents the JSON handler from doing expensive
 * formatting work for logs that would be filtered out anyway.
 */

func stdoutJSONHandler(minLevel slog.Level) slog.Handler {
	// Creates a JSON handler that writes to stdout (standard output).
	// This is useful for development and debugging, as logs will appear in the console.
	// The minLevel parameter ensures that only logs at or above this level are processed.
	return slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: minLevel})
}

func fileJSONHandler(path string, minLevel slog.Level) slog.Handler {
	// Creates a JSON handler that writes to a file.
	// The file is opened with specific flags:
	// - os.O_CREATE: Create the file if it doesn't exist
	// - os.O_WRONLY: Open for writing only
	// - os.O_APPEND: Append to the file instead of overwriting (preserves existing logs)
	// - 0o644: File permissions (owner can read/write, group and others can read)
	f, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644)
	if err != nil {
		// If we can't open the log file, the application should fail fast.
		// Logging is critical infrastructure, and if we can't log, we can't diagnose problems.
		log.Fatalf("open %s: %v", path, err)
	}
	// Create a JSON handler that writes to the opened file.
	// The minLevel parameter ensures efficient filtering at the handler level.
	return slog.NewJSONHandler(f, &slog.HandlerOptions{Level: minLevel})
}

func main() {
	// 1) Console destination: Show all logs >= INFO level in console (JSON format)
	// This is useful for development and debugging, as logs will appear in the terminal.
	stdout := stdoutJSONHandler(slog.LevelInfo)

	// 2) File destinations by level: Separate files for different log levels
	// This creates a sophisticated logging setup where different types of logs
	// go to different files, making it easier to analyze specific types of events.

	// INFO-only file: Only INFO level logs go to info.log
	// This is useful for tracking normal application flow and important events.
	infoFile := &levelRangeHandler{
		min:      slog.LevelInfo,
		max:      slog.LevelInfo,
		delegate: fileJSONHandler("info.log", slog.LevelInfo),
	}

	// WARN-only file: Only WARN level logs go to warn.log
	// This helps track potential issues that don't break functionality but should be monitored.
	warnFile := &levelRangeHandler{
		min:      slog.LevelWarn,
		max:      slog.LevelWarn,
		delegate: fileJSONHandler("warn.log", slog.LevelWarn),
	}

	// ERROR and above file: ERROR and higher levels go to error.log
	// The max level is set to 127 (high value) to accommodate future custom levels like FATAL or CRITICAL.
	// This ensures all error-related logs are captured in one place for easy debugging.
	errorAndAboveFile := &levelRangeHandler{
		min:      slog.LevelError,
		max:      slog.Level(127), // High margin in case you add FATAL/CRITICAL levels later
		delegate: fileJSONHandler("error.log", slog.LevelError),
	}

	// 3) Create a single Logger with fan-out to multiple destinations and common attributes
	// The Multi() function combines all our handlers into one, so each log message
	// will be sent to all appropriate destinations simultaneously.
	// The With() method adds common attributes that will be included in every log record.
	// This is useful for adding metadata like service name, environment, and version
	// that should appear in all logs for easier filtering and analysis.
	logger := slog.New(
		Multi(stdout, infoFile, warnFile, errorAndAboveFile),
	).With(
		slog.String("service", "app"),   // Service identifier for log aggregation
		slog.String("env", "dev"),       // Environment (dev/staging/prod) for context
		slog.String("version", "1.0.0"), // Application version for debugging
	)

	// 4) Demonstration of the logging system with different scenarios

	// DEBUG level log: This won't appear in stdout because our stdout handler
	// is configured for INFO and above. However, it demonstrates the filtering behavior.
	logger.Debug("debug event (won't print to stdout by default)") // Below INFO level

	// INFO level log: This will appear in stdout and info.log
	// It includes structured data (port number and timestamp) that will be formatted as JSON.
	logger.Info("server started",
		"port", 8080, // Server port for context
		"ts", time.Now().UTC(), // Timestamp in UTC for consistency
	)

	// Create a specialized logger for HTTP requests with grouping and additional context
	// WithGroup("http") creates a namespace for HTTP-related attributes
	// With() adds specific attributes that will be included in all logs from this logger
	httpLog := logger.WithGroup("http").With(
		slog.String("method", "GET"),  // HTTP method
		slog.String("path", "/users"), // Request path
	)

	// WARN level log: This will appear in stdout, warn.log, and info.log
	// The grouping means the attributes will be structured as "http.method" and "http.path"
	httpLog.Warn("slow request", "duration_ms", 820)

	// Simulate a database error to demonstrate ERROR level logging
	err := simulateDB()
	if err != nil {
		// ERROR level log: This will appear in stdout, error.log, and info.log
		// It includes structured error information for debugging
		logger.Error("db timeout",
			"op", "SELECT", // Database operation that failed
			"retryable", true, // Whether the operation can be retried
			slog.String("error", err.Error()), // The actual error message
		)
	}
}

func simulateDB() error {
	// Simulate a database timeout error for demonstration purposes.
	// context.DeadlineExceeded is a standard Go error that represents a timeout condition.
	// This is commonly used in database operations when a query takes too long to complete.
	return context.DeadlineExceeded
}

```