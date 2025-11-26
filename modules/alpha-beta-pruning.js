import { getAllMoves } from "./get-all-moves.js";
import { printBoard } from "./print-board.js";

export function alphaBeta(generations, player, nodeIndex = 0, visited = new Set()) {
    let selectedNode = generations[nodeIndex];
    player = player * -1

    let boardKey = selectedNode.board.join(',');
    if (visited.has(boardKey)) {
        console.log('visited!')
        return selectedNode; // avoid infinite recursion
    }
    visited.add(boardKey);

    let Generation = selectedNode.reference.generation != null ? selectedNode.reference.generation + 1 : 0;
    let Nodes = getAllMoves(selectedNode.board, player, Generation, nodeIndex, false);

    if (Nodes.length <= 0) {
        return selectedNode;
    }

    let HighestScoring;

    for (let i = 0; i < Nodes.length; i++) {
        let elem = Nodes[i];
        let result = alphaBeta([elem], player, 0, visited);

        if (!HighestScoring || result.score > HighestScoring.score) {
            HighestScoring = result;
        };
    };
    
    return HighestScoring;
};