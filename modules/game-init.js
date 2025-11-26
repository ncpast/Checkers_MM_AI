import readline from 'readline/promises';
import terminalImage from 'terminal-image';
import { stdin as input, stdout as output } from 'process';
import { printBoard } from './print-board.js';
import { getPossibleMoves } from './get-possible-moves.js';
import { movePiece } from './move-piece.js';
import { evaluateBoard } from './evaluate-board.js';
import { getAllMoves } from './get-all-moves.js';
import chalk from 'chalk';
import { json } from 'stream/consumers';

export async function gameInit(board) {
    const rl = readline.createInterface({ input, output });

    try {
        await rl.question('Press Enter to start the game.');
    } finally { rl.close(); }

    await Move(board)
}

export async function Move(board, selectedIndex) {
    process.stdout.write('\x1Bc');
    console.log(await terminalImage.file('./assets/icon.png', {width: 36}) + '\n');
    console.log('* Now is your turn.\n');

    printBoard(board, selectedIndex);

    let stage = 0;
    const rl = readline.createInterface({ input, output });

    while (true) {
        let PossibleMoves, targetDestroyed;
        if (selectedIndex) {
            const Captured = getPossibleMoves(board, selectedIndex, 1)[1];
            PossibleMoves = getPossibleMoves(board, selectedIndex, 1)[0];
            console.log(chalk.blueBright(`Selected: ${selectedIndex}, Possible moves: L - ${PossibleMoves.left}, R - ${PossibleMoves.right}, 
                Possible destroyed: L - ${Captured.left}, R - ${Captured.right}.`));

            if (!PossibleMoves.left && !PossibleMoves.right) {
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
                    targetIndex = PossibleMoves.left ? PossibleMoves.left : PossibleMoves.right;
                    targetDestroyed = Captured.left;
                }

                rl.close()
                
                const nextBoard = movePiece(board, selectedIndex, targetIndex, targetDestroyed)
                let PredictedMove = getAllMoves(new Int8Array(nextBoard), -1, -1, 0, true, 2);

                const ContinuePrompt = readline.createInterface({ input, output });
                await ContinuePrompt.question('Press enter to continue.');
                ContinuePrompt.close();

                Move(new Int8Array(PredictedMove.board));
                break;
            }
        }

        console.log(`Score: ${evaluateBoard(board)}`);

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
}