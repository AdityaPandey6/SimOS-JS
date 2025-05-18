# NexOS

A lightweight CLI-based operating system simulation implemented in pure JavaScript.

```
 _   _            ___  ____
| \ | | _____  __/ _ \/ ___|
|  \| |/ _ \ \/ / | | \___ \
| |\  |  __/>  <| |_| |___) |
|_| \_|\\___/_/\_\\___/|____/

A Lightweight CLI-Based OS Simulation
```

## Overview

NexOS is a command-line interface operating system simulation that provides a clean, intuitive interface for file operations while working with real files on your system. It's implemented entirely in JavaScript with no external dependencies, making it lightweight and easy to run on any system with Node.js.

## Features

- Real file system integration
- Command-line interface with custom commands
- File operations (create, read, edit, delete)
- Directory navigation
- Cross-platform file explorer integration
- Vim-like text editor for file editing
- Zero external dependencies

## Installation

### Prerequisites

- Node.js (v14+)

### Steps

No installation is required! NexOS is a pure JavaScript application with no external dependencies.

## Running NexOS

### On Windows

1. Double-click on the `run.bat` file

   OR

   Run from command prompt:
   ```bash
   run.bat
   ```

### On macOS/Unix/Linux

1. Make the run script executable:
   ```bash
   chmod +x run.sh
   ```

2. Run the script:
   ```bash
   ./run.sh
   ```

### Manual Start

You can also start NexOS manually:

```bash
cd shell
node nexos.js
```

## Available Commands

NexOS provides the following commands:

### File Operations

- `create <path> [content]` - Create a new file with optional content
- `show <path>` - Display file contents
- `edit <path>` - Edit file contents in a simple editor (type EOF on a new line to save and exit)
- `erase <path>` - Remove a file or directory
- `trunct <path>` - Truncate a file (empty its contents)

### Directory Operations

- `ls [path]` - List directory contents
- `cd <path>` - Change directory
- `pwd` - Print working directory
- `mkdir <path>` - Create directory
- `explorer` - Open current directory in file explorer

### System Commands

- `help` - Show available commands
- `info` - Show system information and root directory
- `exit` or `quit` - Exit the program
- `clear` or `cls` - Clear the screen

### Command Aliases

NexOS also supports these command aliases for compatibility:

- `touch` → `create`
- `cat` → `show`
- `rm` → `erase`
- `cls` → `clear`

## Command Usage Examples

### Basic File Operations

```
nexos:/> mkdir projects
nexos:/> cd projects
nexos:/projects> create hello.txt Hello, world!
nexos:/projects> show hello.txt
Hello, world!
nexos:/projects> edit hello.txt
```

When using the `edit` command, you'll enter a simple text editor:
- Type text to add new lines
- Type `EOF` on a new line to save and exit

### Directory Navigation

```
nexos:/> ls
nexos:/> mkdir docs
nexos:/> cd docs
nexos:/docs> pwd
/docs
nexos:/docs> cd ..
nexos:/>
```

### Using the Explorer Command

```
nexos:/> explorer
```
This will open the current directory in your system's file explorer.

## License

MIT
