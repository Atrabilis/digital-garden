---
title: "GNU nano"
layout: "default"
---

# Notes on the use of nano

Most if not all information here is from [nano documentation](https://www.nano-editor.org/).


## Keystrokes and their functions

### File handling

| Shortcut | Action |
|---|---|
| Ctrl+S | Save current file |
| Ctrl+O | Offer to write file (“Save as”) |
| Ctrl+R | Insert a file into current one |
| Ctrl+X | Close buffer, exit from nano |

### Editing

| Shortcut | Action |
|---|---|
| Ctrl+K | Cut current line into cutbuffer |
| Alt+6 | Copy current line into cutbuffer |
| Ctrl+U | Paste contents of cutbuffer |
| Ctrl+] | Complete current word |
| Alt+3 | Comment/uncomment line/region |
| Alt+U | Undo last action |
| Alt+E | Redo last undone action |

### Search and replace

| Shortcut | Action |
|---|---|
| Ctrl+B | Start backward search |
| Ctrl+F | Start forward search |
| Alt+B | Find next occurrence backward |
| Alt+F | Find next occurrence forward |
| Alt+R | Start a replacing session |

### Deletion

| Shortcut | Action |
|---|---|
| Ctrl+H | Delete character before cursor |
| Ctrl+D | Delete character under cursor |
| Alt+Backspace | Delete word to the left |
| Ctrl+Delete | Delete word to the right |
| Alt+Delete | Delete current line |

### Operations

| Shortcut | Action |
|---|---|
| Ctrl+T | Execute some command |
| Ctrl+T Ctrl+S | Run a spell check |
| Ctrl+T Ctrl+Y | Run a syntax check |
| Ctrl+T Ctrl+O | Run a formatter |
| Tab | Indent marked region |
| Shift+Tab | Unindent marked region |
| Ctrl+J | Justify paragraph or region |
| Alt+J | Justify entire buffer |
| Alt+T | Cut until end of buffer |
| Alt+: | Start/stop recording of macro |
| Alt+; | Replay macro |

### Moving around

| Shortcut | Action |
|---|---|
| ← | One character backward |
| → | One character forward |
| Ctrl+← | One word backward |
| Ctrl+→ | One word forward |
| Ctrl+A | To start of line |
| Ctrl+E | To end of line |
| Ctrl+P | One line up |
| Ctrl+N | One line down |
| Ctrl+↑ | To previous block |
| Ctrl+↓ | To next block |
| Alt+Home | To first row in viewport |
| Alt+End | To last row in viewport |
| Ctrl+Y | One page up |
| Ctrl+V | One page down |
| Alt+\\ | To top of buffer |
| Alt+/ | To end of buffer |

### Special movement

| Shortcut | Action |
|---|---|
| Alt+G | Go to specified line |
| Alt+] | Go to complementary bracket |
| Alt+↑ | Scroll viewport up |
| Alt+↓ | Scroll viewport down |
| Alt+< | Switch to preceding buffer |
| Alt+> | Switch to succeeding buffer |

### Information

| Shortcut | Action |
|---|---|
| Ctrl+C | Report cursor position |
| Alt+D | Report line/word/character counts |
| Ctrl+G | Display help text |

### Various

| Shortcut | Action |
|---|---|
| Alt+A | Set or unset the mark |
| Alt+V | Enter next keystroke verbatim |
| Alt+C | Turn constant position info on/off |
| Alt+N | Turn line numbers on/off |
| Alt+P | Turn visible whitespace on/off |
| Alt+S | Turn softwrapping on/off |
| Alt+X | Hide/unhide the help lines |
| Alt+Z | Hide/unhide the info bars |
| Ctrl+L | Refresh the screen |
