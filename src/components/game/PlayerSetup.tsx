import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Trash2, Plus, Play } from 'lucide-react';

interface PlayerSetupProps {
  onStartGame: (playerNames: string[], undercoverCount: number, hasMisterWhite: boolean) => void;
}

export function PlayerSetup({ onStartGame }: PlayerSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [hasMisterWhite, setHasMisterWhite] = useState(true);

  const addPlayer = () => {
    if (playerNames.length < 12) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 3) {
      const newNames = playerNames.filter((_, i) => i !== index);
      setPlayerNames(newNames);
      
      // Adjust undercover count if needed
      const maxUndercovers = Math.floor(newNames.filter(name => name.trim()).length / 2) - (hasMisterWhite ? 1 : 0);
      if (undercoverCount > maxUndercovers) {
        setUndercoverCount(Math.max(1, maxUndercovers));
      }
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name.slice(0, 16); // Limit to 16 characters
    setPlayerNames(newNames);
  };

  const getMaxUndercovers = () => {
    const activePlayers = playerNames.filter(name => name.trim()).length;
    return Math.max(1, Math.floor(activePlayers / 2) - (hasMisterWhite ? 1 : 0));
  };

  const canStartGame = () => {
    const validNames = playerNames.filter(name => name.trim()).length;
    return validNames >= 3 && undercoverCount >= 1;
  };

  const handleStartGame = () => {
    const validNames = playerNames
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (canStartGame()) {
      onStartGame(validNames, undercoverCount, hasMisterWhite);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-card bg-gradient-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Configuration de la partie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Players Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Joueurs</Label>
              <Button
                variant="game"
                size="sm"
                onClick={addPlayer}
                disabled={playerNames.length >= 12}
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </div>
            
            <div className="grid gap-3">
              {playerNames.map((name, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold",
                    `border-player-${(index % 8) + 1} text-player-${(index % 8) + 1}`
                  )}>
                    {index + 1}
                  </div>
                  <Input
                    value={name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    placeholder={`Joueur ${index + 1}`}
                    maxLength={16}
                    className="flex-1"
                  />
                  {playerNames.length > 3 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removePlayer(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              {playerNames.filter(name => name.trim()).length} joueur(s) configuré(s)
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-4 border-t border-border pt-6">
            <Label className="text-lg font-semibold">Paramètres du jeu</Label>
            
            {/* Undercover Count */}
            <div className="space-y-2">
              <Label>Nombre d'Undercovers : {undercoverCount}</Label>
              <div className="flex gap-2">
                {Array.from({ length: getMaxUndercovers() }, (_, i) => i + 1).map(num => (
                  <Button
                    key={num}
                    variant={undercoverCount === num ? "undercover" : "outline"}
                    size="sm"
                    onClick={() => setUndercoverCount(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mister White Toggle */}
            <div className="flex items-center justify-between">
              <Label>Inclure Mister White</Label>
              <Switch
                checked={hasMisterWhite}
                onCheckedChange={setHasMisterWhite}
              />
            </div>
          </div>

          {/* Game Summary */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="font-semibold text-center">Résumé de la partie</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-civil font-semibold">
                  {playerNames.filter(name => name.trim()).length - undercoverCount - (hasMisterWhite ? 1 : 0)}
                </div>
                <div>Civils</div>
              </div>
              <div className="text-center">
                <div className="text-undercover font-semibold">{undercoverCount}</div>
                <div>Undercover</div>
              </div>
              <div className="text-center">
                <div className="text-mister-white font-semibold">{hasMisterWhite ? 1 : 0}</div>
                <div>Mister White</div>
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <Button
            variant="game"
            size="xl"
            className="w-full"
            onClick={handleStartGame}
            disabled={!canStartGame()}
          >
            <Play className="w-5 h-5" />
            Lancer la partie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}