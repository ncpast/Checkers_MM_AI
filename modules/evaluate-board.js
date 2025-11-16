export function evaluateBoard(board) {
  let score = 0;
  for (const cell of board) {
    if (cell === -1) score += 1;     // AI piece
    if (cell === -2) score += 3;     // AI king
    if (cell === 1) score -= 1;      // player piece
    if (cell === 2) score -= 3;      // player king
  }
  return score;
}
