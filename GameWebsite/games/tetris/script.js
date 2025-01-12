document.addEventListener('DOMContentLoaded', () => {  
    const canvas = document.getElementById('gameCanvas');  
    const ctx = canvas.getContext('2d');  
    const scoreElement = document.getElementById('score');  
    const startBtn = document.querySelector('.startBtn');  
    const restartBtn = document.querySelector('.restartBtn');  
    const homeBtn = document.querySelector('.homeBtn');  
  
    const gridWidth = 10;  
    const gridHeight = 20;  
    const blockSize = 30;  
    const canvasWidth = gridWidth * blockSize;  
    const canvasHeight = gridHeight * blockSize;  
  
    canvas.width = canvasWidth;  
    canvas.height = canvasHeight;  
  
    const colors = [  
        '#FF0D72',  
        '#0DC2FF',  
        '#0DFF72',  
        '#F538FF',  
        '#FF8E0D',  
        '#FFE138',  
        '#3877FF'  
    ];  
  
    const shapes = [  
        [  
            [1, 1, 1, 1]  
        ],  
        [  
            [1, 1],  
            [1, 1]  
        ],  
        [  
            [0, 1, 0],  
            [1, 1, 1]  
        ],  
        [  
            [1, 0, 0],  
            [1, 1, 1]  
        ],  
        [  
            [0, 0, 1],  
            [1, 1, 1]  
        ],  
        [  
            [1, 1, 0],  
            [0, 1, 1]  
        ],  
        [  
            [0, 1, 1],  
            [1, 1, 0]  
        ]  
    ];  
  
    let grid = [];  
    let currentShape = null;  
    let currentX = 0;  
    let currentY = 0;  
    let score = 0;  
    let gameInterval;  
    let gameRunning = false;  
    let dropInterval = 500;  
    let lastTime = 0;  
  
    function createGrid() {  
        for (let row = 0; row < gridHeight; row++) {  
            grid[row] = [];  
            for (let col = 0; col < gridWidth; col++) {  
                grid[row][col] = 0;  
            }  
        }  
    }  
  
    function drawBlock(x, y, color) {  
        ctx.fillStyle = color;  
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);  
        ctx.strokeStyle = '#fff';  
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);  
    }  
  
    function drawGrid() {  
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);  
        for (let row = 0; row < gridHeight; row++) {  
            for (let col = 0; col < gridWidth; col++) {  
                if (grid[row][col] > 0) {  
                    drawBlock(col, row, colors[grid[row][col] - 1]);  
                }  
            }  
        }  
    }  
  
    function drawShape() {  
        if (!currentShape) return;  
        for (let row = 0; row < currentShape.length; row++) {  
            for (let col = 0; col < currentShape[row].length; col++) {  
                if (currentShape[row][col]) {  
                    drawBlock(currentX + col, currentY + row, colors[currentShape[row][col] - 1]);  
                }  
            }  
        }  
    }  
  
    function createShape() {  
        const randomIndex = Math.floor(Math.random() * shapes.length);  
        currentShape = shapes[randomIndex].map(row => [...row]);  
        currentX = Math.floor(gridWidth / 2) - Math.floor(currentShape[0].length / 2);  
        currentY = 0;  
    }  
  
    function isValidMove(shape, x, y) {  
        for (let row = 0; row < shape.length; row++) {  
            for (let col = 0; col < shape[row].length; col++) {  
                if (shape[row][col]) {  
                    if (x + col < 0 || x + col >= gridWidth || y + row >= gridHeight || grid[y + row][x + col]) {  
                        return false;  
                    }  
                }  
            }  
        }  
        return true;  
    }  
  
    function mergeShape() {  
        for (let row = 0; row < currentShape.length; row++) {  
            for (let col = 0; col < currentShape[row].length; col++) {  
                if (currentShape[row][col]) {  
                    grid[currentY + row][currentX + col] = currentShape[row][col];  
                }  
            }  
        }  
    }  
  
    function clearLines() {  
        let linesCleared = 0;  
        for (let row = gridHeight - 1; row >= 0; row--) {  
            if (grid[row].every(cell => cell > 0)) {  
                grid.splice(row, 1);  
                grid.unshift(new Array(gridWidth).fill(0));  
                linesCleared++;  
                row++;  
            }  
        }  
        score += linesCleared * 10;  
        scoreElement.textContent = score;  
    }  
  
    function moveDown() {  
        if (isValidMove(currentShape, currentX, currentY + 1)) {  
            currentY++;  
        } else {  
            mergeShape();  
            clearLines();  
            createShape();  
            if (!isValidMove(currentShape, currentX, currentY)) {  
                gameRunning = false;  
                clearInterval(gameInterval);  
                alert('Game Over!');  
            }  
        }  
    }  
  
    function moveLeft() {  
        if (isValidMove(currentShape, currentX - 1, currentY)) {  
            currentX--;  
        }  
    }  
  
    function moveRight() {  
        if (isValidMove(currentShape, currentX + 1, currentY)) {  
            currentX++;  
        }  
    }  
  
    function rotateShape() {  
        const rotatedShape = currentShape[0].map((_, colIndex) => currentShape.map(row => row[colIndex]).reverse());  
        if (isValidMove(rotatedShape, currentX, currentY)) {  
            currentShape = rotatedShape;  
        }  
    }  
  
    function updateGame(time = 0) {  
        const deltaTime = time - lastTime;  
        lastTime = time;  
  
        if (deltaTime > dropInterval) {  
            moveDown();  
            lastTime = time;  
        }  
  
        drawGrid();  
        drawShape();  
        requestAnimationFrame(updateGame);  
    }  
  
    function startGame() {  
        if (gameRunning) return;  
        createGrid();  
        createShape();  
        gameRunning = true;  
        lastTime = 0;  
        requestAnimationFrame(updateGame);  
    }  
  
    function resetGame() {  
        clearInterval(gameInterval);  
        grid = [];  
        createGrid();  
        currentShape = null;  
        currentX = 0;  
        currentY = 0;  
        score = 0;  
        scoreElement.textContent = score;  
        gameRunning = false;  
        drawGrid();  
    }  
  
    function handleKeyPress(event) {  
        if (!gameRunning) return;  
        if (event.key === 'ArrowLeft') {  
            moveLeft();  
        } else if (event.key === 'ArrowRight') {  
            moveRight();  
        } else if (event.key === 'ArrowDown') {  
            moveDown();  
        } else if (event.key === 'ArrowUp') {  
            rotateShape();  
        }  
    }  
  
    startBtn.addEventListener('click', startGame);  
    restartBtn.addEventListener('click', resetGame);  
    homeBtn.addEventListener('click', () => {  
        window.location.href = "../../index.html"; // Path relatif ke index.html  
    });  
    document.addEventListener('keydown', handleKeyPress);  
  
    // Inisialisasi grid awal  
    createGrid();  
    drawGrid();  
});  
