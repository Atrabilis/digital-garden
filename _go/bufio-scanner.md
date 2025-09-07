---
title: Scanner
layout: default
category: bufio
parent: go
---

## Usage pattern of `bufio.Scanner`

| Step | Description |
|------|-------------|
| 1. Create source (`io.Reader`) | Open a file or use standard input. |
| 2. Create the `Scanner` | Bind the `Scanner` to the source. |
| 3. Iterate over tokens | Use `for scanner.Scan()` and inside the loop access `scanner.Text()` or `scanner.Bytes()`. |
| 4. Check for errors | After the loop, check if an error occurred other than `EOF`. |

✅ **Notes**  
- `scanner.Err()` returns `nil` if the end of input (`EOF`) was reached normally.  
- Always check `Err()` after finishing the loop.  
- `Scan()` will panic if the split function produces too many empty tokens without advancing the input (rare case).  

### Example code

```go
package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	// Step 1: Create source
	file, err := os.Open("example.txt")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// Step 2: Create the Scanner
	scanner := bufio.NewScanner(file)

	// Step 3: Iterate over tokens
	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}

	// Step 4: Check for errors
	if err := scanner.Err(); err != nil {
		fmt.Println("Error during scanning:", err)
	}
}
```
