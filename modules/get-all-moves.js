import chalk from 'chalk';
import { printBoard } from './print-board.js';
import { evaluateBoard } from './evaluate-board.js';
import { getPossibleMoves } from './get-possible-moves.js';
import { movePiece } from './move-piece.js';
import { alphaBeta } from './alpha-beta-pruning.js';
import fs from 'fs';
import { monteCarlo } from './monte-carlo.js';

export function getAllMoves(board, player, generation = -1, index = 0, iteration = false, difficulty = 1) {
    //console.log(chalk.yellowBright('Starting new cycle. ' + generation));

    let pieceIndices = [];
    let validMoves = [];
    let hypotheticalBoards = [];
    let generationalArray = [];

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

    /*
    hypotheticalBoards.forEach((elem) => {
        console.log(printBoard(elem));
        console.log(`SCORE: ${evaluateBoard(elem)}`);
    });
    */
    

    let BoardList = [];

    hypotheticalBoards.forEach((elem)=>{
        /*
        BoardList.push({
            'board': new Int8Array(elem),
            'score': evaluateBoard(elem),
            'reference': {
                'generation': generation < 0 ? null : generation,
                'index': index
            }
        });
        */
       BoardList.push(new Int8Array(elem));
    });

    generationalArray.push(BoardList);

    /* Breadth first search, scrapped because incompatible for Alpha - Beta pruning
    if (iteration) {
        for(let i = 0; i < difficulty * 2; i++) {
            let ProcessedGens = ProcessGenerations(generationalArray[generationalArray.length - 1], player);
            generationalArray.push(GetHighestScoreArray(ProcessedGens));
        };
    };
    */
    

    /* Depth first search - HELL
    Spent 2-3 hours breaking my head on it just for it to loop forever

    if (iteration) {
        let bestResult = (alphaBeta(BoardList, player));
        console.log(bestResult)
    };
    */
   
    /* Miserable Monte Carlo attempt. I hate my life. 
    if (iteration) {
        let result = monteCarlo(BoardList, player);
        printBoard(result.board)
    };
    */

    //fs.writeFile('./assets/moves.json', JSON.stringify(generationalArray, null, 2), 'utf-8', (err)=>{ if (err) console.log(err) });

    if (iteration) {
        return GetHighestScore(BoardList);
    } else
        return BoardList;
};

function ProcessGenerations(BoardList, player) {
    let Result = [];

    BoardList.forEach((elem, index)=>{
        let Board = elem.board;
        let Generation = elem.reference.generation != null ? elem.reference.generation + 1 : 0;
        let Moves = getAllMoves(Board, player * -1, Generation, index, false);
        Result = Result.concat(Moves);
    });
    
    return Result;
};

function GetHighestScoreArray(BoardList) {
    let highestScore = -Infinity;

    BoardList.forEach((elem)=>{
        if (highestScore < elem.score) {
            highestScore = elem.score;
        }; 
    });

    BoardList.forEach((elem, index)=>{
        if (elem.score != highestScore)
            BoardList.splice(index);
    });

    return BoardList;
};

function GetHighestScore(BoardList) {
    let exportElem = BoardList[0];

    BoardList.forEach((elem)=>{
        if (exportElem.score < elem.score) {
            exportElem = elem;
        };
    });

    return exportElem;
};