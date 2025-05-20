// fs-utils.js
// File system utility functions for NexOS

const fs = require('fs');
const path = require('path');

const CONFIG = {
    version: '1.0.0',
    rootDir: path.join(__dirname, '..', 'simos-files'),
    defaultPrompt: 'simos'
};

function initializeFileSystem() {
    if (!fs.existsSync(CONFIG.rootDir)) {
        fs.mkdirSync(CONFIG.rootDir, { recursive: true });
        console.log(`Created root directory: ${CONFIG.rootDir}`);
    }
}

function getAbsolutePath(virtualPath, normalizePath, currentDirectory) {
    const normalized = normalizePath(virtualPath, currentDirectory);
    const relativePath = normalized === '/' ? '' : normalized.substring(1);
    return path.join(CONFIG.rootDir, relativePath);
}

function normalizePath(inputPath, currentDirectory = '/') {
    if (!inputPath) return currentDirectory;
    const fullPath = inputPath.startsWith('/')
        ? inputPath
        : path.join(currentDirectory, inputPath);
    const parts = fullPath.split('/').filter(Boolean);
    const result = [];
    for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') {
            if (result.length > 0) result.pop();
        } else {
            result.push(part);
        }
    }
    return '/' + result.join('/');
}

module.exports = {
    CONFIG,
    initializeFileSystem,
    getAbsolutePath,
    normalizePath
};
