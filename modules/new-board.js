export function createNewGame() {
  const squares = new Int8Array(32).fill(0);

  for (let i = 0; i < 12; i++) 
    //if (i >= 4 && i < 8)
      squares[i] = -1;

  for (let i = 20; i < 32; i++) squares[i] = 1;

  return squares;
  return [
    0, 0, 0, 0,  
    0, 0, 0, 0,  
    1, 1, 2, 1,
    0, 0, 0, 0,
    -1, -2, -1, -1,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ];
};