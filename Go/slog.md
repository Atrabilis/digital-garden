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

