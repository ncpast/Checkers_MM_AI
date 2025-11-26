import { getAllMoves } from "./get-all-moves.js";
import { printBoard } from "./print-board.js";

export function monteCarlo(generations, player, nodeIndex = 0, visited = new Set()) {
    let bestMove = null;
    let bestAvgScore = -Infinity;
    player = player * -1;

    let randomSelectedBoard = generations[Math.floor(Math.random() * generations.length)];
    let Generation = randomSelectedBoard.reference.generation != null ? randomSelectedBoard.reference.generation + 1 : 0;

    let Nodes = getAllMoves(randomSelectedBoard.board, player, Generation, nodeIndex, false);
}