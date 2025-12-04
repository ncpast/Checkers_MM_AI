import terminalImage from 'terminal-image';
import readline from 'readline/promises';
import { readFile } from 'fs/promises';

import { stdin as input, stdout as output } from 'process';
import { createNewGame } from './modules/new-board.js';
import chalk from 'chalk';
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
            console.log(chalk.greenBright('Press Enter to start the game.\n'))
            await PrintRules();
            
            await rl.question('');
        } finally { rl.close(); }
    
        await gameInit(board);
    } catch (err) {
        console.error('Startup error:', err);
    }
})();

async function PrintRules() {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    const title = await readFile('./assets/rules.txt', 'utf8');
    console.log(chalk.grey(title));
};
// console.log(await terminalImage.file('./assets/monkey-idea.png', {width: 40}));
// console.log(await terminalImage.file('./assets/monkey-pondering.png', {width: 40}));