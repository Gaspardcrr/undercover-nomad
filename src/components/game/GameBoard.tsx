import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameCard } from './GameCard';
import { cn } from '@/lib/utils';
import type { Player, GameState } from '@/types/game';
import { Crown, Users, Target, AlertCircle } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  onPlayerCardClick: (player: Player) => void;
  onEliminatePlayer: (player: Player) => void;
  onEndGame: () => void;
  showEliminationMode: boolean;
}

export function GameBoard({ 
  gameState, 
  onPlayerCardClick, 
  onEliminatePlayer,
  onEndGame,
  showEliminationMode 
}: GameBoardProps) {
  const { players, phase, roundNumber } = gameState;
  const alivePlayers = players.filter(p => !p.isEliminated);
  const aliveByRole = {
    civil: alivePlayers.filter(p => p.role === 'civil').length,
    undercover: alivePlayers.filter(p => p.role === 'undercover').length,
    misterWhite: alivePlayers.filter(p => p.role === 'mister-white').length,
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case 'word-distribution':
        return 'Distribution des mots';
      case 'playing':
        return 'Phase de jeu';
      case 'voting':
        return 'Phase d\'élimination';
      default:
        return 'UndercoveR';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'word-distribution':
        const currentPlayer = players[gameState.currentPlayerIndex];
        return currentPlayer ? `${currentPlayer.name}, cliquez sur votre carte pour voir votre mot` : 'Révélation des mots en cours...';
      case 'playing':
        return 'Discussion libre - Trouvez les intrus !';
      case 'voting':
        return 'Cliquez sur le joueur à éliminer';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            {getPhaseTitle()}
          </CardTitle>
          {getPhaseDescription() && (
            <p className="text-muted-foreground">
              {getPhaseDescription()}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Game Stats - Only show round and total players during game */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{roundNumber}</div>
            <div className="text-sm text-muted-foreground">Manche</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{alivePlayers.length}</div>
            <div className="text-sm text-muted-foreground">Joueurs restants</div>
          </CardContent>
        </Card>
      </div>

      {/* Elimination Mode Banner */}
      {showEliminationMode && (
        <Card className="border-destructive shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <div>
                <div className="font-semibold text-destructive">Mode élimination</div>
                <div className="text-sm text-muted-foreground">
                  Cliquez sur le joueur à éliminer suite au vote
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map((player) => (
          <GameCard
            key={player.id}
            player={player}
            onClick={() => onPlayerCardClick(player)}
            showWord={phase === 'word-distribution' && player.hasSeenWord}
            isActive={phase === 'word-distribution' && gameState.currentPlayerIndex === players.indexOf(player) && !player.hasSeenWord}
            canEliminate={showEliminationMode}
            onEliminate={() => onEliminatePlayer(player)}
          />
        ))}
      </div>

      {/* Leaderboard */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent" />
            Classement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold",
                      index === 0 && "bg-accent text-accent-foreground",
                      index === 1 && "bg-muted",
                      index === 2 && "bg-muted/60",
                      index > 2 && "bg-muted/30"
                    )}>
                      {index + 1}
                    </div>
                    <div className={cn(
                      "font-medium",
                      player.isEliminated && "text-muted-foreground"
                    )}>
                      {player.name}
                      {player.isEliminated && " (éliminé)"}
                    </div>
                  </div>
                  <div className="font-bold">{player.score} pts</div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      <div className="flex gap-4 justify-center">
        <Button
          variant="danger"
          onClick={onEndGame}
        >
          Terminer la partie
        </Button>
      </div>
    </div>
  );
}