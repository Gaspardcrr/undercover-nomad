import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { X, Brain } from 'lucide-react';
import type { Player } from '@/types/game';

interface GameCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  onClick?: () => void;
  onEliminate?: () => void;
  onAmnesicMode?: () => void;
  showEliminateButton: boolean;
  gamePhase: 'setup' | 'word-distribution' | 'playing' | 'voting' | 'game-over' | 'starting-player-selection' | 'amnesic-mode';
}

export function GameCard({ 
  player, 
  isCurrentPlayer, 
  onClick, 
  onEliminate, 
  onAmnesicMode,
  showEliminateButton, 
  gamePhase 
}: GameCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const getCardContent = () => {
    if (gamePhase === 'word-distribution' || gamePhase === 'amnesic-mode') {
      if (player.hasSeenWord || isFlipped) {
        return player.role === 'mister-white' ? (
          <div className="text-center space-y-4">
            <div className="text-6xl">❓</div>
            <div className="text-xl font-bold text-mister-white">???</div>
            <div className="text-sm text-muted-foreground">
              Vous êtes Mister White !<br/>Écoutez et devinez le mot
            </div>
            {gamePhase === 'amnesic-mode' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="mt-4"
              >
                Retour à la partie
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">{player.word}</div>
            <div className="text-sm text-muted-foreground">Votre mot secret</div>
            {gamePhase === 'amnesic-mode' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="mt-4"
              >
                Retour à la partie
              </Button>
            )}
          </div>
        );
      }
      return (
        <div className="text-center space-y-4">
          <div className="text-4xl">🎴</div>
          <div className="text-lg font-semibold">{player.name}</div>
          <div className="text-sm text-accent">
            👆 Cliquez pour révéler votre carte
          </div>
        </div>
      );
    }

    return (
      <div className="text-center space-y-4">
        <Avatar className="w-16 h-16 mx-auto">
          {player.profileImage ? (
            <AvatarImage src={player.profileImage} alt={player.name} />
          ) : null}
          <AvatarFallback className="text-lg font-bold bg-muted">
            {player.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-lg font-semibold">{player.name}</div>
          <div className="text-sm text-muted-foreground">Score: {player.score}</div>
        </div>
      </div>
    );
  };

  const handleCardClick = () => {
    if ((gamePhase === 'word-distribution' || gamePhase === 'amnesic-mode') && isCurrentPlayer && !player.hasSeenWord) {
      if (!isFlipped) {
        setIsFlipped(true);
      } else {
        onClick?.();
        setIsFlipped(false);
      }
    } else {
      onClick?.();
    }
  };

  return (
    <div className="relative">
      <Card 
        className={cn(
          `player-card-${player.colorIndex}`,
          "border-2 shadow-card transition-all duration-300 cursor-pointer min-h-[200px] flex items-center justify-center",
          isCurrentPlayer && (gamePhase === 'word-distribution' || gamePhase === 'amnesic-mode') && "ring-2 ring-primary ring-offset-2",
          player.isEliminated && "opacity-50 grayscale"
        )}
        onClick={handleCardClick}
      >
        <div className="p-6 w-full">
          {getCardContent()}
        </div>

        {/* Action buttons */}
        {!player.isEliminated && gamePhase === 'playing' && (
          <div className="absolute top-2 right-2 flex gap-1">
            {player.hasSeenWord && onAmnesicMode && (
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onAmnesicMode();
                }}
                title="Mode amnésique"
              >
                <Brain className="w-4 h-4" />
              </Button>
            )}
            {showEliminateButton && onEliminate && (
              <Button
                size="sm"
                variant="destructive"
                className="w-8 h-8 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onEliminate();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Eliminated overlay */}
        {player.isEliminated && (
          <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-destructive">ÉLIMINÉ</div>
              <div className="text-sm font-semibold">
                {player.role === 'civil' && '👤 Civil'}
                {player.role === 'undercover' && '🕵️ Undercover'}
                {player.role === 'mister-white' && '❓ Mister White'}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}