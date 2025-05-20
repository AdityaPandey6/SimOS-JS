// commands/index.js
// Exports all command handlers as a single makeCommands function

const fileCommands = require('./fileCommands');
const dirCommands = require('./dirCommands');
const systemCommands = require('./systemCommands');

function makeCommands(state, rl) {
    const commands = {
        ...systemCommands(state, rl),
        ...fileCommands(state, rl),
        ...dirCommands(state, rl)
    };
    return commands;
}

module.exports = { makeCommands };
