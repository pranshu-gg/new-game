// Tic Tac Toe Game
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;
let winner = null;

const cellSize = 150;
const offsetX = (canvas.width - cellSize * 3) / 2;
const offsetY = (canvas.height - cellSize * 3) / 2;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6] // diagonals
];

function checkWinner() {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== '')) return 'tie';
    return null;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#4a4a6a';
    ctx.lineWidth = 4;
    
    for (let i = 1; i < 3; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(offsetX + i * cellSize, offsetY);
        ctx.lineTo(offsetX + i * cellSize, offsetY + cellSize * 3);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + i * cellSize);
        ctx.lineTo(offsetX + cellSize * 3, offsetY + i * cellSize);
        ctx.stroke();
    }
    
    // Draw X's and O's
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = offsetX + col * cellSize + cellSize / 2;
        const y = offsetY + row * cellSize + cellSize / 2;
        
        if (board[i] === 'X') {
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            const offset = 40;
            ctx.beginPath();
            ctx.moveTo(x - offset, y - offset);
            ctx.lineTo(x + offset, y + offset);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + offset, y - offset);
            ctx.lineTo(x - offset, y + offset);
            ctx.stroke();
        } else if (board[i] === 'O') {
            ctx.strokeStyle = '#4ecdc4';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.arc(x, y, 45, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    // Draw status text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    
    if (gameOver) {
        if (winner === 'tie') {
            ctx.fillText("It's a Tie! Click to restart", canvas.width / 2, 50);
        } else {
            ctx.fillText(`${winner} Wins! Click to restart`, canvas.width / 2, 50);
        }
    } else {
        ctx.fillText(`${currentPlayer}'s Turn`, canvas.width / 2, 50);
    }
}

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (gameOver) {
        // Reset game
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameOver = false;
        winner = null;
        draw();
        return;
    }
    
    // Check if click is in grid
    const col = Math.floor((x - offsetX) / cellSize);
    const row = Math.floor((y - offsetY) / cellSize);
    
    if (col >= 0 && col < 3 && row >= 0 && row < 3) {
        const index = row * 3 + col;
        
        if (board[index] === '') {
            board[index] = currentPlayer;
            winner = checkWinner();
            
            if (winner) {
                gameOver = true;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
            draw();
        }
    }
}

canvas.addEventListener('click', handleClick);

// Initial draw
draw();