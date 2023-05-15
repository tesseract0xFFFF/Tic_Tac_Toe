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

  return {
    boardArray, rows, columns,
  };
})();

// player factory function.
const player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getMark, getName };
};

const gameController = () => {
  const player1 = player('Player1', 'x');
  const player2 = player('Player2', 'o');

  const players = [player1, player2];
  let currentPlayer = players[0];

  // keeping track of occupied cells.
  let occupiedCellCount = 0;
  const incrementCellcount = () => occupiedCellCount++;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    const currentPlayerDisplay = document.querySelector('.currentPlayer');
    currentPlayerDisplay.textContent = `${currentPlayer.getName()}'s turn`;
  };

  // checks for a win.
  const winCheck = () => {
    if (occupiedCellCount === 9) {

    }
  };

  // Playes a round.
  const playRound = (obj) => {
    const currentCell = obj;
    if (obj.occupied === false) {
      currentCell.occupied = true;
      currentCell.mark = currentPlayer.getMark();
      currentCell.domElement.textContent = `${currentCell.mark}`;
      incrementCellcount();
      switchPlayer();
    }
  };
  return {
    playRound, player1, player2,
  };
};

// renders board display.
const displayControl = (() => {
  // creates a grid and appends an indicator of the current player.
  const container = document.querySelector('.container');
  const tictactoeGrid = document.querySelector('.tictactoeGrid');
  const currentPlayerDisplay = document.querySelector('.currentPlayer');
  container.appendChild(currentPlayerDisplay);

  const game = gameController();

  for (let i = 0; i < (gameBoard.rows); i += 1) {
    for (let j = 0; j < (gameBoard.columns); j += 1) {
      const objectInArray = gameBoard.boardArray[i][j];
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      // addEventListener uses its default 'this' value so i could not rely on 'this'
      // to reference the object in the array. Instead, i used a closure.
      cellElement.addEventListener('click', () => {
        game.playRound(objectInArray);
      });
      objectInArray.domElement = cellElement;
      tictactoeGrid.appendChild(cellElement);
    }
  }
  return { currentPlayerDisplay };
})();
