import React, { useState, useEffect } from 'react';
import './App.css';
import { useSoundEffects } from './useSoundEffects';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [board, setBoard] = useState(Array(9).fill(''));
  const [gameActive, setGameActive] = useState(true);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const [result, setResult] = useState('');
  const [winningCells, setWinningCells] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameMode, setGameMode] = useState('human'); 
  const [difficulty, setDifficulty] = useState('medium'); 
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [whoStartsNext, setWhoStartsNext] = useState('player1'); 
  const { playMoveSound, playWinSound } = useSoundEffects();

  // AI Functions
  const getRandomMove = (availableMoves) => {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const getWinningMove = (board, player) => {
    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (board[a] === player && board[b] === player && board[c] === '') return c;
      if (board[a] === player && board[b] === '' && board[c] === player) return b;
      if (board[a] === '' && board[b] === player && board[c] === player) return a;
    }
    return -1;
  };

  const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
    const winner = checkWinnerForMinimax(board);
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (!board.includes('')) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          const evaluation = minimax(board, depth + 1, false, alpha, beta);
          board[i] = '';
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          const evaluation = minimax(board, depth + 1, true, alpha, beta);
          board[i] = '';
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  };

  const checkWinnerForMinimax = (board) => {
    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const getBestMove = (board) => {
    let bestMove = -1;
    let bestValue = -Infinity;
    
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        const moveValue = minimax(board, 0, false);
        board[i] = '';
        
        if (moveValue > bestValue) {
          bestValue = moveValue;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const getComputerMove = (board) => {
    const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    
    if (availableMoves.length === 0) return -1;

    if (difficulty === 'easy') {
      return getRandomMove(availableMoves);
    }
    
    if (difficulty === 'medium') {

      const winMove = getWinningMove(board, 'O');
      if (winMove !== -1) return winMove;
      
      const blockMove = getWinningMove(board, 'X');
      if (blockMove !== -1) return blockMove;
      
      if (board[4] === '') return 4;
      

      return getRandomMove(availableMoves);
    }
    
    if (difficulty === 'hard') {
      return getBestMove(board);
    }
  };


  const getPlayerSymbol = (playerType) => {
    if (gameMode === 'human') {
      // Modo 2 jogadores: quem começa usa X
      if (whoStartsNext === 'player1') {
        return playerType === 'player1' ? 'X' : 'O';
      } else {
        return playerType === 'player2' ? 'X' : 'O';
      }
    } else {
      // Modo vs computador: quem começa usa X
      if (whoStartsNext === 'computer') {
        return playerType === 'computer' ? 'X' : 'O';
      } else {
        return playerType === 'player' ? 'X' : 'O';
      }
    }
  };

  const getCurrentPlayerType = () => {
    if (gameMode === 'human') {
      if (whoStartsNext === 'player1') {
        return currentPlayer === 'X' ? 'player1' : 'player2';
      } else {
        return currentPlayer === 'X' ? 'player2' : 'player1';
      }
    } else {
      if (whoStartsNext === 'computer') {
        return currentPlayer === 'X' ? 'computer' : 'player';
      } else {
        return currentPlayer === 'X' ? 'player' : 'computer';
      }
    }
  };

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const makeMove = (index, player = currentPlayer) => {
    if (gameActive && board[index] === '') {

      if (soundEnabled) {
        try {
          playMoveSound();
        } catch (error) {
          console.log('Sound not available');
        }
      }

      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);

      const winningPattern = checkWinner(newBoard);
      if (winningPattern) {
        let winner;
        if (gameMode === 'computer') {
          winner = player === 'O' ? 'Computador' : 'Jogador';
        } else {
          winner = player === 'X' ? 'Jogador 1' : 'Jogador 2';
        }
        setResult(`🎉 ${winner} venceu!`);
        setWinningCells(winningPattern);
        updateScore(player);
        setGameActive(false);
        setGameHistory([...gameHistory, { winner: player, board: newBoard }]);
        
        if (soundEnabled) {
          setTimeout(() => {
            try {
              playWinSound();
            } catch (error) {
              console.log('Sound not available');
            }
          }, 300);
        }
      } else if (newBoard.every(cell => cell !== '')) {
        setResult('🤝 Empate!');
        setGameActive(false);
        setGameHistory([...gameHistory, { winner: 'draw', board: newBoard }]);
      } else {
        const nextPlayer = player === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
        
        if (gameMode === 'computer') {

          const nextPlayerType = whoStartsNext === 'computer' 
            ? (nextPlayer === 'X' ? 'computer' : 'player')
            : (nextPlayer === 'X' ? 'player' : 'computer');
          
          if (nextPlayerType === 'computer') {
            setIsComputerTurn(true);
          }
        }
      }
    }
  };

  const checkWinner = (boardToCheck) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (boardToCheck[a] !== '' && 
          boardToCheck[a] === boardToCheck[b] && 
          boardToCheck[a] === boardToCheck[c]) {
        return pattern;
      }
    }
    return null;
  };

  const updateScore = (player) => {
    if (player === 'X') {
      setScoreX(scoreX + 1);
    } else {
      setScoreO(scoreO + 1);
    }
  };

  const restartGame = () => {

    let nextStarter;
    if (gameMode === 'human') {
      nextStarter = whoStartsNext === 'player1' ? 'player2' : 'player1';
    } else {
      nextStarter = whoStartsNext === 'computer' ? 'player' : 'computer';
    }
    
    setWhoStartsNext(nextStarter);
    setCurrentPlayer('X'); 
    setBoard(Array(9).fill(''));
    setGameActive(true);
    setResult('');
    setWinningCells([]);
    setIsComputerTurn(false);
    

    if (gameMode === 'computer' && nextStarter === 'computer') {
      setIsComputerTurn(true);
    }
  };

  const resetScores = () => {
    setScoreX(0);
    setScoreO(0);
    setGameHistory([]);
    setWhoStartsNext('player1'); 
    setCurrentPlayer('X');
    setBoard(Array(9).fill(''));
    setGameActive(true);
    setResult('');
    setWinningCells([]);
    setIsComputerTurn(false);
  };

  const resetGameForModeChange = () => {
    setWhoStartsNext(gameMode === 'human' ? 'player1' : 'player'); 
    setCurrentPlayer('X');
    setBoard(Array(9).fill(''));
    setGameActive(true);
    setResult('');
    setWinningCells([]);
    setIsComputerTurn(false);
  };

  useEffect(() => {
    if (isComputerTurn && gameActive && gameMode === 'computer' && getCurrentPlayerType() === 'computer') {
      const computerMoveIndex = getComputerMove(board);
      if (computerMoveIndex !== -1) {
        setTimeout(() => {
          makeMove(computerMoveIndex, currentPlayer);
          setIsComputerTurn(false);
        }, 500); 
      }
    }
  }, [isComputerTurn, gameActive, currentPlayer, gameMode, board, whoStartsNext]);

  const handleHumanMove = (index) => {

    if (gameMode === 'computer' && getCurrentPlayerType() === 'computer') {
      return; 
    }
    makeMove(index);
  };

  const getCellClass = (index) => {
    let baseClass = 'game-cell';
    
    if (board[index] === 'X') {
      baseClass += ' player-x';
    } else if (board[index] === 'O') {
      baseClass += ' player-o';
    }
    
    if (winningCells.includes(index)) {
      baseClass += ' winning';
    }
    
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 
                    flex items-start sm:items-center justify-center p-1 sm:p-2 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-3/4 w-36 h-36 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto py-1 sm:py-4">
        {/* Header */}
        <div className="text-center mb-4 relative">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/20 
                       backdrop-blur-md border border-white/30 flex items-center justify-center
                       hover:bg-white/30 transition-all duration-300 text-white"
            title={soundEnabled ? 'Desabilitar som' : 'Habilitar som'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 
                         bg-gradient-to-r from-purple-400 to-pink-400 
                         bg-clip-text text-transparent animate-fade-in">
            🎮 Jogo da Velha
          </h1>
          <p className="text-purple-200 text-sm">Versão React Moderna</p>
        </div>

        {/* Game Mode Selection */}
        <div className="mb-4 space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setGameMode('human');
                resetGameForModeChange();
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                gameMode === 'human'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              2 Jogadores
            </button>
            <button
              onClick={() => {
                setGameMode('computer');
                resetGameForModeChange();
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                gameMode === 'computer'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              vs Computador
            </button>
          </div>
          
          {/* Difficulty Selection */}
          {gameMode === 'computer' && (
            <div className="flex space-x-1">
              <button
                onClick={() => setDifficulty('easy')}
                className={`flex-1 py-1 px-2 rounded text-xs transition-all duration-300 ${
                  difficulty === 'easy'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Fácil
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`flex-1 py-1 px-2 rounded text-xs transition-all duration-300 ${
                  difficulty === 'medium'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Médio
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`flex-1 py-1 px-2 rounded text-xs transition-all duration-300 ${
                  difficulty === 'hard'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Difícil
              </button>
            </div>
          )}
        </div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-3 space-x-2">
          <div className="score-display flex-1 text-center">
            <div className="text-sm opacity-80">
              {gameMode === 'computer' 
                ? (getPlayerSymbol('player') === 'X' ? 'Jogador (X)' : 'Jogador (O)')
                : (getPlayerSymbol('player1') === 'X' ? 'Jogador 1 (X)' : 'Jogador 1 (O)')}
            </div>
            <div className="text-2xl font-bold text-blue-300">
              {gameMode === 'computer' 
                ? (getPlayerSymbol('player') === 'X' ? scoreX : scoreO)
                : (getPlayerSymbol('player1') === 'X' ? scoreX : scoreO)}
            </div>
          </div>
          
          <div className="score-display flex-1 text-center">
            <div className="text-sm opacity-80">Empates</div>
            <div className="text-2xl font-bold text-gray-300">
              {gameHistory.filter(game => game.winner === 'draw').length}
            </div>
          </div>
          
          <div className="score-display flex-1 text-center">
            <div className="text-sm opacity-80">
              {gameMode === 'computer' 
                ? (getPlayerSymbol('computer') === 'X' ? 'Computador (X)' : 'Computador (O)')
                : (getPlayerSymbol('player2') === 'X' ? 'Jogador 2 (X)' : 'Jogador 2 (O)')}
            </div>
            <div className="text-2xl font-bold text-red-300">
              {gameMode === 'computer' 
                ? (getPlayerSymbol('computer') === 'X' ? scoreX : scoreO)
                : (getPlayerSymbol('player2') === 'X' ? scoreX : scoreO)}
            </div>
          </div>
        </div>

        {/* Turn Indicator */}
        {gameActive && (
          <div className="text-center mb-3">
            <div className="turn-indicator inline-block">
              {gameMode === 'computer' 
                ? (getCurrentPlayerType() === 'computer' 
                  ? `Vez do Computador (${currentPlayer})` 
                  : `Vez do Jogador (${currentPlayer})`)
                : `Vez do Jogador ${getCurrentPlayerType() === 'player1' ? '1' : '2'} (${currentPlayer})`}
            </div>
          </div>
        )}

        {/* Game Board */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 shadow-2xl border border-white/20">
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => (
              <button
                key={index}
                className={getCellClass(index)}
                onClick={() => handleHumanMove(index)}
                disabled={!gameActive || cell !== '' || (gameMode === 'computer' && getCurrentPlayerType() === 'computer')}
              >
                <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                  {cell || ''}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mb-3">
            <div className="result-message">
              {result}
            </div>
            <div className="text-center mt-2">
              <div className="text-sm text-white/70">
                Próxima partida: {gameMode === 'computer' 
                  ? (whoStartsNext === 'computer' ? 'Jogador' : 'Computador') + ' começará (X)'
                  : `Jogador ${whoStartsNext === 'player1' ? '2' : '1'} começará (X)`}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={restartGame} 
            className="game-button flex-1 flex items-center justify-center space-x-2"
          >
            <span>🔄</span>
            <span>Nova Partida</span>
          </button>
          
          <button 
            onClick={resetScores} 
            className="game-button flex-1 flex items-center justify-center space-x-2
                       bg-gradient-to-r from-red-600 to-pink-600 
                       hover:from-red-700 hover:to-pink-700"
          >
            <span>🗑️</span>
            <span>Zerar Placar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
