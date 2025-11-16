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

    console.log(chalk.yellow(`Moving ${selectedIndex} to ${targetIndex}. Destroying ${destroyed}.`))
    return board;
}