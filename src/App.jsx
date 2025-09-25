import React, { useState } from 'react';
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
  const { playMoveSound, playWinSound } = useSoundEffects();

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const makeMove = (index) => {
    if (gameActive && board[index] === '') {
      // Play move sound
      if (soundEnabled) {
        try {
          playMoveSound();
        } catch (error) {
          console.log('Sound not available');
        }
      }

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const winningPattern = checkWinner(newBoard);
      if (winningPattern) {
        setResult(`🎉 Jogador ${currentPlayer} venceu!`);
        setWinningCells(winningPattern);
        updateScore(currentPlayer);
        setGameActive(false);
        setGameHistory([...gameHistory, { winner: currentPlayer, board: newBoard }]);
        
        // Play win sound with delay
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
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
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
    setCurrentPlayer('X');
    setBoard(Array(9).fill(''));
    setGameActive(true);
    setResult('');
    setWinningCells([]);
  };

  const resetScores = () => {
    setScoreX(0);
    setScoreO(0);
    setGameHistory([]);
    restartGame();
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
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 
                    flex items-center justify-center p-2 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-3/4 w-36 h-36 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto">
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

        {/* Score Display */}
        <div className="flex justify-between items-center mb-3 space-x-2">
          <div className="score-display flex-1 text-center">
            <div className="text-sm opacity-80">Jogador X</div>
            <div className="text-2xl font-bold text-blue-300">{scoreX}</div>
          </div>
          
          <div className="score-display flex-1 text-center">
            <div className="text-sm opacity-80">Empates</div>
            <div className="text-2xl font-bold text-gray-300">
              {gameHistory.filter(game => game.winner === 'draw').length}
            </div>
          </div>
          
          <div className="score-display flex-1 text-center">
            <div className="text-sm opacity-80">Jogador O</div>
            <div className="text-2xl font-bold text-red-300">{scoreO}</div>
          </div>
        </div>

        {/* Turn Indicator */}
        {gameActive && (
          <div className="text-center mb-3">
            <div className="turn-indicator inline-block">
              Vez do Jogador {currentPlayer}
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
                onClick={() => makeMove(index)}
                disabled={!gameActive || cell !== ''}
              >
                {cell}
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
