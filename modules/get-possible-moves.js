export function getPossibleMoves(board, selectedIndex, sign) {
    let result = sign >= 0 ? getPossibleMovesWhite(board, selectedIndex) : getPossibleMovesBlack(board, selectedIndex);
    return result;
}

function getPossibleMovesWhite(board, selectedIndex) {
    const moves = { left: undefined, right: undefined };
    const captured = { left: undefined, right: undefined };
    const piece = board[selectedIndex];
    if (piece !== 1 && piece !== 2) return moves; 
    
    const rowLength = 4;

    const row = Math.floor(selectedIndex / rowLength);
    const isEvenRow = row % 2 === 0;

    const forwardLeft = selectedIndex - (isEvenRow ? 4 : 5);
    const forwardRight = selectedIndex - (isEvenRow ? 3 : 4); 

    const CurrentRow = Math.floor(selectedIndex / rowLength)
    const LeftRow = Math.floor(forwardLeft / rowLength)
    const RightRow = Math.floor(forwardRight / rowLength)

    if (forwardLeft >= 0 && board[forwardLeft] === 0 && Math.abs(CurrentRow - LeftRow) <= 1) moves.left = forwardLeft;
    if (forwardRight >= 0 && board[forwardRight] === 0 && Math.abs(CurrentRow - RightRow) <= 1) moves.right = forwardRight;

    const jumpLeft = selectedIndex - 9;
    const jumpRight = selectedIndex - 7;

    if (
        jumpLeft >= 0 &&
        board[forwardLeft] < 0 && 
        board[jumpLeft] === 0
    ) { moves.left = jumpLeft; captured.left = (isEvenRow ? jumpLeft + 5 : jumpLeft + 4)};

    if (
        jumpRight >= 0 &&
        board[forwardRight] < 0 &&
        board[jumpRight] === 0
    ) { moves.right = jumpRight; captured.right = (isEvenRow ? jumpRight + 4 : jumpRight + 3) };

    return [moves, captured];
}

export function getPossibleMovesBlack(board, selectedIndex) {
    const moves = { left: undefined, right: undefined };
    const captured = { left: undefined, right: undefined };
    const piece = board[selectedIndex];
    if (piece !== -1) return [moves, captured];

    const rowLength = 4;
    const row = Math.floor(selectedIndex / rowLength);
    const isEvenRow = row % 2 === 0;

    const forwardLeft = selectedIndex + (isEvenRow ? 4 : 3);
    const forwardRight = selectedIndex + (isEvenRow ? 5 : 4);

    const leftRow = Math.floor(forwardLeft / rowLength);
    const rightRow = Math.floor(forwardRight / rowLength);

    if (forwardLeft < 32 && board[forwardLeft] === 0 && leftRow === row + 1)
        moves.left = forwardLeft;

    if (forwardRight < 32 && board[forwardRight] === 0 && rightRow === row + 1)
        moves.right = forwardRight;

    const jumpLeft = selectedIndex + 7;
    const jumpRight = selectedIndex + 9;

    const midLeft = selectedIndex + (isEvenRow ? 4 : 3);
    const midRight = selectedIndex + (isEvenRow ? 5 : 4);

    const jumpLeftRow = Math.floor(jumpLeft / rowLength);
    const jumpRightRow = Math.floor(jumpRight / rowLength);

    if (
        jumpLeft < 32 &&
        board[midLeft] > 0 &&
        board[jumpLeft] === 0 &&
        jumpLeftRow === row + 2
    ) {
        moves.left = jumpLeft;
        captured.left = midLeft;
    }

    if (
        jumpRight < 32 &&
        board[midRight] > 0 &&
        board[jumpRight] === 0 &&
        jumpRightRow === row + 2
    ) {
        moves.right = jumpRight;
        captured.right = midRight;
    }

    return [moves, captured];
}