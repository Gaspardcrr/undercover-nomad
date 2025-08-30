// UndercoveR Game Logic Utilities

import type { Player, Role, GameState, WordPair } from '@/types/game';
import { getRandomWordPair } from '@/data/wordPairs';
import { SCORES } from '@/types/game';
import type { PlayerConfig } from '@/types/playerConfig';

// Shuffle array utility
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Auto-adjust game configuration to respect rules
export function autoAdjustGameConfig(
  playerCount: number,
  requestedUndercoverCount: number,
  hasMisterWhite: boolean
): { undercoverCount: number, hasMisterWhite: boolean } {
  if (playerCount < 3) {
    return { undercoverCount: 1, hasMisterWhite: false };
  }

  let finalUndercoverCount = requestedUndercoverCount;
  let finalHasMisterWhite = hasMisterWhite;

  const nbMisterWhite = finalHasMisterWhite ? 1 : 0;
  
  // Règle 1 : Il faut toujours plus de Civils que d'Undercover
  // nb_civils >= nb_undercover + 1
  
  // Règle 2 : Undercover + Mister White ne doivent pas dépasser la moitié des joueurs  
  // nb_undercover + nb_mister_white <= total_joueurs / 2
  
  const maxUndercoverAndMisterWhite = Math.floor(playerCount / 2);
  const maxUndercoverCount = Math.max(1, maxUndercoverAndMisterWhite - nbMisterWhite);
  
  // Appliquer la limite
  if (finalUndercoverCount > maxUndercoverCount) {
    finalUndercoverCount = maxUndercoverCount;
  }
  
  // Vérifier que la règle 1 est respectée
  const nbCivils = playerCount - (finalUndercoverCount + nbMisterWhite);
  if (nbCivils < finalUndercoverCount + 1) {
    // Réduire le nombre d'undercover pour respecter la règle
    finalUndercoverCount = Math.max(1, Math.floor((playerCount - nbMisterWhite - 1) / 2));
  }

  return { 
    undercoverCount: Math.max(1, finalUndercoverCount), 
    hasMisterWhite: finalHasMisterWhite 
  };
}

// Generate player roles based on game settings
export function generatePlayerRoles(
  playerCount: number,
  undercoverCount: number,
  hasMisterWhite: boolean
): Role[] {
  const roles: Role[] = [];
  
  // Add undercover players
  for (let i = 0; i < undercoverCount; i++) {
    roles.push('undercover');
  }
  
  // Add Mister White if enabled
  if (hasMisterWhite) {
    roles.push('mister-white');
  }
  
  // Fill remaining slots with civilians
  const remainingSlots = playerCount - roles.length;
  
  for (let i = 0; i < remainingSlots; i++) {
    roles.push('civil');
  }
  
  return shuffleArray(roles);
}

// Create players with assigned roles and words
export function createPlayersWithRoles(
  playerConfigs: Array<{ name: string, profileImage?: string }>,
  undercoverCount: number,
  hasMisterWhite: boolean,
  usedWordPairs: WordPair[] = []
): { players: Player[], wordPair: WordPair } {
  const wordPair = getRandomWordPair(usedWordPairs);
  const roles = generatePlayerRoles(playerConfigs.length, undercoverCount, hasMisterWhite);
  
  const players: Player[] = playerConfigs.map((config, index) => ({
    id: `player-${index}`,
    name: config.name.slice(0, 16), // Limit to 16 characters
    profileImage: config.profileImage,
    role: roles[index],
    word: roles[index] === 'civil' ? wordPair.civilian : 
          roles[index] === 'undercover' ? wordPair.undercover : undefined,
    score: 0,
    isEliminated: false,
    hasSeenWord: false,
    colorIndex: (index % 8) + 1, // Cycle through 8 player colors
  }));

  return { players, wordPair };
}

// Check win conditions
export function checkWinCondition(players: Player[]): {
  winner?: 'civil' | 'undercover' | 'mister-white';
  winnerPlayers: Player[];
} {
  const alivePlayers = players.filter(p => !p.isEliminated);
  const aliveCivils = alivePlayers.filter(p => p.role === 'civil');
  const aliveUndercovers = alivePlayers.filter(p => p.role === 'undercover');
  const aliveMisterWhite = alivePlayers.filter(p => p.role === 'mister-white');

  // Mister White wins if he guesses correctly (handled separately)
  // Civil wins: no more undercover or mister white alive
  if (aliveUndercovers.length === 0 && aliveMisterWhite.length === 0) {
    return {
      winner: 'civil',
      winnerPlayers: players.filter(p => p.role === 'civil' && !p.isEliminated)
    };
  }

  // Undercover wins: equal or more undercover + mister white than civilians
  const suspiciousCount = aliveUndercovers.length + aliveMisterWhite.length;
  if (suspiciousCount >= aliveCivils.length && suspiciousCount > 0) {
    return {
      winner: 'undercover',
      winnerPlayers: players.filter(p => 
        (p.role === 'undercover' || p.role === 'mister-white') && !p.isEliminated
      )
    };
  }

  return { winnerPlayers: [] };
}

// Handle Mister White guess
export function handleMisterWhiteGuess(
  guess: string,
  civilianWord: string
): boolean {
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedWord = civilianWord.toLowerCase().trim();
  
  // Simple match check - could be enhanced with fuzzy matching
  return normalizedGuess === normalizedWord;
}

// Calculate and update scores after a round
export function updateScores(
  players: Player[],
  winner: 'civil' | 'undercover' | 'mister-white',
  misterWhiteGuessWin = false
): Player[] {
  return players.map(player => {
    let pointsToAdd = 0;

    if (winner === 'civil' && player.role === 'civil') {
      pointsToAdd = SCORES.CIVIL_WIN;
    } else if (winner === 'undercover' && (player.role === 'undercover' || player.role === 'mister-white')) {
      pointsToAdd = SCORES.UNDERCOVER_WIN;
    } else if (winner === 'mister-white' && player.role === 'mister-white') {
      // Mister White gets points even if eliminated when guessing correctly
      pointsToAdd = misterWhiteGuessWin ? SCORES.MISTER_WHITE_GUESS : SCORES.MISTER_WHITE_WIN;
    }

    // Skip points for other eliminated players (but not Mister White when they win by guessing)
    if (player.isEliminated && !(winner === 'mister-white' && player.role === 'mister-white' && misterWhiteGuessWin)) {
      return player;
    }

    return {
      ...player,
      score: player.score + pointsToAdd
    };
  });
}

// Get next active player for word distribution
export function getNextActivePlayer(players: Player[], currentIndex: number): number {
  const activePlayers = players.filter(p => !p.isEliminated);
  if (activePlayers.length === 0) return -1;
  
  let nextIndex = (currentIndex + 1) % players.length;
  while (players[nextIndex].isEliminated && nextIndex !== currentIndex) {
    nextIndex = (nextIndex + 1) % players.length;
  }
  
  return nextIndex;
}

// Reset players for new round
export function resetPlayersForNewRound(players: Player[]): Player[] {
  return players.map(player => ({
    ...player,
    isEliminated: false,
    hasSeenWord: false,
    word: undefined,
    role: 'civil' as Role,
  }));
}

// Get leaderboard sorted by score
export function getLeaderboard(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score);
}