const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const boardArray = [];
  for (let i = 0; i < (rows); i += 1) {
    boardArray[i] = [];
    for (let j = 0; j < (columns); j += 1) {
      boardArray[i][j] = { occupied: false, domElement: '' };
    }
  }
  return { boardArray };
})();
