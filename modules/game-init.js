import readline from 'readline/promises';
import terminalImage from 'terminal-image';
import { stdin as input, stdout as output } from 'process';
import { printBoard } from './print-board.js';
import { getPossibleMoves } from './get-possible-moves.js';
import { movePiece } from './move-piece.js';
import { evaluateBoard } from './evaluate-board.js';
import { getAllMoves } from './get-all-moves.js';
import chalk from 'chalk';
import { Minimax } from './minimax.js';

const clamp = (x, min, max) => Math.min(Math.max(x, min), max);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let Depth = 1;
let Difficulties = [1, 5, 7, 9];
let DifficultyIndex = 0;

export async function gameInit(board) {
    await SelectDifficulty();
    await Move(board);
};

async function SelectDifficulty() {
    RenderDifficultySelection();
    return new Promise((resolve) => {
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');

        stdin.on('data', function onKey(key) {
            switch (key) {
                case '\u001B\u005B\u0041': // arrow up
                    DifficultyIndex = clamp(--DifficultyIndex, 0, Difficulties.length - 1);
                    RenderDifficultySelection();
                    break;
                case '\u001B\u005B\u0042': // arrow down
                    DifficultyIndex = clamp(++DifficultyIndex, 0, Difficulties.length - 1);
                    RenderDifficultySelection();
                    break;
            }

            if (key === '\u000D') { // enter
                stdin.removeListener('data', onKey);
                stdin.setRawMode(false);

                Depth = Difficulties[DifficultyIndex];

                resolve();                 
            }

            if (key === '\u0003') process.exit(); // ctrl-c
        });
    });
}

function RenderDifficultySelection() {
    process.stdout.write('\x1Bc');
    console.log('Please select your difficulty:\n');

    Difficulties.forEach((elem, index) => {
        if (index == DifficultyIndex)
            process.stdout.write('> ');
        else
            process.stdout.write('  ');

        switch (index) {
            case 0:
                process.stdout.write(chalk.greenBright('Easy'));
                break;
            case 1:
                process.stdout.write(chalk.yellowBright('Medium'));
            break;
            case 2:
                process.stdout.write(chalk.hex('#ff9100ff')('Hard'));
            break;
            case 3:
                process.stdout.write(chalk.red('Unbeatable'));
            break;
        };
        process.stdout.write('\n')
    });

    console.log('\nPress Enter to continue.');
};

async function MonkeyEmotion(board, emotion) {
    process.stdout.write('\x1Bc');

    switch (emotion) {
        case 'think':
                console.log(await terminalImage.file('./assets/monkey-pondering.png', {width: 36}) + '\n');
                console.log('* ...\n');
            break;
        case 'idea':
            console.log(await terminalImage.file('./assets/monkey-idea.png', {width: 36}) + '\n');
            console.log('* ..!\n');
            break;
        case 'loss':
            console.log(await terminalImage.file('./assets/monkey-loss.png', {width: 36}) + '\n');
            console.log('* You\'ve won.\n');
            break;
        case 'victory':
            console.log(await terminalImage.file('./assets/monkey-laugh.png', {width: 36}) + '\n');
            console.log('* You\'ve lost!\n');
            break;
        default:
            break;
    };

    printBoard(board);
    console.log(chalk.grey(`Score: ${evaluateBoard(board) * -1}`));
};

export async function Move(board, selectedIndex) {
    const countPieces = color => {
        let n = 0;
        board.forEach((elem) => {
            switch (color) {
                case 'w':
                    if (elem > 0) n++;
                    break;
                case 'b':
                    if (elem < 0) n--;
                    break;
                default:
                    break;
            };
        });
        return n;
    };

    if (countPieces('b') === 0) { 
        await MonkeyEmotion(board, 'loss');
        process.exit();    
    };
    if (countPieces('w') === 0) {
        await MonkeyEmotion(board, 'victory');
        process.exit();
    };

    process.stdout.write('\x1Bc');
    console.log(await terminalImage.file('./assets/icon.png', {width: 36}) + '\n');
    console.log('* Now is your turn.\n');

    printBoard(board, selectedIndex);

    let stage = 0;
    const rl = readline.createInterface({ input, output });

    while (true) {
        let PossibleMoves, targetDestroyed;
        if (selectedIndex != undefined) {
            const Captured = getPossibleMoves(board, selectedIndex, 1)[1];
            PossibleMoves = getPossibleMoves(board, selectedIndex, 1)[0];
            console.log(chalk.blueBright(`Selected: ${selectedIndex}, Possible moves: L - ${PossibleMoves.left}, R - ${PossibleMoves.right}, 
                Possible destroyed: L - ${Captured.left}, R - ${Captured.right}.`));

            if (PossibleMoves.left == undefined && PossibleMoves.right == undefined) {
                console.log('\nNo valid moves available.');
                selectedIndex = null;
                continue;
            } else {
                let targetIndex;

                if (PossibleMoves.left != undefined && PossibleMoves.right != undefined) {
                    while (true) {
                        const answer = (await rl.question('\nWhich way are you moving? (L/R) ')).toLowerCase();
                        
                        if (answer != 'l' && answer != 'r') {
                            console.log('Invalid response. Please select "L" for left, "R" for right.');
                            continue;
                        }
                        
                        switch(answer) {
                            case 'l':
                                targetIndex = PossibleMoves.left;
                                targetDestroyed = Captured.left;
                                break;
                            case 'r':
                                targetIndex = PossibleMoves.right;
                                targetDestroyed = Captured.right;
                                break;
                        }

                        break;
                    }
                } else { 
                    targetIndex = PossibleMoves.left ?? PossibleMoves.right;
                    targetDestroyed = Captured.left ?? Captured.right;
                }

                rl.close()

                const nextBoard = movePiece(board, selectedIndex, targetIndex, targetDestroyed);
                
                let BestMove = nextBoard;
                //if (!targetDestroyed) {
                    await MonkeyEmotion(board, 'think');
                    
                    BestMove = Minimax(new Int8Array(nextBoard), -1, Depth); 
                    const ContinuePrompt = readline.createInterface({ input, output });
                    
                    await delay(500);
                    await MonkeyEmotion(BestMove, 'idea');
                    
                    await ContinuePrompt.question('\nPress enter to continue.');
                    ContinuePrompt.close();
                //};

                Move(new Int8Array(BestMove));
                break;
            }
        }
        
        console.log(chalk.grey(`Score: ${evaluateBoard(board) * -1}`));

        const answer = await rl.question('\nSelect your piece: ');
        const n = Number(answer.trim());

        if (Number.isNaN(n) || n < 1) {
            console.log('Enter a valid positive number.');
            continue;
        }

        const whiteMen = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] >= 1) whiteMen.push(i);
        }

        if (n > whiteMen.length) {
            console.log(`Only ${whiteMen.length} white men on the board.`);
            continue;
        }

        const selectedIndexExport = whiteMen[n - 1];

        rl.close()
        Move(board, selectedIndexExport)
        break;
  }
};