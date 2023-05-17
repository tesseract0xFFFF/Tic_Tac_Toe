const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const boardArray = [];

  for (let i = 0; i < (rows); i += 1) {
    boardArray[i] = [];
    for (let j = 0; j < (columns); j += 1) {
      // Initializing mark properties with asterisks.
      // This type of padding will be important when checking for wins.
      boardArray[i][j] = { occupied: false, mark: '*', domElement: '' };
    }
  }

  const currentBoardState = []; // used to determine whether someone has won or not.
  return {
    boardArray, rows, columns, currentBoardState,
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
  const occupiedCells = [];

  // keeping track of occupied cells.
  const countingCells = () => {
    let occupiedCellCount = 0;
    const incrementCellcount = () => occupiedCellCount++;
    const resetCellCount = () => { occupiedCellCount = 0; };
    return { incrementCellcount, occupiedCellCount, resetCellCount };
  };

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
    while (occupiedCells.includes(randomCell)) {
      randomCell = getRandomCell();
    }
    randomCell.occupied = true;
    occupiedCells.push(randomCell);
    randomCell.mark = cpuMark;
    randomCell.domElement.textContent = `${randomCell.mark}`;
    cellCount.incrementCellcount();
  };

  const restartGame = () => {
    cellCount.resetCellCount();
    for (let i = 0; i < (gameBoard.rows); i += 1) {
      for (let j = 0; j < (gameBoard.columns); j += 1) {
        // Initializing mark properties with asterisks.
        // This type of padding will be important when checking for wins.
        gameBoard.boardArray[i][j].domElement.textContent = '';
        gameBoard.boardArray[i][j].occupied = false;
        gameBoard.boardArray[i][j].mark = '*';
      }
    }
    const announcement = document.querySelector('.announcer');
    announcement.textContent = '';
  };

  // checks for a win.
  const winCheck = () => {
    const player1Wins = ['xxx******', '***xxx***', '******xxx', 'x**x**x**', '*x**x**x*', '**x**x**x', 'x***x***x', '**x*x*x**'];
    const cpuWins = ['ooo******', '***ooo***', '******ooo', 'o**o**o**', '*o**o**o*', '**o**o**o', 'o***o***o', '**o*o*o**'];
    gameBoard.boardArray.forEach((subArray) => {
      subArray.forEach((cell) => { gameBoard.currentBoardState.push(cell.mark); });
    });
    const boardStateConvertedToString = gameBoard.currentBoardState.join('');
    // the arrays above do not contain every winning map in existence. i am only
    // looking for 8 states for each player.
    const player1WinState = boardStateConvertedToString.replaceAll('o', '*');
    const cpuWinState = boardStateConvertedToString.replaceAll('o', '*');
    // currentBoardState is rendered every time winCheck is invoked.
    gameBoard.currentBoardState.length = 0;
    // checks if player 1 won or not.
    if (player1Wins.includes(player1WinState)) {
      alert('player1 wins!');
      return 0;
    }

    if (cpuWins.includes(cpuWinState)) {
      alert('cpuWins wins!');
      return 1;
    }

    if (cellCount.occupiedCellCount === 9) {
      alert('tie!');
      return 2;
    }

    return false;
  };

  // Playes a round.
  const playRound = (obj) => {
    const currentCell = obj;
    if (obj.occupied === false) {
      currentCell.occupied = true;
      occupiedCells.push(currentCell);
      currentCell.mark = player1.getMark();
      currentCell.domElement.textContent = `${currentCell.mark}`;
      cellCount.incrementCellcount();
      // check for a win or a tie.
      const winOrNot = winCheck();
      if (winOrNot === 0) {
        const announcement = document.querySelector('.announcer');
        announcement.textContent = 'Player1 has won!';
        return;
      }
      if (winOrNot === 1) {
        const announcement = document.querySelector('.announcer');
        announcement.textContent = 'cpu has won!';
        return;
      }
      if (winOrNot === 2) {
        const announcement = document.querySelector('.announcer');
        announcement.textContent = 'tie!';
        return;
      }
      cpuTurn();
    }
  };
  return {
    playRound, player1, restartGame,
  };
};

// renders board display.
const displayControl = (() => {
  // creates a grid and appends an indicator of the current player.
  const container = document.querySelector('.container');
  const tictactoeGrid = document.querySelector('.tictactoeGrid');
  const currentPlayerDisplay = document.querySelector('.currentPlayer');
  container.appendChild(currentPlayerDisplay);

  const gameControl = gameController();
  const restartButton = document.querySelector('.restart');
  restartButton.addEventListener('click', gameControl.restartGame);

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
