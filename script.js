const cells = document.querySelectorAll('.cell');
const resultDiv = document.querySelector('.result');
const resetButton = document.querySelector('.reset');
const playerModeButton = document.getElementById('player-mode');
const aiModeButton = document.getElementById('ai-mode');

let currentPlayer = 'X';
let gameMode = 'player';
let gameState = ['', '', '', '', '', '', '', '', ''];

function checkWin() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
  ];

  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      resultDiv.textContent = `${gameState[a]} wins!`;
      cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
      highlightWinningLine(combo); 
      return true; 
    }
  }

  if (!gameState.includes('')) {
    resultDiv.textContent = "It's a tie!";
    return false; 
  }

  return false; 
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (gameState[index] !== '') return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (gameMode === 'ai' && !resultDiv.textContent) {
    aiMove();
  }
}

function aiMove() {
  let availableCells = gameState.reduce((acc, value, index) => {
    if (value === '') acc.push(index);
    return acc;
  }, []);

  if (availableCells.length === 0) return;

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const aiIndex = availableCells[randomIndex];

  gameState[aiIndex] = 'O';
  cells[aiIndex].textContent = 'O';

  checkWin();

  currentPlayer = 'X';
}

function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  resultDiv.textContent = '';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winning-tile');
    cell.addEventListener('click', handleCellClick);
  });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
playerModeButton.addEventListener('click', () => {
  gameMode = 'player';
  resetGame();
});
aiModeButton.addEventListener('click', () => {
  gameMode = 'ai';
  resetGame();
});

function highlightWinningLine(winningIndexes) {
  winningIndexes.forEach(index => {
    cells[index].classList.add('winning-tile');
  });
}