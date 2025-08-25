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
        const allPlayersHaveSeen = players.every(p => p.hasSeenWord);
        
        if (allPlayersHaveSeen) {
          return 'Tous les joueurs ont découvert leur rôle. La partie peut commencer !';
        }
        
        if (currentPlayer && !currentPlayer.hasSeenWord) {
          return `${currentPlayer.name}, regardez votre carte secrètement`;
        }
        
        // If current player has seen their card, show pass phone message
        if (currentPlayer && currentPlayer.hasSeenWord) {
          const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % players.length;
          const nextPlayer = players[nextPlayerIndex];
          if (nextPlayer && !nextPlayer.hasSeenWord) {
            return `📱 Passez le téléphone à ${nextPlayer.name}`;
          }
        }
        
        return 'Révélation des cartes en cours...';
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

      {/* Card Revelation Section */}
      {phase === 'word-distribution' && (
        <Card className="shadow-card bg-gradient-card border-primary/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {/* Current Player's Turn */}
              {!players.every(p => p.hasSeenWord) && (
                <div>
                  <div className="text-lg font-semibold mb-4">
                    🎴 Révélation des cartes secrètes
                  </div>
                  
                  {/* Show only the current player's card or message */}
                  {(() => {
                    const currentPlayer = players[gameState.currentPlayerIndex];
                    const allPlayersHaveSeen = players.every(p => p.hasSeenWord);
                    
                    if (allPlayersHaveSeen) {
                      return (
                        <div className="text-xl font-bold text-primary animate-fade-in">
                          ✅ Tous les joueurs ont découvert leur rôle !
                        </div>
                      );
                    }
                    
                    if (currentPlayer && currentPlayer.hasSeenWord) {
                      // Show pass phone message
                      const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % players.length;
                      const nextPlayer = players[nextPlayerIndex];
                      if (nextPlayer && !nextPlayer.hasSeenWord) {
                        return (
                          <div className="space-y-4">
                            <div className="text-lg text-muted-foreground">
                              Carte vue ✓
                            </div>
                            <div className="text-xl font-bold text-accent animate-pulse">
                              📱 Passez le téléphone à {nextPlayer.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {nextPlayer.name} doit cliquer sur sa carte pour la révéler
                            </div>
                          </div>
                        );
                      }
                    }
                    
                    // Show current player's card to reveal
                    if (currentPlayer && !currentPlayer.hasSeenWord) {
                      return (
                        <div className="space-y-4">
                          <div className="text-lg font-semibold">
                            👆 {currentPlayer.name}, cliquez sur votre carte ci-dessous
                          </div>
                          <GameCard
                            key={currentPlayer.id}
                            player={currentPlayer}
                            onClick={() => onPlayerCardClick(currentPlayer)}
                            showWord={currentPlayer.hasSeenWord}
                            isActive={true}
                            canEliminate={false}
                          />
                          <div className="text-sm text-muted-foreground">
                            Regardez votre carte secrètement, puis cliquez à nouveau pour la retourner
                          </div>
                        </div>
                      );
                    }
                    
                    return null;
                  })()}
                </div>
              )}
              
              {/* Progress indicator */}
              <div className="flex justify-center space-x-2 mt-6">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      player.hasSeenWord 
                        ? "bg-primary shadow-glow" 
                        : index === gameState.currentPlayerIndex 
                          ? "bg-accent animate-pulse" 
                          : "bg-muted"
                    )}
                    title={`${player.name}${player.hasSeenWord ? ' ✓' : index === gameState.currentPlayerIndex ? ' (en cours)' : ''}`}
                  />
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {players.filter(p => p.hasSeenWord).length} / {players.length} cartes révélées
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Grid - Only show during playing phase */}
      {phase !== 'word-distribution' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map((player) => (
            <GameCard
              key={player.id}
              player={player}
              onClick={() => onPlayerCardClick(player)}
              showWord={false}
              isActive={false}
              canEliminate={showEliminationMode}
              onEliminate={() => onEliminatePlayer(player)}
            />
          ))}
        </div>
      )}

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