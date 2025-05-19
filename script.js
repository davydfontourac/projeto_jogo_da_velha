let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scoreX = 0;
let scoreO = 0;
let winLine = [];
let soundOn = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function makeMove(index) {
    if (gameActive && board[index] === '') {
        board[index] = currentPlayer;
        const cell = document.getElementsByClassName('cell')[index];
        cell.innerText = currentPlayer;
        cell.setAttribute('aria-label', `Célula ${index + 1}: ${currentPlayer}`);
        cell.classList.add('selected');

        if (checkWinner()) {
            document.getElementById('result').innerText = `Jogador ${currentPlayer} venceu!`;
            updateScore(currentPlayer);
            highlightWin();
            disableBoard();
            gameActive = false;
        } else if (board.every(cell => cell !== '')) {
            document.getElementById('result').innerText = 'Empate!';
            disableBoard();
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('turn').innerText = `Vez do Jogador ${currentPlayer}`;
        }
    }
}

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            winLine = pattern;
            return true;
        }
    }
    winLine = [];
    return false;
}

function highlightWin() {
    if (winLine.length === 3) {
        const cells = document.getElementsByClassName('cell');
        winLine.forEach(i => {
            cells[i].classList.add('win');
        });
    }
}

function disableBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.disabled = true;
    }
}

function enableBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.disabled = false;
        cell.classList.remove('win');
    }
}

function updateScore(player) {
    if (player === 'X') {
        scoreX++;
    } else {
        scoreO++;
    }
    document.getElementById('score').innerText = `Placar: Jogador X - ${scoreX} | Jogador O - ${scoreO}`;
}

function playBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (soundOn) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(() => {
            waitUserInteractionToPlay();
        });
    } else {
        backgroundMusic.pause();
    }
    updateSoundIcon();
}

function waitUserInteractionToPlay() {
    function tryPlay() {
        const backgroundMusic = document.getElementById('backgroundMusic');
        if (soundOn) {
            backgroundMusic.play();
        }
        document.body.removeEventListener('click', tryPlay);
        document.body.removeEventListener('touchstart', tryPlay);
    }
    document.body.addEventListener('click', tryPlay);
    document.body.addEventListener('touchstart', tryPlay);
}

function toggleSound() {
    soundOn = !soundOn;
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (soundOn) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
    updateSoundIcon();
}

function updateSoundIcon() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;
    btn.innerText = soundOn ? '🔊' : '🔇';
    btn.setAttribute('aria-label', soundOn ? 'Desligar som' : 'Ligar som');
    btn.setAttribute('title', soundOn ? 'Desligar som' : 'Ligar som');
}

function restartGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    winLine = [];

    document.getElementById('result').innerText = '';
    document.getElementById('result').style.color = '';
    document.getElementById('turn').innerText = `Vez do Jogador ${currentPlayer}`;

    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].disabled = false;
        cells[i].classList.remove('win');
        cells[i].classList.remove('selected');
        cells[i].setAttribute('aria-label', `Célula ${i + 1}`);
    }

    playBackgroundMusic();
}
