export function getPossibleMoves(board, selectedIndex, sign) {
    const isKing = Math.abs(board[selectedIndex]) == 2 ? true : false;
    let result;

    if (isKing) 
        result = sign <= 0 ? getPossibleMovesUp(board, selectedIndex) : getPossibleMovesDown(board, selectedIndex);
    else 
        result = sign >= 0 ? getPossibleMovesUp(board, selectedIndex) : getPossibleMovesDown(board, selectedIndex);

    return result;
};

function getPossibleMovesUp(board, selectedIndex) {
    const moves = { left: undefined, right: undefined };
    const captured = { left: undefined, right: undefined };
    const piece = board[selectedIndex];
    const sign = Math.sign(piece);
    
    const rowLength = 4;
    const row = Math.floor(selectedIndex / rowLength);
    const isEvenRow = row % 2 === 0;

    const forwardLeft = selectedIndex - (isEvenRow ? 4 : 5);
    const forwardRight = selectedIndex - (isEvenRow ? 3 : 4);

    const currentRow = row;
    const leftRow = Math.floor(forwardLeft / rowLength);
    const rightRow = Math.floor(forwardRight / rowLength);

    if (forwardLeft >= 0 && board[forwardLeft] === 0 && Math.abs(currentRow - leftRow) === 1)
        moves.left = forwardLeft;
    if (forwardRight >= 0 && board[forwardRight] === 0 && Math.abs(currentRow - rightRow) === 1)
        moves.right = forwardRight;

    const jumpLeft = selectedIndex - (isEvenRow ? 9 : 9); 
    const jumpRight = selectedIndex - (isEvenRow ? 7 : 7);

    if (
        jumpLeft >= 0 &&
        Math.sign(board[forwardLeft]) != sign && 
        board[forwardLeft] != 0 && 
        board[jumpLeft] === 0
    ) { 
        moves.left = jumpLeft; 
        captured.left = forwardLeft;
    };

    if (
        jumpRight >= 0 &&
        Math.sign(board[forwardRight]) != sign && 
        board[forwardRight] != 0 &&
        board[jumpRight] === 0
    ) { 
        moves.right = jumpRight; 
        captured.right = forwardRight;
    };

    return [moves, captured];
};

export function getPossibleMovesDown(board, selectedIndex) {
    const moves = { left: undefined, right: undefined };
    const captured = { left: undefined, right: undefined };
    const piece = board[selectedIndex];
    const sign = Math.sign(piece);

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
        Math.sign(board[midLeft]) != sign && 
        board[midLeft] != 0 &&
        board[jumpLeft] === 0 &&
        jumpLeftRow === row + 2
    ) {
        moves.left = jumpLeft;
        captured.left = midLeft;
    }

    if (
        jumpRight < 32 &&
        Math.sign(board[midRight]) != sign && 
        board[midRight] != 0 &&
        board[jumpRight] === 0 &&
        jumpRightRow === row + 2
    ) {
        moves.right = jumpRight;
        captured.right = midRight;
    }

    return [moves, captured];
};