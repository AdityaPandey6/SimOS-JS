/**
 * NexOS - JavaScript Shell Implementation
 *
 * A lightweight CLI-based operating system with real file system integration.
 * This version provides a clean, easy-to-understand implementation in pure JavaScript.
 */

// Core dependencies
const readline = require('readline');
const simosLogo = require('./logo');
const { CONFIG, initializeFileSystem, getAbsolutePath, normalizePath } = require('./fs-utils');
// Use the new commands folder
const { makeCommands } = require('./commands');

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

const commands = makeCommands(state, rl);
// Add command aliases
commands.touch = commands.create;
commands.cat = commands.show;
commands.rm = commands.erase;
commands.cls = commands.clear;

// ===== MAIN PROGRAM =====

function promptUser() {
  rl.setPrompt(`${CONFIG.defaultPrompt}:${state.currentDirectory}> `);
  rl.prompt();
}

function main() {
  initializeFileSystem();
  console.log(simosLogo);
  console.log(`SiMOS Version ${CONFIG.version}`);
  console.log(`Root directory: ${CONFIG.rootDir}`);
  console.log('Type "help" for available commands, "exit" to quit.');
  rl.on('line', async (input) => {
    if (!input.trim()) {
      return promptUser();
    }
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    if (command === 'exit' || command === 'quit') {
      console.log('SiMOS terminated.');
      rl.close();
      return;
    }
    try {
      if (commands[command]) {
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
    if (!state.isEditing) {
      promptUser();
    }
  });
  promptUser();
}

main();
