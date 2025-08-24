import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Player } from '@/types/game';

interface MisterWhiteGuessProps {
  player: Player;
  onGuess: (guess: string) => void;
  onSkip: () => void;
}

export function MisterWhiteGuess({ player, onGuess, onSkip }: MisterWhiteGuessProps) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-card border-mister-white">
        <CardHeader className="text-center">
          <CardTitle className="text-mister-white">
            🎭 {player.name} - Mister White
          </CardTitle>
          <p className="text-muted-foreground">
            Vous avez été éliminé, mais vous avez une dernière chance !
            Devinez le mot des civils pour gagner la partie.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guess">Votre proposition :</Label>
              <Input
                id="guess"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Entrez votre guess..."
                maxLength={50}
                autoFocus
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="mister-white"
                size="lg"
                className="flex-1"
                disabled={!guess.trim()}
              >
                Confirmer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onSkip}
              >
                Passer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}