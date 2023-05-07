const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const boardArray = [];
  for (let i = 0; i < (rows); i += 1) {
    boardArray[i] = [];
    for (let j = 0; j < (columns); j += 1) {
      boardArray[i][j] = { occupied: false, mark: '', domElement: '' };
    }
  }

  // what happens after a player clicks on a cell.
  const cellClick = (obj) => {
    if (obj.occupied === false) {
      obj.occupied = true;
    }
  };

  // goes over objects in the array and binds
  // them to their respective div elements
  const elementGenerator = () => {
    for (let i = 0; i < (rows); i += 1) {
      for (let j = 0; j < (columns); j += 1) {
        const objectInArray = boardArray[i][j];
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        // addEventListener uses its default 'this' value so i could not rely on 'this'
        // to reference the object in the array instead, i used a closure.
        cellElement.addEventListener('click', () => {
          cellClick(objectInArray);
        });
        objectInArray.domElement = cellElement;
        const tictactoeGrid = document.querySelector('.tictactoeGrid');
        tictactoeGrid.appendChild(cellElement);
      }
    }
  };

  return { boardArray, elementGenerator };
})();

gameBoard.elementGenerator();
