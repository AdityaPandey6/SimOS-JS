# SiMOS Commands Folder

This folder contains all the command logic for SiMOS, the simple command-line operating system simulation. Each file in this folder is responsible for a different group of commands, making the code easy to understand and maintain.

## Folder Structure

- **index.js** — Combines all command modules and exports a single `makeCommands` function for use in SiMOS.
- **systemCommands.js** — Handles system commands like `help`, `info`, and `clear`.
- **fileCommands.js** — Handles file operations like `create`, `show`, `edit`, `erase`, and `trunct` (truncate).
- **dirCommands.js** — Handles directory operations like `ls`, `cd`, `pwd`, `mkdir`, and `explorer`.

## How It Works

- Each command group (system, file, directory) is in its own file as a function that returns an object of command handlers.
- `index.js` imports all these groups and merges them into one big `commands` object using the `makeCommands` function.
- When you run SiMOS, the main program (`simos.js`) calls `makeCommands(state, rl)` to get all the commands, passing in the current state and the readline interface.
- Each command handler uses the state and utilities to do its job, like creating files, changing folders, or showing help.

## Example

If you type `ls` in SiMOS, this is what happens:
1. The main program sees you typed `ls`.
2. It looks up the `ls` command in the commands object (from `dirCommands.js`).
3. The `ls` function runs, looks in the right folder, and prints out the files and folders it finds.

## Why This Structure?
- **Easy to read:** Each file does one thing.
- **Easy to add new commands:** Just add a new file or function.
- **No big messy file:** Everything is organized and simple.

---

**If you want to add a new command, just make a new file or add it to the right group, and include it in `index.js`.**

Have fun coding with SiMOS!
