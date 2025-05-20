// commands/systemCommands.js
const { CONFIG } = require('../fs-utils');

function systemCommands(state, rl) {
    return {
        help: () => {
            return `\nAvailable commands:\n\nSystem:\n  help             - Show this help message\n  exit, quit       - Exit NexOS\n  info             - Show system information\n  clear, cls       - Clear the screen\n\nFile operations:\n  create <path> [content] - Create a new file with optional content\n  show <path>      - Display file contents\n  edit <path>      - Edit file with simple editor (type EOF to save and exit)\n  erase <path>     - Remove file or directory\n  trunct <path>    - Truncate file (empty its contents)\n\nDirectory operations:\n  ls [path]        - List directory contents\n  cd [path]        - Change directory\n  pwd              - Print working directory\n  mkdir <path>     - Create directory\n  explorer         - Open current directory in file explorer\n`;
        },
        info: () => {
            return `NexOS Version ${CONFIG.version}\nRoot directory: ${CONFIG.rootDir}`;
        },
        clear: () => {
            console.clear();
            return '';
        }
    };
}

module.exports = systemCommands;
