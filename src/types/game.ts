// UndercoveR Game Types

export type Role = 'civil' | 'undercover' | 'mister-white';

export interface Player {
  id: string;
  name: string;
  role: Role;
  word?: string;
  avatar?: string;
  profileImage?: string; // Base64 encoded image
  score: number;
  isEliminated: boolean;
  hasSeenWord: boolean;
  colorIndex: number;
}

export interface GameState {
  phase: 'setup' | 'word-distribution' | 'playing' | 'voting' | 'game-over' | 'starting-player-selection' | 'amnesic-mode';
  players: Player[];
  currentPlayerIndex: number;
  startingPlayerIndex?: number;
  civilianWord: string;
  undercoverWord: string;
  roundNumber: number;
  winner?: 'civil' | 'undercover' | 'mister-white';
  winnerPlayers?: Player[];
  gameSettings: GameSettings;
}

export interface GameSettings {
  minPlayers: number;
  maxPlayers: number;
  undercoverCount: number;
  hasMisterWhite: boolean;
}

export interface WordPair {
  civilian: string;
  undercover: string;
}

export interface GameStats {
  totalGames: number;
  civilWins: number;
  undercoverWins: number;
  misterWhiteWins: number;
  usedWordPairs: WordPair[];
}

// Score constants
export const SCORES = {
  CIVIL_WIN: 5,
  UNDERCOVER_WIN: 10,
  MISTER_WHITE_WIN: 12,
  MISTER_WHITE_GUESS: 6,
} as const;