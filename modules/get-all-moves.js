import chalk from 'chalk';
import { printBoard } from './print-board.js';
import { evaluateBoard } from './evaluate-board.js';
import { getPossibleMoves } from './get-possible-moves.js';
import { movePiece } from './move-piece.js';
import fs from 'fs';

export function getAllMoves(board, player, generationalArray = [], generation = -1, index = 0) {
    console.log(chalk.yellowBright('Starting new cycle. ' + generation));

    let pieceIndices = [];
    let validMoves = [];
    let hypotheticalBoards = [];

    board.forEach((elem, index) => {
        if (Math.sign(elem) == Math.sign(player)) pieceIndices.push(index);
    });

    pieceIndices.forEach((elem) => {
        let possibleMoves = getPossibleMoves(board, elem, player)[0];
        let possibleCaptured = getPossibleMoves(board, elem, player)[1];

        if (possibleMoves.left || possibleMoves.right)
            validMoves.push({
                index: elem,
                left: possibleMoves.left,
                right: possibleMoves.right,
                leftDestroyed: possibleCaptured.left,
                rightDestroyed: possibleCaptured.right,
                score: evaluateBoard(board)
            });
    })

    validMoves.forEach((elem) => {
        if (elem.left) {
            hypotheticalBoards.push(movePiece(new Int8Array(board), elem.index, elem.left, elem.leftDestroyed));
        }
        if (elem.right) {
            hypotheticalBoards.push(movePiece(new Int8Array(board), elem.index, elem.right, elem.rightDestroyed));
        }
    });

    hypotheticalBoards.forEach((elem) => {
        //console.log(printBoard(elem));
        //console.log(`SCORE: ${evaluateBoard(elem)}`);
    });

    let BoardList = [];

    hypotheticalBoards.forEach((elem)=>{
        BoardList.push({
            'board': new Int8Array(elem),
            'score': evaluateBoard(elem),
            'reference': {
                'generation': generation < 0 ? null : generation,
                'index': index
            }
        });
    });

    generationalArray.push(BoardList);

    if (generation < 1)
        getAllMoves(board, player * -1, generationalArray, ++generation, ++index)

    fs.writeFile('./assets/moves.json', JSON.stringify(generationalArray, null, 2), 'utf-8', (err)=>{ if (err) console.log(err) });

    return GetHighestScore(BoardList);
}

function GetHighestScore(BoardList) {
    let exportElem = BoardList[0];

    BoardList.forEach((elem)=>{
        if (exportElem.score < elem.score) {
            exportElem = elem;
        };
    });

    return exportElem;
};