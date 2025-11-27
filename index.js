import terminalImage from 'terminal-image';
import readline from 'readline/promises';
import { readFile } from 'fs/promises';

import { stdin as input, stdout as output } from 'process';
import { createNewGame } from './modules/new-board.js';
import { printBoard } from './modules/print-board.js';
import { gameInit } from './modules/game-init.js';

const board = createNewGame();
console.clear();

(async () => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    stdin.on('data', function onKey(key) {
        if (key === '\u0003') process.exit(); // exit game
    });

    try {
        const title = await readFile('./assets/game-title.txt', 'utf8');
        console.log(title);
        
        const rl = readline.createInterface({ input, output });

        try {
            await rl.question('Press Enter to start the game.');
        } finally { rl.close(); }
    
        await gameInit(board);
    } catch (err) {
        console.error('Startup error:', err);
    }
})();

// console.log(await terminalImage.file('./assets/monkey-idea.png', {width: 40}));
// console.log(await terminalImage.file('./assets/monkey-pondering.png', {width: 40}));