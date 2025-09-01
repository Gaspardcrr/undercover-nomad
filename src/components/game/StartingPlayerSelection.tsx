import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shuffle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Player } from '@/types/game';

interface StartingPlayerSelectionProps {
  players: Player[];
  onPlayerSelected: (playerIndex: number) => void;
}

export function StartingPlayerSelection({ 
  players, 
  onPlayerSelected 
}: StartingPlayerSelectionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  // Get eligible players for selection (exclude Mister White)
  const eligiblePlayers = players
    .map((player, index) => ({ player, originalIndex: index }))
    .filter(({ player }) => player.role !== 'mister-white');

  const startSelection = () => {
    setIsAnimating(true);
    setSelectedPlayer(null);
    
    let cycles = 0;
    const maxCycles = 15 + Math.floor(Math.random() * 10); // 15-25 cycles
    
    const interval = setInterval(() => {
      cycles++;
      setCurrentHighlight((prev) => (prev + 1) % players.length); // Highlight all players
      
      if (cycles >= maxCycles) {
        clearInterval(interval);
        setIsAnimating(false);
        
        // Select final player (only from eligible ones)
        const finalIndex = Math.floor(Math.random() * eligiblePlayers.length);
        const selectedPlayerOriginalIndex = eligiblePlayers[finalIndex].originalIndex;
        setSelectedPlayer(selectedPlayerOriginalIndex);
        
        // Auto-proceed after showing selection
        setTimeout(() => {
          onPlayerSelected(selectedPlayerOriginalIndex);
        }, 2000);
      }
    }, 100 + (cycles * 5)); // Gradually slow down
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card bg-gradient-card">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Qui commence ?
              </h2>
              <p className="text-muted-foreground">
                Tirage au sort du premier joueur
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all duration-200",
                    `player-card-${player.colorIndex}`,
                    isAnimating && currentHighlight === index && "ring-4 ring-primary scale-105",
                    selectedPlayer === index && "ring-4 ring-accent scale-110 shadow-victory"
                  )}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="w-12 h-12">
                      {player.profileImage ? (
                        <AvatarImage src={player.profileImage} alt={player.name} />
                      ) : null}
                      <AvatarFallback 
                        className={cn(
                          "font-bold text-lg",
                          `bg-player-${player.colorIndex}/20 text-player-${player.colorIndex}`
                        )}
                      >
                        {player.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-semibold text-center">
                      {player.name}
                    </div>
                  </div>
                  
                  {selectedPlayer === index && (
                    <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      👉
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedPlayer !== null && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-xl font-bold text-accent">
                  🎯 C'est à {players[selectedPlayer].name} de commencer !
                </div>
                <div className="text-sm text-muted-foreground">
                  Transition automatique vers le jeu...
                </div>
              </div>
            )}

            {!isAnimating && selectedPlayer === null && (
              <Button
                variant="game"
                size="xl"
                onClick={startSelection}
                className="btn-glow"
              >
                <Shuffle className="w-5 h-5 mr-2" />
                Tirer au sort
              </Button>
            )}

            {isAnimating && (
              <div className="text-primary font-semibold animate-pulse">
                Sélection en cours...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}