# SiMOS

A super simple, fun, and safe command-line operating system simulation for learning and playing—made with JavaScript!

![SiMOS Screenshot](https://i.ibb.co/rf4V843S/Screenshot-2025-05-18-222516.png)

---

## What is SiMOS?
SiMOS is like a tiny pretend computer you can use in your terminal. You can make files, open them, write in them, and make folders—just by typing commands! It doesn't change your real computer files, so you can play and learn safely.

---

## Features
- **Make and read files** (like notes or stories)
- **Edit files** with a simple built-in editor
- **Make folders** and move between them
- **See what's inside folders**
- **Delete files or folders**
- **Open your SiMOS folder in your real computer's explorer**
- **Works on Windows, Mac, and Linux**
- **No internet needed, no setup, just Node.js!**

---

## How to Start SiMOS

### 1. You need Node.js
If you don't have Node.js, [download it here](https://nodejs.org/).

### 2. Open a terminal (Command Prompt, PowerShell, or Terminal)

### 3. Go to the SiMOS folder
If you downloaded or copied SiMOS, use:
```
cd path/to/NexOS-JS
```

### 4. Run SiMOS!
- On **Windows**:
  - Double-click `run.bat` or type:
    ```
    .\run.bat
    ```
- On **Mac/Linux**:
  - Open Terminal and type:
    ```
    ./run.sh
    ```
    (If it says permission denied, run: `chmod +x run.sh` first)
- Or, run directly with Node.js:
    ```
    node shell/simos.js
    ```

---

## What Can I Type? (Commands)

- `help` — Show all commands
- `ls` — See what's in the current folder
- `cd foldername` — Go into a folder
- `cd ..` — Go back up one folder
- `pwd` — Show where you are
- `mkdir foldername` — Make a new folder
- `create filename.txt Hello!` — Make a file with some text
- `show filename.txt` — Read a file
- `edit filename.txt` — Edit a file (type lines, then `EOF` to save)
- `erase filename.txt` — Delete a file or folder
- `trunct filename.txt` — Empty a file
- `explorer` — Open the current SiMOS folder in your real computer
- `clear` — Clear the screen
- `exit` or `quit` — Leave SiMOS

**Shortcuts:**
- `touch` = `create`
- `cat` = `show`
- `rm` = `erase`
- `cls` = `clear`

---

## Example: Make and Read a File
```
simos:/> mkdir fun
simos:/> cd fun
simos:/fun> create hello.txt Hello, SiMOS!
simos:/fun> show hello.txt
Hello, SiMOS!
```

## Example: Edit a File
```
simos:/fun> edit hello.txt
(Type your lines, then type EOF on a new line to save and exit)
```

---

## Where are my SiMOS files?
All your SiMOS files and folders are in the `simos-files` folder inside the project. They are kept separate from your real computer files.

---

## Can I break my computer with SiMOS?
**No!** SiMOS only works inside its own folder. You can play, learn, and even make mistakes safely.

---

## License
MIT — You can use, share, and change SiMOS however you like!

---

**Have fun exploring with SiMOS!**
