// Basic 2048 Game Logic

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const newGameButton = document.getElementById('new-game');

let board = [];
let score = 0;
let bestScore = 0;

const size = 4; // 4x4 board

function initializeGame() {
    board = Array(size).fill().map(() => Array(size).fill(0));
    addRandomTile();
    addRandomTile();
    updateBoard();
}

function addRandomTile() {
    let emptyCells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) emptyCells.push({ x: i, y: j });
        }
    }

    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
                cell.setAttribute('data-value', board[i][j]);
            }
            gameBoard.appendChild(cell);
        }
    }
    scoreElement.textContent = score;
    bestScoreElement.textContent = Math.max(bestScore, score);
}

function move(direction) {
    let rotated = false;

    // Rotate the board based on the direction
    if (direction === 'up') {
        board = rotate(board);
        rotated = true;
    } else if (direction === 'down') {
        board = rotate(rotate(rotate(board)));
        rotated = true;
    } else if (direction === 'right') {
        board = rotate(rotate(board));
        rotated = true;
    }

    let moved = false;
    for (let i = 0; i < size; i++) {
        let newRow = board[i].filter(value => value !== 0);
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j] === newRow[j + 1]) {
                newRow[j] *= 2;
                score += newRow[j];
                newRow.splice(j + 1, 1);
                newRow.push(0);
            }
        }
        while (newRow.length < size) newRow.push(0);
        if (board[i].join() !== newRow.join()) moved = true;
        board[i] = newRow;
    }

    // Rotate the board back to its original orientation
    if (rotated) {
        if (direction === 'up') {
            board = rotate(rotate(rotate(board)));
        } else if (direction === 'down') {
            board = rotate(board);
        } else if (direction === 'right') {
            board = rotate(rotate(board));
        }
    }

    if (moved) {
        addRandomTile();
        updateBoard();
        checkGameOver();
    }
}

function rotate(matrix) {
    const result = [];
    for (let i = 0; i < size; i++) {
        result.push([]);
        for (let j = 0; j < size; j++) {
            result[i][j] = matrix[size - j - 1][i];
        }
    }
    return result;
}

function checkGameOver() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) return;
            if (i < size - 1 && board[i][j] === board[i + 1][j]) return;
            if (j < size - 1 && board[i][j] === board[i][j + 1]) return;
        }
    }
    alert('Game Over! Your score: ' + score);
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowDown':
            move('up');
            break;
        case 'ArrowUp':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
    }
});

newGameButton.addEventListener('click', () => {
    score = 0;
    initializeGame();
});

initializeGame();
