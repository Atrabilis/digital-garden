# Notes on os standar module

# Flags for os.OpenFile in Go

- `os.O_RDONLY`  
  Open file read-only (default if no flag is specified).

- `os.O_WRONLY`  
  Open file write-only.

- `os.O_RDWR`  
  Open file read-write.

- `os.O_APPEND`  
  Always write data at the end of the file.

- `os.O_CREATE`  
  Create a new file if it does not exist. Requires file mode (`perm`).

- `os.O_EXCL`  
  Used with `O_CREATE`, makes the call fail if the file already exists.

- `os.O_SYNC`  
  Open for synchronous I/O — writes are flushed to stable storage before returning.

- `os.O_TRUNC`  
  If the file already exists and is opened for writing, truncate it to size 0.


## Verify if a file exists
```go
info, err := os.Stat(path)            
if err == nil {
    fmt.Println("file exists")
}else if errors.Is(err, fs.ErrNotExist) {
    fmt.Println("file does not exists")
} else{
    fmt.Println("another error")
}
```

## Create File
```go
f, err := os.OpenFile(file, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0644)
if err != nil {
    log.Fatal(err)
}
f.Close() // ✅ ensures the file descriptor is released

fmt.Println(file, "file created")
```