// commands/fileCommands.js
const fs = require('fs');
const path = require('path');
const { getAbsolutePath, normalizePath } = require('../fs-utils');
const { editFile } = require('../editor');

function fileCommands(state, rl) {
    return {
        create: (args) => {
            if (args.length === 0) return 'Error: Missing file path. Usage: create <path> [content]';
            const filePath = normalizePath(args[0], state.currentDirectory);
            const realPath = getAbsolutePath(filePath, normalizePath, state.currentDirectory);
            const content = args.slice(1).join(' ') || '';
            try {
                const dirPath = path.dirname(realPath);
                if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
                fs.writeFileSync(realPath, content);
                return `Created file: ${filePath}`;
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        show: (args) => {
            if (args.length === 0) return 'Error: Missing file path. Usage: show <path>';
            const filePath = normalizePath(args[0], state.currentDirectory);
            const realPath = getAbsolutePath(filePath, normalizePath, state.currentDirectory);
            try {
                if (!fs.existsSync(realPath)) return `Error: File not found: ${filePath}`;
                const stats = fs.statSync(realPath);
                if (stats.isDirectory()) return `Error: Not a file: ${filePath}`;
                const content = fs.readFileSync(realPath, 'utf8');
                return content || '(empty file)';
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        edit: async (args) => {
            if (args.length === 0) return 'Error: Missing file path. Usage: edit <path>';
            const filePath = normalizePath(args[0], state.currentDirectory);
            const realPath = getAbsolutePath(filePath, normalizePath, state.currentDirectory);
            try {
                const dirPath = path.dirname(realPath);
                if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
                await editFile(realPath, rl, state);
                return '';
            } catch (error) {
                console.error(`Error in edit command: ${error.message}`);
                return `Error: ${error.message}`;
            }
        },
        erase: (args) => {
            if (args.length === 0) return 'Error: Missing path. Usage: erase <path>';
            const targetPath = normalizePath(args[0], state.currentDirectory);
            const realPath = getAbsolutePath(targetPath, normalizePath, state.currentDirectory);
            try {
                if (!fs.existsSync(realPath)) return `Error: Path not found: ${targetPath}`;
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
        trunct: (args) => {
            if (args.length === 0) return 'Error: Missing file path. Usage: trunct <path>';
            const filePath = normalizePath(args[0], state.currentDirectory);
            const realPath = getAbsolutePath(filePath, normalizePath, state.currentDirectory);
            try {
                if (!fs.existsSync(realPath)) return `Error: File not found: ${filePath}`;
                const stats = fs.statSync(realPath);
                if (stats.isDirectory()) return `Error: Not a file: ${filePath}`;
                fs.truncateSync(realPath, 0);
                return `Truncated file: ${filePath}`;
            } catch (error) {
                return `Error: ${error.message}`;
            }
        }
    };
}

module.exports = fileCommands;
