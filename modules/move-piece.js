import { Move } from "./game-init.js";
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import chalk from "chalk";
import { getAllMoves } from "./get-all-moves.js";

export function movePiece(board, selectedIndex, targetIndex, destroyed) {
    const CurrentRow = Math.floor(selectedIndex / 4);

    if (destroyed) board[destroyed] = 0;

    if (CurrentRow == 1) 
        board[targetIndex] = board[selectedIndex];
    else
        board[targetIndex] = board[selectedIndex];
    board[selectedIndex] = 0;

    for (let i = 0; i < 4; i++) {
        if (board[i] == 1) board[i] = 2;
        if (board[i] == -2) board[i] = -1;
    };
    
    for (let i = board.length - 4; i < board.length; i++) {
        if (board[i] == -1) board[i] = -2;
        if (board[i] == 2) board[i] = 1;
    };

    //console.log(chalk.yellow(`Moving ${selectedIndex} to ${targetIndex}. Destroying ${destroyed}.`))
    return board;
}