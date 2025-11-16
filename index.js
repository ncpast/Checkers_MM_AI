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
    try {
        const title = await readFile('./assets/game-title.txt', 'utf8');
        console.log(title);
    
        await gameInit(board);
    } catch (err) {
        console.error('Startup error:', err);
    }
})();

// console.log(await terminalImage.file('./assets/monkey-idea.png', {width: 40}));
// console.log(await terminalImage.file('./assets/monkey-pondering.png', {width: 40}));