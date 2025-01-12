document.addEventListener('DOMContentLoaded', () => {    
    const cells = document.querySelectorAll('.cell');    
    const statusText = document.querySelector('.statusText');    
    const restartBtn = document.querySelector('.restartBtn');    
    const difficultySelect = document.querySelector('.difficultySelect');    
    const homeBtn = document.querySelector('.homeBtn');    
    const scoreXElement = document.getElementById('scoreX');    
    const scoreOElement = document.getElementById('scoreO');    
    const winConditions = [    
        [0, 1, 2],    
        [3, 4, 5],    
        [6, 7, 8],    
        [0, 3, 6],    
        [1, 4, 7],    
        [2, 5, 8],    
        [0, 4, 8],    
        [2, 4, 6]    
    ];    
    let options = ["", "", "", "", "", "", "", "", ""];    
    let currentPlayer = "X";    
    let running = false;    
    let difficulty = "easy";    
    let scoreX = 0;    
    let scoreO = 0;    
    let lastWinner = ""; // Menyimpan pemenang terakhir  
  
    initializeGame();    
  
    function initializeGame() {    
        cells.forEach(cell => cell.addEventListener('click', cellClicked));    
        restartBtn.addEventListener('click', restartGame);    
        difficultySelect.addEventListener('change', changeDifficulty);    
        homeBtn.addEventListener('click', goHome);    
        updateStatusText();    
        running = true;    
        if (currentPlayer === "O") {  
            setTimeout(() => computerMove(), 500);  
        }  
    }    
  
    function cellClicked() {    
        if (!running) return; // Jangan memungkinkan klik saat permainan tidak berjalan  
  
        const cellIndex = this.getAttribute('cellIndex');    
  
        if(options[cellIndex] != "" || !running) {    
            return;    
        }    
  
        updateCell(this, cellIndex);    
        checkWinner();    
        if(running && currentPlayer === "O") {    
            setTimeout(() => computerMove(), 500);    
        }    
    }    
  
    function updateCell(cell, index) {    
        options[index] = currentPlayer;    
        cell.textContent = currentPlayer;    
        cell.classList.add(currentPlayer);    
    }    
  
    function changePlayer() {    
        currentPlayer = (currentPlayer == "X") ? "O" : "X";    
        updateStatusText();    
    }    
  
    function updateStatusText() {    
        if (currentPlayer === "X") {    
            statusText.textContent = "Giliranmu X";    
        } else {    
            statusText.textContent = "Giliran Lawan O";    
        }    
    }    
  
    function checkWinner() {    
        let roundWon = false;    
        for(let i = 0; i < winConditions.length; i++) {    
            const condition = winConditions[i];    
            const cellA = options[condition[0]];    
            const cellB = options[condition[1]];    
            const cellC = options[condition[2]];    
  
            if(cellA == "" || cellB == "" || cellC == "") {    
                continue;    
            }    
            if(cellA == cellB && cellB == cellC) {    
                roundWon = true;    
                break;    
            }    
        }    
  
        if(roundWon) {    
            if (currentPlayer === "X") {    
                scoreX++;    
                scoreXElement.textContent = scoreX;    
                lastWinner = "X";    
            } else {    
                scoreO++;    
                scoreOElement.textContent = scoreO;    
                lastWinner = "O";    
            }    
            statusText.textContent = `${currentPlayer} Menang!`;    
            running = false;    
            setTimeout(restartGame, 1500); // Otomatis memulai ulang setelah 1.5 detik    
            return;    
        }    
  
        let roundDraw = !options.includes("");    
        if(roundDraw) {    
            statusText.textContent = `Permainan Seri!`;    
            running = false;    
            setTimeout(restartGame, 1500); // Otomatis memulai ulang setelah 1.5 detik    
            return;    
        }    
  
        changePlayer();    
    }    
  
    function restartGame() {    
        currentPlayer = lastWinner === "X" ? "O" : "X"; // Ganti pemain yang memulai    
        options = ["", "", "", "", "", "", "", "", ""];    
        updateStatusText();    
        cells.forEach(cell => {    
            cell.textContent = "";    
            cell.classList.remove("X", "O");    
        });    
        running = true;    
        if (currentPlayer === "O") {  
            setTimeout(() => computerMove(), 500);  
        }  
    }    
  
    function changeDifficulty() {    
        difficulty = difficultySelect.value;    
        resetScores();    
        restartGame();    
    }    
  
    function resetScores() {    
        scoreX = 0;    
        scoreO = 0;    
        scoreXElement.textContent = scoreX;    
        scoreOElement.textContent = scoreO;    
    }    
  
    function computerMove() {    
        if(!running) return;    
  
        let moveIndex;    
        if(difficulty === "easy") {    
            moveIndex = getEasyMove();    
        } else if(difficulty === "medium") {    
            moveIndex = getMediumMove();    
        } else if(difficulty === "hard") {    
            moveIndex = getHardMove();    
        }    
  
        if(moveIndex !== null) {    
            updateCell(cells[moveIndex], moveIndex);    
            checkWinner();    
        }    
    }    
  
    function getEasyMove() {    
        let availableMoves = [];    
        options.forEach((cell, index) => {    
            if(cell === "") {    
                availableMoves.push(index);    
            }    
        });    
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];    
    }    
  
    function getMediumMove() {    
        let moveIndex = getWinningMove("O");    
        if(moveIndex !== null) return moveIndex;    
  
        moveIndex = getWinningMove("X");    
        if(moveIndex !== null) return moveIndex;    
  
        return getEasyMove();    
    }    
  
    function getHardMove() {    
        let moveIndex = getWinningMove("O");    
        if(moveIndex !== null) return moveIndex;    
  
        moveIndex = getWinningMove("X");    
        if(moveIndex !== null) return moveIndex;    
  
        if(options[4] === "") return 4;    
  
        let availableCorners = [0, 2, 6, 8];    
        availableCorners = availableCorners.filter(index => options[index] === "");    
        if(availableCorners.length > 0) {    
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];    
        }    
  
        return getEasyMove();    
    }    
  
    function getWinningMove(player) {    
        for(let i = 0; i < winConditions.length; i++) {    
            const [a, b, c] = winConditions[i];    
            let count = 0;    
            let emptyIndex = null;    
  
            if(options[a] === player) count++;    
            if(options[a] === "") emptyIndex = a;    
  
            if(options[b] === player) count++;    
            if(options[b] === "") emptyIndex = b;    
  
            if(options[c] === player) count++;    
            if(options[c] === "") emptyIndex = c;    
  
            if(count === 2 && emptyIndex !== null) {    
                return emptyIndex;    
            }    
        }    
        return null;    
    }    
  
    function goHome() {    
        window.location.href = "../../index.html"; // Path relatif ke index.html    
    }    
});  
