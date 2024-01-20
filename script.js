// Variáveis para controlar o estado do jogo
let currentPlayer = 'X'; // Jogador atual (inicia com X)
let board = ['', '', '', '', '', '', '', '', '']; // Tabuleiro do jogo
let gameActive = true; // Indica se o jogo está ativo
let scoreX = 0; // Placar do jogador X
let scoreO = 0; // Placar do jogador O

// Padrões de vitória no tabuleiro
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Função chamada quando um movimento é feito
function makeMove(index) {
    // Verifica se o jogo está ativo e se a célula está vazia
    if (gameActive && board[index] === '') {
        // Marca a célula com o símbolo do jogador atual
        board[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].innerText = currentPlayer;

        // Verifica se o jogador atual venceu
        if (checkWinner()) {
            document.getElementById('result').innerText = `Jogador ${currentPlayer} venceu!`;
            updateScore(currentPlayer);
            gameActive = false; // Desativa o jogo
        } else if (board.every(cell => cell !== '')) {
            // Se todas as células estiverem preenchidas e não houver vencedor, é um empate
            document.getElementById('result').innerText = 'Empate!';
            gameActive = false; // Desativa o jogo
        } else {
            // Troca para o próximo jogador
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('turn').innerText = `Vez do Jogador ${currentPlayer}`;
        }
    }
}

// Função para verificar se há um vencedor
function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        // Verifica se as células formam um padrão de vitória
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Função para atualizar o placar
function updateScore(player) {
    if (player === 'X') {
        scoreX++;
    } else {
        scoreO++;
    }
    document.getElementById('score').innerText = `Placar: Jogador X - ${scoreX} | Jogador O - ${scoreO}`;
}

// Função para iniciar a reprodução da música de fundo
function playBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.play();
}

// Função para reiniciar o jogo
function restartGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    // Limpa o texto e a cor do resultado
    document.getElementById('result').innerText = '';
    document.getElementById('result').style.color = '';

    // Reinicia o texto do turno
    document.getElementById('turn').innerText = `Vez do Jogador ${currentPlayer}`;

    // Limpa os textos das células e reativa os botões
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerText = '';
    }

    // Inicia a reprodução da música
    playBackgroundMusic();
}
