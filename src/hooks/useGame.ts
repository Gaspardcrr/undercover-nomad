import { useState, useCallback } from 'react';
import type { GameState, Player, WordPair } from '@/types/game';
import { 
  createPlayersWithRoles, 
  checkWinCondition, 
  updateScores, 
  handleMisterWhiteGuess,
  resetPlayersForNewRound 
} from '@/utils/gameLogic';
import { getUsedWordPairs, updateGameStats } from '@/utils/storage';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    players: [],
    currentPlayerIndex: 0,
    civilianWord: '',
    undercoverWord: '',
    roundNumber: 1,
    gameSettings: {
      minPlayers: 3,
      maxPlayers: 12,
      undercoverCount: 1,
      hasMisterWhite: true,
    },
  });

  const startGame = useCallback((
    playerNames: string[], 
    undercoverCount: number, 
    hasMisterWhite: boolean
  ) => {
    const usedWordPairs = getUsedWordPairs();
    const { players, wordPair } = createPlayersWithRoles(
      playerNames, 
      undercoverCount, 
      hasMisterWhite, 
      usedWordPairs
    );

    setGameState({
      phase: 'word-distribution',
      players,
      currentPlayerIndex: 0,
      civilianWord: wordPair.civilian,
      undercoverWord: wordPair.undercover,
      roundNumber: 1,
      gameSettings: {
        minPlayers: 3,
        maxPlayers: 12,
        undercoverCount,
        hasMisterWhite,
      },
    });
  }, []);

  const revealPlayerWord = useCallback((player: Player) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(p => 
        p.id === player.id ? { ...p, hasSeenWord: true } : p
      );

      // Check if all players have seen their word
      const allSeen = updatedPlayers.every(p => p.hasSeenWord || p.isEliminated);
      
      return {
        ...prev,
        players: updatedPlayers,
        phase: allSeen ? 'playing' : 'word-distribution',
      };
    });
  }, []);

  const eliminatePlayer = useCallback((player: Player) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(p =>
        p.id === player.id ? { ...p, isEliminated: true } : p
      );

      // Check if eliminated player is Mister White
      if (player.role === 'mister-white') {
        return {
          ...prev,
          players: updatedPlayers,
          phase: 'voting', // Special phase for Mister White guess
        };
      }

      // Check win condition
      const { winner, winnerPlayers } = checkWinCondition(updatedPlayers);
      
      if (winner) {
        const finalPlayers = updateScores(updatedPlayers, winner);
        // Update game stats
        updateGameStats(winner, { civilian: prev.civilianWord, undercover: prev.undercoverWord });
        
        return {
          ...prev,
          players: finalPlayers,
          phase: 'game-over',
          winner,
          winnerPlayers,
        };
      }

      return {
        ...prev,
        players: updatedPlayers,
        phase: 'playing',
      };
    });
  }, []);

  const handleMisterWhiteGuessAttempt = useCallback((guess: string) => {
    setGameState(prev => {
      const isCorrect = handleMisterWhiteGuess(guess, prev.civilianWord);
      
      if (isCorrect) {
        // Mister White wins
        const misterWhitePlayer = prev.players.find(p => p.role === 'mister-white')!;
        const finalPlayers = updateScores(prev.players, 'mister-white', true);
        
        // Update game stats
        updateGameStats('mister-white', { civilian: prev.civilianWord, undercover: prev.undercoverWord });
        
        return {
          ...prev,
          players: finalPlayers,
          phase: 'game-over',
          winner: 'mister-white',
          winnerPlayers: [misterWhitePlayer],
        };
      } else {
        // Continue game without Mister White
        const { winner, winnerPlayers } = checkWinCondition(prev.players);
        
        if (winner) {
          const finalPlayers = updateScores(prev.players, winner);
          // Update game stats
          updateGameStats(winner, { civilian: prev.civilianWord, undercover: prev.undercoverWord });
          
          return {
            ...prev,
            players: finalPlayers,
            phase: 'game-over',
            winner,
            winnerPlayers,
          };
        }

        return {
          ...prev,
          phase: 'playing',
        };
      }
    });
  }, []);

  const startNewRound = useCallback(() => {
    setGameState(prev => {
      const usedWordPairs = getUsedWordPairs();
      const resetPlayers = resetPlayersForNewRound(prev.players);
      const { players, wordPair } = createPlayersWithRoles(
        resetPlayers.map(p => p.name),
        prev.gameSettings.undercoverCount,
        prev.gameSettings.hasMisterWhite,
        usedWordPairs
      );

      // Preserve scores
      const playersWithScores = players.map(player => {
        const existingPlayer = resetPlayers.find(p => p.name === player.name);
        return existingPlayer ? { ...player, score: existingPlayer.score } : player;
      });

      return {
        ...prev,
        phase: 'word-distribution',
        players: playersWithScores,
        currentPlayerIndex: 0,
        civilianWord: wordPair.civilian,
        undercoverWord: wordPair.undercover,
        roundNumber: prev.roundNumber + 1,
        winner: undefined,
        winnerPlayers: undefined,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      phase: 'setup',
      players: [],
      currentPlayerIndex: 0,
      civilianWord: '',
      undercoverWord: '',
      roundNumber: 1,
      gameSettings: {
        minPlayers: 3,
        maxPlayers: 12,
        undercoverCount: 1,
        hasMisterWhite: true,
      },
    });
  }, []);

  return {
    gameState,
    startGame,
    revealPlayerWord,
    eliminatePlayer,
    handleMisterWhiteGuessAttempt,
    startNewRound,
    resetGame,
  };
}