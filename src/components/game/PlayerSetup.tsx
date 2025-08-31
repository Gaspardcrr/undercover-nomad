import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlayerConfigDialog } from '@/components/game/PlayerConfigDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Trash2, Plus, Play, Edit } from 'lucide-react';
import type { PlayerConfig } from '@/types/playerConfig';
import { autoAdjustGameConfig } from '@/utils/gameLogic';

interface PlayerSetupProps {
  onStartGame: (playerConfigs: PlayerConfig[], undercoverCount: number, hasMisterWhite: boolean) => void;
}

export function PlayerSetup({ onStartGame }: PlayerSetupProps) {
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>([]);
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [hasMisterWhite, setHasMisterWhite] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<PlayerConfig | undefined>();
  const [showPlayerDialog, setShowPlayerDialog] = useState(false);

  const addPlayer = () => {
    if (playerConfigs.length < 12) {
      setEditingPlayer(undefined);
      setShowPlayerDialog(true);
    }
  };

  const editPlayer = (player: PlayerConfig) => {
    setEditingPlayer(player);
    setShowPlayerDialog(true);
  };

  const removePlayer = (playerId: string) => {
    const newConfigs = playerConfigs.filter(p => p.id !== playerId);
    setPlayerConfigs(newConfigs);
    
    // Auto-adjust game settings
    if (newConfigs.length >= 3) {
      const adjusted = autoAdjustGameConfig(newConfigs.length, undercoverCount, hasMisterWhite);
      setUndercoverCount(adjusted.undercoverCount);
      setHasMisterWhite(adjusted.hasMisterWhite);
    }
  };

  const handleSavePlayer = (player: PlayerConfig) => {
    if (editingPlayer) {
      // Edit existing player
      setPlayerConfigs(prev => prev.map(p => p.id === player.id ? player : p));
    } else {
      // Add new player
      setPlayerConfigs(prev => [...prev, player]);
    }
    
    // Auto-adjust game settings after adding/editing
    const newCount = editingPlayer ? playerConfigs.length : playerConfigs.length + 1;
    if (newCount >= 3) {
      const adjusted = autoAdjustGameConfig(newCount, undercoverCount, hasMisterWhite);
      setUndercoverCount(adjusted.undercoverCount);
      setHasMisterWhite(adjusted.hasMisterWhite);
    }
  };

  const getMaxUndercovers = () => {
    if (playerConfigs.length < 3) return 1;
    const adjusted = autoAdjustGameConfig(playerConfigs.length, 10, hasMisterWhite);
    return adjusted.undercoverCount;
  };

  const canStartGame = () => {
    if (playerConfigs.length < 3) return false;
    
    // Check if configuration respects the rules
    const minCivilsRequired = hasMisterWhite ? 
      Math.ceil(playerConfigs.length / 2) : 
      Math.ceil(playerConfigs.length / 2) + 1;
    const nonCivilCount = undercoverCount + (hasMisterWhite ? 1 : 0);
    const actualCivils = playerConfigs.length - nonCivilCount;
    
    return actualCivils >= minCivilsRequired && undercoverCount >= 1;
  };

  const handleStartGame = () => {
    if (canStartGame()) {
      onStartGame(playerConfigs, undercoverCount, hasMisterWhite);
    }
  };

  const handleUndercoverCountChange = (newCount: number) => {
    setUndercoverCount(newCount);
    
    // Auto-adjust if needed
    const adjusted = autoAdjustGameConfig(playerConfigs.length, newCount, hasMisterWhite);
    if (adjusted.undercoverCount !== newCount) {
      setUndercoverCount(adjusted.undercoverCount);
    }
  };

  const handleMisterWhiteToggle = (enabled: boolean) => {
    setHasMisterWhite(enabled);
    
    // Auto-adjust if needed
    const adjusted = autoAdjustGameConfig(playerConfigs.length, undercoverCount, enabled);
    setUndercoverCount(adjusted.undercoverCount);
    setHasMisterWhite(adjusted.hasMisterWhite);
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
                disabled={playerConfigs.length >= 12}
              >
                <Plus className="w-4 h-4" />
                Ajouter joueur
              </Button>
            </div>
            
            {playerConfigs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-lg mb-2">Aucun joueur configuré</div>
                <div className="text-sm">Cliquez sur "Ajouter joueur" pour commencer</div>
              </div>
            ) : (
              <div className="grid gap-3">
                {playerConfigs.map((player, index) => (
                  <div key={player.id} className="flex gap-3 items-center p-3 rounded-lg border bg-card/50">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                      `border-player-${(index % 8) + 1} text-player-${(index % 8) + 1}`
                    )}>
                      {index + 1}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      {player.profileImage ? (
                        <AvatarImage src={player.profileImage} alt={player.name} />
                      ) : null}
                      <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                        {player.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 font-medium">
                      {player.name}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editPlayer(player)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-sm text-muted-foreground text-center">
              {playerConfigs.length} joueur(s) configuré(s)
            </div>
          </div>

          {/* Game Settings */}
          {playerConfigs.length >= 3 && (
            <div className="space-y-4 border-t border-border pt-6">
              <Label className="text-lg font-semibold">Paramètres du jeu</Label>
              
              {/* Undercover Count */}
              <div className="space-y-2">
                <Label>Nombre d'Undercovers : {undercoverCount}</Label>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: getMaxUndercovers() }, (_, i) => i + 1).map(num => (
                    <Button
                      key={num}
                      variant={undercoverCount === num ? "undercover" : "outline"}
                      size="sm"
                      onClick={() => handleUndercoverCountChange(num)}
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
                  onCheckedChange={handleMisterWhiteToggle}
                />
              </div>
            </div>
          )}

          {/* Game Summary */}
          {playerConfigs.length >= 3 && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="font-semibold text-center">Résumé de la partie</div>
              {(() => {
                const civilCount = playerConfigs.length - undercoverCount - (hasMisterWhite ? 1 : 0);
                const minCivilsRequired = hasMisterWhite ? 
                  Math.ceil(playerConfigs.length / 2) : 
                  Math.ceil(playerConfigs.length / 2) + 1;
                const isValidConfig = civilCount >= minCivilsRequired;
                
                return (
                  <>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className={cn(
                          "font-semibold",
                          isValidConfig ? "text-civil" : "text-destructive"
                        )}>
                          {civilCount}
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
                    {!isValidConfig && (
                      <div className="text-destructive text-sm text-center">
                        ⚠️ Configuration invalide : Au moins {minCivilsRequired} civils requis
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Start Game Button */}
          {playerConfigs.length >= 3 && (
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
          )}
        </CardContent>
      </Card>

      <PlayerConfigDialog
        player={editingPlayer}
        open={showPlayerDialog}
        onOpenChange={setShowPlayerDialog}
        onSave={handleSavePlayer}
      />
    </div>
  );
}