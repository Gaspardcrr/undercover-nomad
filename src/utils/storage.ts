// Local Storage Utilities for UndercoveR Game

import type { GameStats, WordPair } from '@/types/game';

const STORAGE_KEYS = {
  GAME_STATS: 'undercover-game-stats',
  USED_WORD_PAIRS: 'undercover-used-pairs',
} as const;

// Default game stats
const defaultStats: GameStats = {
  totalGames: 0,
  civilWins: 0,
  undercoverWins: 0,
  misterWhiteWins: 0,
  usedWordPairs: [],
};

// Save data to localStorage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

// Load data from localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

// Game Stats Management
export function getGameStats(): GameStats {
  return loadFromStorage(STORAGE_KEYS.GAME_STATS, defaultStats);
}

export function saveGameStats(stats: GameStats): void {
  saveToStorage(STORAGE_KEYS.GAME_STATS, stats);
}

export function updateGameStats(
  winner: 'civil' | 'undercover' | 'mister-white',
  wordPair: WordPair
): GameStats {
  const stats = getGameStats();
  
  const updatedStats: GameStats = {
    ...stats,
    totalGames: stats.totalGames + 1,
    civilWins: winner === 'civil' ? stats.civilWins + 1 : stats.civilWins,
    undercoverWins: winner === 'undercover' ? stats.undercoverWins + 1 : stats.undercoverWins,
    misterWhiteWins: winner === 'mister-white' ? stats.misterWhiteWins + 1 : stats.misterWhiteWins,
    usedWordPairs: [...stats.usedWordPairs, wordPair],
  };

  // Keep only the last 100 used word pairs to manage storage size
  if (updatedStats.usedWordPairs.length > 100) {
    updatedStats.usedWordPairs = updatedStats.usedWordPairs.slice(-100);
  }

  saveGameStats(updatedStats);
  return updatedStats;
}

// Used Word Pairs Management
export function getUsedWordPairs(): WordPair[] {
  const stats = getGameStats();
  return stats.usedWordPairs;
}

export function clearGameStats(): void {
  saveGameStats(defaultStats);
}

// Check if localStorage is available
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
