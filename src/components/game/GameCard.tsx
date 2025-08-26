import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Player } from '@/types/game';

interface GameCardProps {
  player: Player;
  onClick?: () => void;
  showWord?: boolean;
  isActive?: boolean;
  canEliminate?: boolean;
  onEliminate?: () => void;
}

export function GameCard({ 
  player, 
  onClick, 
  showWord = false, 
  isActive = false,
  canEliminate = false,
  onEliminate 
}: GameCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const getCardFrontContent = () => {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">🎴</div>
        <div className="text-lg font-semibold">
          {player.name}
        </div>
        <div className="text-sm text-accent animate-pulse">
          👆 Cliquez pour révéler votre carte secrète
        </div>
      </div>
    );
  };

  const getCardBackContent = () => {
    if (player.role === 'mister-white') {
      return (
        <div className="text-center space-y-4">
          <div className="text-6xl">❓</div>
          <div className="text-xl font-bold text-mister-white">
            ???
          </div>
          <div className="text-sm text-muted-foreground">
            Vous êtes Mister White !<br/>
            Écoutez et devinez le mot
          </div>
          <div className="text-xs text-accent mt-4">
            👆 Cliquez pour confirmer et passer au suivant
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-primary mb-4">
          {player.word}
        </div>
        <div className="text-sm text-muted-foreground">
          Votre mot secret
        </div>
        <div className="text-xs text-accent mt-4">
          👆 Cliquez pour confirmer et passer au suivant
        </div>
      </div>
    );
  };

  const getGameModeContent = () => {
    return (
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">
          {player.name}
        </div>
        <div className="text-sm text-muted-foreground">
          Score: {player.score}
        </div>
      </div>
    );
  };

  const handleCardClick = () => {
    if (isActive && !player.hasSeenWord) {
      // First click: flip to reveal
      setIsFlipped(true);
    } else if (isActive && showWord && !isFlipped) {
      // Card is already revealed, this is the "confirm" click
      onClick?.();
      setIsFlipped(false);
    } else if (isActive && isFlipped) {
      // Second click: confirm and move to next player
      onClick?.();
      setIsFlipped(false);
    } else {
      // Regular game mode click
      onClick?.();
    }
  };

  // Reset flip state when player changes
  React.useEffect(() => {
    if (!isActive) {
      setIsFlipped(false);
    }
  }, [isActive]);

  const getDisplayContent = () => {
    // During word distribution phase
    if (isActive) {
      if (isFlipped || showWord) {
        return getCardBackContent();
      } else {
        return getCardFrontContent();
      }
    }
    
    // During game mode
    return getGameModeContent();
  };

  return (
    <div className="relative">
      <Card 
        className={cn(
          `player-card-${player.colorIndex}`,
          "border-2 shadow-card transition-all duration-500 cursor-pointer min-h-[180px] flex items-center justify-center",
          isActive && "card-pulse border-accent shadow-glow hover:scale-105",
          (isFlipped || showWord) && isActive && "bg-gradient-card border-primary shadow-glow",
          player.isEliminated && "player-eliminated",
          !isActive && "hover:shadow-md hover:scale-102",
          isActive && "transform-gpu" // GPU acceleration for flip animation
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-6 w-full">
          {getDisplayContent()}
        </CardContent>

        {/* Elimination Button */}
        {canEliminate && !player.isEliminated && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEliminate?.();
            }}
          >
            ✕
          </Button>
        )}

        {/* Player Avatar/Icon */}
        <div className={cn(
          "absolute -top-3 -left-3 w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold",
          `border-player-${player.colorIndex} bg-card`
        )}>
          {player.avatar ? (
            <img 
              src={player.avatar} 
              alt={player.name}
              className="w-full h-full rounded-full object-cover" 
            />
          ) : (
            <span className={`text-player-${player.colorIndex}`}>
              {player.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Eliminated overlay */}
        {player.isEliminated && (
          <div className="absolute inset-0 bg-background/80 rounded-card flex items-center justify-center">
            <span className="text-2xl font-bold text-destructive">
              ÉLIMINÉ
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}