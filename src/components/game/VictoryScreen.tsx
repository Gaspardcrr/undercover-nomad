import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Player, GameState } from '@/types/game';
import { Trophy, Crown, RotateCcw, Home, Sparkles } from 'lucide-react';

interface VictoryScreenProps {
  gameState: GameState;
  onNewRound: () => void;
  onBackToMenu: () => void;
}

export function VictoryScreen({ gameState, onNewRound, onBackToMenu }: VictoryScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const { winner, winnerPlayers = [], players, civilianWord, undercoverWord } = gameState;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getWinnerInfo = () => {
    switch (winner) {
      case 'civil':
        return {
          title: '🛡️ Victoire des Civils !',
          description: 'Les espions ont été démasqués !',
          color: 'text-civil',
          bgColor: 'bg-civil/10',
        };
      case 'undercover':
        return {
          title: '🥷 Victoire des Undercovers !',
          description: 'Les espions ont infiltré la ville !',
          color: 'text-undercover',
          bgColor: 'bg-undercover/10',
        };
      case 'mister-white':
        return {
          title: '🎭 Victoire de Mister White !',
          description: 'Un coup de maître extraordinaire !',
          color: 'text-mister-white',
          bgColor: 'bg-mister-white/10',
        };
      default:
        return {
          title: 'Fin de partie',
          description: '',
          color: 'text-foreground',
          bgColor: 'bg-muted/10',
        };
    }
  };

  const winnerInfo = getWinnerInfo();
  const leaderboard = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 confetti",
                i % 4 === 0 && "bg-accent",
                i % 4 === 1 && "bg-primary",
                i % 4 === 2 && "bg-undercover",
                i % 4 === 3 && "bg-civil"
              )}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Victory Banner */}
      <Card className={cn("shadow-victory border-2", winnerInfo.bgColor)}>
        <CardHeader className="text-center">
          <CardTitle className={cn("text-3xl font-bold animate-victory-bounce", winnerInfo.color)}>
            {winnerInfo.title}
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            {winnerInfo.description}
          </p>
        </CardHeader>
        <CardContent>
          {winnerPlayers.length > 0 && (
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Gagnants :</div>
              <div className="flex flex-wrap justify-center gap-2">
                {winnerPlayers.map((player) => (
                  <div
                    key={player.id}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-semibold",
                      `player-card-${player.colorIndex}`,
                      "border"
                    )}
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Words Reveal */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-card border-civil">
          <CardHeader>
            <CardTitle className="text-civil flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Mot des Civils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {civilianWord}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-undercover">
          <CardHeader>
            <CardTitle className="text-undercover flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Mot des Undercovers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {undercoverWord}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Roles Reveal */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Révélation des rôles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "p-3 rounded-lg border-2 flex items-center justify-between",
                  `player-card-${player.colorIndex}`,
                  player.isEliminated && "opacity-60"
                )}
              >
                <div>
                  <div className="font-semibold">{player.name}</div>
                  <div className="text-sm">
                    {player.role === 'civil' && '🛡️ Civil'}
                    {player.role === 'undercover' && '🥷 Undercover'}
                    {player.role === 'mister-white' && '🎭 Mister White'}
                    {player.isEliminated && ' (éliminé)'}
                  </div>
                </div>
                <div className="text-lg font-bold">
                  {player.score} pts
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final Leaderboard */}
      <Card className="shadow-card bg-gradient-victory">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-foreground">
            <Crown className="w-5 h-5" />
            Classement final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div
                key={player.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  index === 0 && "bg-accent/20 border border-accent",
                  index > 0 && "bg-background/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                    index === 0 && "bg-accent text-accent-foreground",
                    index === 1 && "bg-muted text-muted-foreground",
                    index === 2 && "bg-muted/60 text-muted-foreground",
                    index > 2 && "bg-muted/30 text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-accent-foreground">
                      {player.name}
                      {index === 0 && ' 👑'}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-accent-foreground">
                  {player.score} pts
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="game"
          size="xl"
          onClick={onNewRound}
          className="flex-1 sm:flex-none"
        >
          <RotateCcw className="w-5 h-5" />
          Nouvelle manche
        </Button>
        <Button
          variant="outline"
          size="xl"
          onClick={onBackToMenu}
          className="flex-1 sm:flex-none"
        >
          <Home className="w-5 h-5" />
          Menu principal
        </Button>
      </div>
    </div>
  );
}