// editor.js
// Simple line-by-line text editor for NexOS

const fs = require('fs');

async function editFile(filePath, rl, state) {
    return new Promise((resolve, reject) => {
        try {
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
            console.log('\nEnter content line by line. Type "EOF" on a new line to save and exit:');
            console.log('----------------------------------------------------------');
            const lines = content ? content.split('\n') : [];
            state.isEditing = true;
            const originalPrompt = rl._prompt;
            rl.setPrompt('edit> ');
            rl.prompt();
            const originalLineListener = rl.listeners('line')[0];
            rl.removeListener('line', originalLineListener);
            const editLineListener = (line) => {
                if (line.trim() === 'EOF') {
                    try {
                        const newContent = lines.join('\n');
                        fs.writeFileSync(filePath, newContent);
                        console.log(`File saved: ${filePath}`);
                    } catch (err) {
                        console.error(`Failed to save file: ${err.message}`);
                    }
                    console.log('----------------------------------------------------------');
                    rl.removeListener('line', editLineListener);
                    rl.on('line', originalLineListener);
                    rl.setPrompt(originalPrompt);
                    state.isEditing = false;
                    resolve();
                } else {
                    lines.push(line);
                    rl.prompt();
                }
            };
            rl.on('line', editLineListener);
        } catch (error) {
            console.error(`Error in editFile: ${error.message}`);
            state.isEditing = false;
            reject(error);
        }
    });
}

module.exports = { editFile };
