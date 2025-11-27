import { getAllMoves } from "./get-all-moves.js";
import { evaluateBoard } from "./evaluate-board.js";

export function Minimax(board, player, depth) {
    const result = alphaBeta(new Int8Array(board), player, depth, -Infinity, Infinity, true);
    return result.board;
};

function alphaBeta(board, player, depth, alpha, beta, maximizingPlayer) {
    const moves = getAllMoves(new Int8Array(board), player);

    if (depth === 0 || moves.length === 0) {
        return { score: evaluateBoard(board), board };
    }

    let bestBoard = null;

    if (maximizingPlayer) {
        let bestScore = -Infinity;

        for (const next of moves) {
            const result = alphaBeta(next, player * -1, depth - 1, alpha, beta, false);

            if (result.score > bestScore) {
                bestScore = result.score;
                bestBoard = next;
            };

            alpha = Math.max(alpha, bestScore);
            if (alpha >= beta) break;
        };

        return { score: bestScore, board: bestBoard };
    } else {
        let bestScore = Infinity;

        for (const next of moves) {
            const result = alphaBeta(next, player * -1, depth - 1, alpha, beta, true);

            if (result.score < bestScore) {
                bestScore = result.score;
                bestBoard = next;
            }

            beta = Math.min(beta, bestScore);
            if (alpha >= beta) break;
        };

        return { score: bestScore, board: bestBoard };
    };
};