/**
 * NexOS - JavaScript Shell Implementation
 *
 * A lightweight CLI-based operating system with real file system integration.
 * This version provides a clean, easy-to-understand implementation in pure JavaScript.
 */

// Core dependencies
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

// ASCII art logo
const logo = `
 _   _            ___  ____
| \\ | | _____  __/ _ \\/ ___|
|  \\| |/ _ \\ \\/ / | | \\___ \\
| |\\  |  __/>  <| |_| |___) |
|_| \\_|\\___/_/\\_\\\\___/|____/

`;

// Configuration
const CONFIG = {
  version: '1.0.0',
  rootDir: path.join(__dirname, '..', 'nexos-files'),
  defaultPrompt: 'nexos'
};

// State
const state = {
  currentDirectory: '/',
  isEditing: false
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ===== FILE SYSTEM UTILITIES =====

/**
 * Initialize the file system
 */
function initializeFileSystem() {
  if (!fs.existsSync(CONFIG.rootDir)) {
    fs.mkdirSync(CONFIG.rootDir, { recursive: true });
    console.log(`Created root directory: ${CONFIG.rootDir}`);
  }
}

/**
 * Convert a virtual path to an absolute path in the real file system
 */
function getAbsolutePath(virtualPath) {
  const normalized = normalizePath(virtualPath);
  const relativePath = normalized === '/' ? '' : normalized.substring(1);
  return path.join(CONFIG.rootDir, relativePath);
}

/**
 * Normalize a path (resolve . and .. components)
 */
function normalizePath(inputPath) {
  // Default to current directory if no path provided
  if (!inputPath) {
    return state.currentDirectory;
  }

  // Handle absolute vs relative paths
  const fullPath = inputPath.startsWith('/')
    ? inputPath
    : path.join(state.currentDirectory, inputPath);

  // Split path into components and process each part
  const parts = fullPath.split('/').filter(Boolean);
  const result = [];

  for (const part of parts) {
    if (part === '.') {
      // Current directory - do nothing
    } else if (part === '..') {
      // Parent directory - remove last part if possible
      if (result.length > 0) {
        result.pop();
      }
    } else {
      // Regular directory/file - add to result
      result.push(part);
    }
  }

  // Reconstruct path
  return '/' + result.join('/');
}

// ===== FILE OPERATIONS =====

/**
 * Edit a file with a simple editor
 */
async function editFile(filePath) {
  return new Promise((resolve, reject) => {
    try {
      // Read existing content if file exists
      let content = '';
      if (fs.existsSync(filePath)) {
        try {
          content = fs.readFileSync(filePath, 'utf8');
          console.log('Current content:');
          console.log(content);
        } catch (err) {
          console.log(`Could not read file: ${err.message}`);
          console.log('Starting with empty file.');
        }
      } else {
        console.log('New file. Enter content below:');
      }

      // Show editor instructions
      console.log('\nEnter content line by line. Type "EOF" on a new line to save and exit:');
      console.log('----------------------------------------------------------');

      // Start with existing content lines or empty array
      const lines = content ? content.split('\n') : [];

      // Set up editor mode
      state.isEditing = true;
      const originalPrompt = rl._prompt;
      rl.setPrompt('edit> ');
      rl.prompt();

      // Store the original line listener
      const originalLineListener = rl.listeners('line')[0];
      rl.removeListener('line', originalLineListener);

      // Add our own line listener for editing
      const editLineListener = (line) => {
        if (line.trim() === 'EOF') {
          // Save file and exit editor
          try {
            // Join all lines and write to file
            const newContent = lines.join('\n');
            fs.writeFileSync(filePath, newContent);
            console.log(`File saved: ${filePath}`);
          } catch (err) {
            console.error(`Failed to save file: ${err.message}`);
          }

          console.log('----------------------------------------------------------');

          // Restore original readline behavior
          rl.removeListener('line', editLineListener);
          rl.on('line', originalLineListener);
          rl.setPrompt(originalPrompt);

          // Exit editor mode
          state.isEditing = false;
          resolve();
        } else {
          // Add line to content
          lines.push(line);
          rl.prompt();
        }
      };

      // Set our edit line listener
      rl.on('line', editLineListener);

    } catch (error) {
      console.error(`Error in editFile: ${error.message}`);
      state.isEditing = false;
      reject(error);
    }
  });
}

// ===== COMMAND HANDLERS =====
const commands = {
  // Show help
  help: () => {
    return `
Available commands:

System:
  help             - Show this help message
  exit, quit       - Exit NexOS
  info             - Show system information
  clear, cls       - Clear the screen

File operations:
  create <path> [content] - Create a new file with optional content
  show <path>      - Display file contents
  edit <path>      - Edit file with simple editor (type EOF to save and exit)
  erase <path>     - Remove file or directory
  trunct <path>    - Truncate file (empty its contents)

Directory operations:
  ls [path]        - List directory contents
  cd [path]        - Change directory
  pwd              - Print working directory
  mkdir <path>     - Create directory
  explorer         - Open current directory in file explorer
`;
  },

  // Show system information
  info: () => {
    return `NexOS Version ${CONFIG.version}\nRoot directory: ${CONFIG.rootDir}`;
  },

  // List directory contents
  ls: (args) => {
    const dirPath = args[0] || state.currentDirectory;
    const realPath = getAbsolutePath(dirPath);

    try {
      // Check if directory exists and is a directory
      if (!fs.existsSync(realPath)) {
        return `Error: Directory not found: ${dirPath}`;
      }

      const stats = fs.statSync(realPath);
      if (!stats.isDirectory()) {
        return `Error: Not a directory: ${dirPath}`;
      }

      // Read and sort directory contents
      const files = fs.readdirSync(realPath).sort();

      if (files.length === 0) {
        return 'Directory is empty';
      }

      // Format output
      let result = `Contents of ${dirPath}:\n`;
      const directories = [];
      const regularFiles = [];

      // Separate directories and files
      for (const file of files) {
        const filePath = path.join(realPath, file);
        const fileStats = fs.statSync(filePath);

        if (fileStats.isDirectory()) {
          directories.push(`d ${file}/`);
        } else {
          regularFiles.push(`f ${file} (${fileStats.size} bytes)`);
        }
      }

      // Output directories first, then files
      return result + directories.concat(regularFiles).join('\n');
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },

  // Change directory
  cd: (args) => {
    if (args.length === 0) {
      state.currentDirectory = '/';
      return `Changed directory to: ${state.currentDirectory}`;
    }

    const newPath = normalizePath(args[0]);
    const realPath = getAbsolutePath(newPath);

    try {
      // Check if directory exists and is a directory
      if (!fs.existsSync(realPath)) {
        return `Error: Directory not found: ${args[0]}`;
      }

      const stats = fs.statSync(realPath);
      if (!stats.isDirectory()) {
        return `Error: Not a directory: ${args[0]}`;
      }

      // Change directory
      state.currentDirectory = newPath;
      return `Changed directory to: ${state.currentDirectory}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },

  // Print working directory
  pwd: () => {
    return state.currentDirectory;
  },

  // Create directory
  mkdir: (args) => {
    if (args.length === 0) {
      return 'Error: Missing directory path. Usage: mkdir <path>';
    }

    const dirPath = normalizePath(args[0]);
    const realPath = getAbsolutePath(dirPath);

    try {
      fs.mkdirSync(realPath, { recursive: true });
      return `Created directory: ${dirPath}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },

  // Create file
  create: (args) => {
    if (args.length === 0) {
      return 'Error: Missing file path. Usage: create <path> [content]';
    }

    const filePath = normalizePath(args[0]);
    const realPath = getAbsolutePath(filePath);
    const content = args.slice(1).join(' ') || '';

    try {
      // Create parent directories if they don't exist
      const dirPath = path.dirname(realPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write file
      fs.writeFileSync(realPath, content);
      return `Created file: ${filePath}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },

  // Show file contents
  show: (args) => {
    if (args.length === 0) {
      return 'Error: Missing file path. Usage: show <path>';
    }

    const filePath = normalizePath(args[0]);
    const realPath = getAbsolutePath(filePath);

    try {
      // Check if file exists and is a file
      if (!fs.existsSync(realPath)) {
        return `Error: File not found: ${filePath}`;
      }

      const stats = fs.statSync(realPath);
      if (stats.isDirectory()) {
        return `Error: Not a file: ${filePath}`;
      }

      // Read file
      const content = fs.readFileSync(realPath, 'utf8');
      return content || '(empty file)';
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },

  // Edit file
  edit: async (args) => {
    if (args.length === 0) {
      return 'Error: Missing file path. Usage: edit <path>';
    }

    const filePath = normalizePath(args[0]);
    const realPath = getAbsolutePath(filePath);

    try {
      // Create parent directories if they don't exist
      const dirPath = path.dirname(realPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Edit file
      await editFile(realPath);
      return '';
    } catch (error) {
      console.error(`Error in edit command: ${error.message}`);
      return `Error: ${error.message}`;
    }
  },

  // Remove file or directory
  erase: (args) => {
    if (args.length === 0) {
      return 'Error: Missing path. Usage: erase <path>';
    }

    const targetPath = normalizePath(args[0]);
    const realPath = getAbsolutePath(targetPath);

    try {
      // Check if path exists
      if (!fs.existsSync(realPath)) {
        return `Error: Path not found: ${targetPath}`;
      }

      // Check if it's a directory or file
      const stats = fs.statSync(realPath);
      if (stats.isDirectory()) {
        fs.rmdirSync(realPath, { recursive: true });
        return `Removed directory: ${targetPath}`;
      } else {
        fs.unlinkSync(realPath);
        return `Removed file: ${targetPath}`;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },

  // Truncate file (empty its contents)
  trunct: (args) => {
    if (args.length === 0) {
      return 'Error: Missing file path. Usage: trunct <path>';
    }

    const filePath = normalizePath(args[0]);
    const realPath = getAbsolutePath(filePath);

    try {
      // Check if file exists and is a file
      if (!fs.existsSync(realPath)) {
        return `Error: File not found: ${filePath}`;
      }

      const stats = fs.statSync(realPath);
      if (stats.isDirectory()) {
        return `Error: Not a file: ${filePath}`;
      }

      // Truncate file
      fs.truncateSync(realPath, 0);
      return `Truncated file: ${filePath}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },

  // Open in file explorer (cross-platform)
  explorer: () => {
    const realPath = getAbsolutePath(state.currentDirectory);

    try {
      // Detect platform and use appropriate command
      const { platform } = process;
      let command;

      if (platform === 'win32') {
        command = `explorer "${realPath}"`;
      } else if (platform === 'darwin') {
        command = `open "${realPath}"`;
      } else if (platform === 'linux') {
        command = `xdg-open "${realPath}"`;
      } else {
        return `Unsupported platform: ${platform}`;
      }

      exec(command);
      return `Opening ${state.currentDirectory} in file explorer...`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },

  // Clear the screen
  clear: () => {
    console.clear();
    return '';
  }
};

// Add command aliases
commands.touch = commands.create;
commands.cat = commands.show;
commands.rm = commands.erase;
commands.cls = commands.clear;

// ===== MAIN PROGRAM =====

/**
 * Display the command prompt
 */
function promptUser() {
  rl.setPrompt(`${CONFIG.defaultPrompt}:${state.currentDirectory}> `);
  rl.prompt();
}

/**
 * Main function to start NexOS
 */
function main() {
  // Initialize the file system
  initializeFileSystem();

  // Display welcome message
  console.log(logo);
  console.log(`NexOS Version ${CONFIG.version}`);
  console.log(`Root directory: ${CONFIG.rootDir}`);
  console.log('Type "help" for available commands, "exit" to quit.');

  // Set up command processing
  rl.on('line', async (input) => {
    // Skip empty input
    if (!input.trim()) {
      return promptUser();
    }

    // Parse the input
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Handle exit command
    if (command === 'exit' || command === 'quit') {
      console.log('NexOS terminated.');
      rl.close();
      return;
    }

    try {
      // Execute the command
      if (commands[command]) {
        // Handle async commands (like edit)
        if (command === 'edit') {
          await commands[command](args);
        } else {
          const result = commands[command](args);
          if (result) {
            console.log(result);
          }
        }
      } else {
        console.log(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(`Error executing command: ${error.message}`);
    }

    // Show prompt again (unless we're in edit mode)
    if (!state.isEditing) {
      promptUser();
    }
  });

  // Start the command prompt
  promptUser();
}

// Start NexOS
main();
