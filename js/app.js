const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const boardArray = [];
  // keeps track of occupied cells.
  const occupiedCells = [];
  const consecutiveMarks = 0;

  for (let i = 0; i < (rows); i += 1) {
    boardArray[i] = [];
    for (let j = 0; j < (columns); j += 1) {
      boardArray[i][j] = { occupied: false, mark: '', domElement: '' };
    }
  }

  // const currentBoardState = []; // used to determine whether someone has won or not.
  return {
    boardArray, rows, columns, occupiedCells, consecutiveMarks,
  };
})();

// player factory function.
const player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getMark, getName };
};

// keeping track of occupied cells.
const countingCells = () => {
  let occupiedCellCount = 0;
  const incrementCellCount = () => { occupiedCellCount += 1; };
  const resetCellCount = () => { occupiedCellCount = 0; };
  const getCellCount = () => occupiedCellCount;
  return { incrementCellCount, resetCellCount, getCellCount };
};

const gameController = () => {
  const player1 = player('Player1', 'x');
  const cellCount = countingCells();

  // generates a pseudo-random number from 0 to 2
  const cpuRandomChoice = () => Math.floor(Math.random() * 3);

  // gets a random cell.
  const getRandomCell = () => {
    const randomRow = cpuRandomChoice();
    const randomColumn = cpuRandomChoice();
    const randomCell = gameBoard.boardArray[randomRow][randomColumn];
    return randomCell;
  };

  // plays a cpu turn.
  const cpuTurn = () => {
    const cpuMark = 'o';
    let randomCell = getRandomCell();
    // checks whether reandomCell is already occupied or not.
    // checks if all cells are already occupied.
    if (gameBoard.occupiedCells.length === 9) {
      alert('Tie!');
      return;
    }
    while (gameBoard.occupiedCells.includes(randomCell)) {
      randomCell = getRandomCell();
    }
    randomCell.occupied = true;
    gameBoard.occupiedCells.push(randomCell);
    randomCell.mark = cpuMark;
    randomCell.domElement.textContent = `${randomCell.mark}`;
    cellCount.incrementCellCount();
  };

  const restartGame = () => {
    cellCount.resetCellCount();
    for (let i = 0; i < (gameBoard.rows); i += 1) {
      for (let j = 0; j < (gameBoard.columns); j += 1) {
        // Initializing mark properties with asterisks.
        // This type of padding will be important when checking for wins.
        gameBoard.boardArray[i][j].domElement.textContent = '';
        gameBoard.boardArray[i][j].occupied = false;
        gameBoard.boardArray[i][j].mark = '';
      }
    }
    gameBoard.occupiedCells.length = 0;
    const announcement = document.querySelector('.announcer');
    announcement.textContent = '';
  };

  // checks for a win.
  const winCheck = (mark) => {
    // check for horizontal wins;

    for (let i = 0; i < (gameBoard.rows); i += 1) {
      gameBoard.consecutiveMarks = 0;
      for (let j = 0; j < (gameBoard.columns); j += 1) {
        if (gameBoard.boardArray[i][j].mark === mark) {
          gameBoard.consecutiveMarks += 1;
          // check if there are 3 consecutive marks of the same type in the current row.
          if (gameBoard.consecutiveMarks === 3) {
            return true;
          }
        } else {
          gameBoard.consecutiveMarks = 0;
        }
      }
    }

    // check for vertical wins
    for (let j = 0; j < (gameBoard.columns); j += 1) {
      gameBoard.consecutiveMarks = 0;
      for (let i = 0; i < (gameBoard.rows); i += 1) {
        if (gameBoard.boardArray[i][j].mark === mark) {
          gameBoard.consecutiveMarks += 1;
          // check if there are 3 consecutive marks of the same type in the current column.
          if (gameBoard.consecutiveMarks === 3) {
            return true;
          }
        } else {
          gameBoard.consecutiveMarks = 0;
        }
      }
    }
    // check for diagonal wins.
    if (gameBoard.boardArray[0][0].mark === mark
      && gameBoard.boardArray[1][1].mark === mark
       && gameBoard.boardArray[2][2].mark === mark) {
      return true;
    }
    if (gameBoard.boardArray[0][2].mark === mark
       && gameBoard.boardArray[1][1].mark === mark
        && gameBoard.boardArray[2][0].mark === mark) {
      return true;
    }
  };

  // sets all cells on board as occupied.
  const occupyAllCells = () => {
    for (let i = 0; i < (gameBoard.rows); i += 1) {
      for (let j = 0; j < (gameBoard.columns); j += 1) {
        gameBoard.boardArray[i][j].occupied = true;
      }
    }
  };

  // Playes a round.
  const playRound = (obj) => {
    const currentCell = obj;
    if (obj.occupied === false) {
      currentCell.occupied = true;
      gameBoard.occupiedCells.push(currentCell);
      currentCell.mark = player1.getMark();
      currentCell.domElement.textContent = `${currentCell.mark}`;
      cellCount.incrementCellCount();
      const winOrNotPlayer = winCheck('x');
      if (winOrNotPlayer === true) {
        occupyAllCells();
        const announcement = document.querySelector('.announcer');
        announcement.textContent = 'Player1 has won!';
        return;
      }

      cpuTurn();
      const winOrNotCpu = winCheck('o');
      if (winOrNotCpu === true) {
        occupyAllCells();
        const announcement = document.querySelector('.announcer');
        announcement.textContent = 'CPU has won!';
      }
    }
  };
  return {
    playRound, player1, restartGame,
  };
};

// renders board display.
const displayControl = (() => {
  const game = gameController();
  // creates a grid and appends an indicator of the current player.
  const container = document.querySelector('.container');
  const tictactoeGrid = document.querySelector('.tictactoeGrid');
  const currentPlayerDisplay = document.querySelector('.currentPlayer');
  container.appendChild(currentPlayerDisplay);

  // creates a restart buttons and attackes an event listener to it.
  const gameControl = gameController();
  const restartButton = document.querySelector('.restart');
  restartButton.addEventListener('click', game.restartGame);

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
