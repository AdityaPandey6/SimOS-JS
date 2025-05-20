// commands/dirCommands.js
const fs = require('fs');
const path = require('path');
const { getAbsolutePath, normalizePath } = require('../fs-utils');
const { exec } = require('child_process');

function dirCommands(state, rl) {
    return {
        ls: (args) => {
            const dirPath = args[0] || state.currentDirectory;
            const realPath = getAbsolutePath(dirPath, normalizePath, state.currentDirectory);
            try {
                if (!fs.existsSync(realPath)) return `Error: Directory not found: ${dirPath}`;
                const stats = fs.statSync(realPath);
                if (!stats.isDirectory()) return `Error: Not a directory: ${dirPath}`;
                const files = fs.readdirSync(realPath).sort();
                if (files.length === 0) return 'Directory is empty';
                let result = `Contents of ${dirPath}:\n`;
                const directories = [];
                const regularFiles = [];
                for (const file of files) {
                    const filePath = path.join(realPath, file);
                    const fileStats = fs.statSync(filePath);
                    if (fileStats.isDirectory()) directories.push(`d ${file}/`);
                    else regularFiles.push(`f ${file} (${fileStats.size} bytes)`);
                }
                return result + directories.concat(regularFiles).join('\n');
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        cd: (args) => {
            if (args.length === 0) {
                state.currentDirectory = '/';
                return `Changed directory to: ${state.currentDirectory}`;
            }
            const newPath = normalizePath(args[0], state.currentDirectory);
            const realPath = getAbsolutePath(newPath, normalizePath, state.currentDirectory);
            try {
                if (!fs.existsSync(realPath)) return `Error: Directory not found: ${args[0]}`;
                const stats = fs.statSync(realPath);
                if (!stats.isDirectory()) return `Error: Not a directory: ${args[0]}`;
                state.currentDirectory = newPath;
                return `Changed directory to: ${state.currentDirectory}`;
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        pwd: () => state.currentDirectory,
        mkdir: (args) => {
            if (args.length === 0) return 'Error: Missing directory path. Usage: mkdir <path>';
            const dirPath = normalizePath(args[0], state.currentDirectory);
            const realPath = getAbsolutePath(dirPath, normalizePath, state.currentDirectory);
            try {
                fs.mkdirSync(realPath, { recursive: true });
                return `Created directory: ${dirPath}`;
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        explorer: () => {
            const realPath = getAbsolutePath(state.currentDirectory, normalizePath, state.currentDirectory);
            try {
                const { platform } = process;
                let command;
                if (platform === 'win32') command = `explorer "${realPath}"`;
                else if (platform === 'darwin') command = `open "${realPath}"`;
                else if (platform === 'linux') command = `xdg-open "${realPath}"`;
                else return `Unsupported platform: ${platform}`;
                exec(command);
                return `Opening ${state.currentDirectory} in file explorer...`;
            } catch (error) {
                return `Error: ${error.message}`;
            }
        }
    };
}

module.exports = dirCommands;
