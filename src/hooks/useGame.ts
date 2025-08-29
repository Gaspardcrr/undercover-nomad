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
    playerConfigs: Array<{ name: string, profileImage?: string }>, 
    undercoverCount: number, 
    hasMisterWhite: boolean
  ) => {
    try {
      const usedWordPairs = getUsedWordPairs();
      const { players, wordPair } = createPlayersWithRoles(
        playerConfigs, 
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
    } catch (error) {
      // Handle validation error from generatePlayerRoles
      alert((error as Error).message);
    }
  }, []);

  const revealPlayerWord = useCallback((player: Player) => {
    setGameState(prev => {
      // Only allow the current player to interact with their card
      const currentPlayer = prev.players[prev.currentPlayerIndex];
      if (player.id !== currentPlayer.id) {
        return prev; // Ignore clicks on other players' cards
      }

      // Mark current player as having seen their word
      const updatedPlayers = prev.players.map(p => {
        if (p.id === player.id) {
          return { ...p, hasSeenWord: true };
        }
        return p;
      });

      // Handle amnesic mode - return to playing phase after seeing card
      if (prev.phase === 'amnesic-mode') {
        setTimeout(() => {
          setGameState(current => ({
            ...current,
            phase: 'playing'
          }));
        }, 1500);
        
        return {
          ...prev,
          players: updatedPlayers,
        };
      }

      // Normal word distribution logic
      // Find next player who hasn't seen their word
      let nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      while (nextIndex !== prev.currentPlayerIndex && updatedPlayers[nextIndex].hasSeenWord) {
        nextIndex = (nextIndex + 1) % prev.players.length;
      }

      // Check if all players have seen their word
      const allSeen = updatedPlayers.every(p => p.hasSeenWord);
      
      if (allSeen) {
        // Move to starting player selection after all words are seen
        setTimeout(() => {
          setGameState(current => ({
            ...current,
            phase: 'starting-player-selection'
          }));
        }, 1500);
      }
      
      return {
        ...prev,
        players: updatedPlayers,
        currentPlayerIndex: allSeen ? prev.currentPlayerIndex : nextIndex,
        phase: prev.phase, // Keep in word-distribution until auto-transition
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

  const selectStartingPlayer = useCallback((playerIndex: number) => {
    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      startingPlayerIndex: playerIndex,
    }));
  }, []);

  const skipRound = useCallback(() => {
    setGameState(prev => {
      const usedWordPairs = getUsedWordPairs();
      const resetPlayers = resetPlayersForNewRound(prev.players);
      const playerConfigs = resetPlayers.map(p => ({ 
        name: p.name, 
        profileImage: p.profileImage 
      }));
      const { players, wordPair } = createPlayersWithRoles(
        playerConfigs,
        prev.gameSettings.undercoverCount,
        prev.gameSettings.hasMisterWhite,
        usedWordPairs
      );

      // Preserve scores and profile images
      const playersWithScores = players.map(player => {
        const existingPlayer = resetPlayers.find(p => p.name === player.name);
        return existingPlayer ? { 
          ...player, 
          score: existingPlayer.score,
          profileImage: existingPlayer.profileImage 
        } : player;
      });

      return {
        ...prev,
        phase: 'word-distribution',
        players: playersWithScores,
        currentPlayerIndex: 0,
        civilianWord: wordPair.civilian,
        undercoverWord: wordPair.undercover,
        startingPlayerIndex: undefined,
      };
    });
  }, []);

  const startNewRound = useCallback(() => {
    setGameState(prev => {
      const usedWordPairs = getUsedWordPairs();
      const resetPlayers = resetPlayersForNewRound(prev.players);
      const playerConfigs = resetPlayers.map(p => ({ 
        name: p.name, 
        profileImage: p.profileImage 
      }));
      const { players, wordPair } = createPlayersWithRoles(
        playerConfigs,
        prev.gameSettings.undercoverCount,
        prev.gameSettings.hasMisterWhite,
        usedWordPairs
      );

      // Preserve scores and profile images
      const playersWithScores = players.map(player => {
        const existingPlayer = resetPlayers.find(p => p.name === player.name);
        return existingPlayer ? { 
          ...player, 
          score: existingPlayer.score,
          profileImage: existingPlayer.profileImage 
        } : player;
      });

      return {
        ...prev,
        phase: 'word-distribution',
        players: playersWithScores,
        currentPlayerIndex: 0,
        civilianWord: wordPair.civilian,
        undercoverWord: wordPair.undercover,
        roundNumber: prev.roundNumber + 1,
        startingPlayerIndex: undefined,
        winner: undefined,
        winnerPlayers: undefined,
      };
    });
  }, []);

  const enableAmnesicMode = useCallback((playerId: string) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(p => {
        if (p.id === playerId) {
          return { ...p, hasSeenWord: false };
        }
        return p;
      });
      
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      return {
        ...prev,
        players: updatedPlayers,
        currentPlayerIndex: playerIndex,
        phase: 'amnesic-mode',
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
    selectStartingPlayer,
    skipRound,
    startNewRound,
    enableAmnesicMode,
    resetGame,
  };
}