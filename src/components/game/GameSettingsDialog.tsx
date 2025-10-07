import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlayerConfigDialog } from '@/components/game/PlayerConfigDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Trash2, Plus, Edit, Save } from 'lucide-react';
import type { PlayerConfig } from '@/types/playerConfig';
import type { Player } from '@/types/game';
import { validateGameConfig } from '@/utils/gameLogic';

interface GameSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlayers: Player[];
  currentUndercoverCount: number;
  currentHasMisterWhite: boolean;
  onSave: (playerConfigs: PlayerConfig[], undercoverCount: number, hasMisterWhite: boolean) => void;
}

export function GameSettingsDialog({ 
  open, 
  onOpenChange, 
  currentPlayers,
  currentUndercoverCount,
  currentHasMisterWhite,
  onSave 
}: GameSettingsDialogProps) {
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>([]);
  const [undercoverCount, setUndercoverCount] = useState(currentUndercoverCount);
  const [hasMisterWhite, setHasMisterWhite] = useState(currentHasMisterWhite);
  const [editingPlayer, setEditingPlayer] = useState<PlayerConfig | undefined>();
  const [showPlayerDialog, setShowPlayerDialog] = useState(false);

  // Initialize with current players when dialog opens
  useEffect(() => {
    if (open) {
      const configs: PlayerConfig[] = currentPlayers.map(p => ({
        id: p.id,
        name: p.name,
        profileImage: p.profileImage
      }));
      setPlayerConfigs(configs);
      setUndercoverCount(currentUndercoverCount);
      setHasMisterWhite(currentHasMisterWhite);
    }
  }, [open, currentPlayers, currentUndercoverCount, currentHasMisterWhite]);

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
    setPlayerConfigs(prev => prev.filter(p => p.id !== playerId));
  };

  const handleSavePlayer = (player: PlayerConfig) => {
    if (editingPlayer) {
      setPlayerConfigs(prev => prev.map(p => p.id === player.id ? player : p));
    } else {
      setPlayerConfigs(prev => [...prev, player]);
    }
  };

  const getMaxUndercovers = () => {
    if (playerConfigs.length < 3) return 1;
    const maxPossible = hasMisterWhite ? playerConfigs.length - 2 : playerConfigs.length - 1;
    return Math.max(1, maxPossible);
  };

  const canSaveSettings = () => {
    const validation = validateGameConfig(playerConfigs.length, undercoverCount, hasMisterWhite);
    return validation.isValid;
  };

  const handleSave = () => {
    if (canSaveSettings()) {
      onSave(playerConfigs, undercoverCount, hasMisterWhite);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Paramètres de la partie
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
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
            )}

            {/* Game Summary */}
            {playerConfigs.length >= 3 && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="font-semibold text-center">Résumé de la partie</div>
                {(() => {
                  const civilCount = playerConfigs.length - undercoverCount - (hasMisterWhite ? 1 : 0);
                  const validation = validateGameConfig(playerConfigs.length, undercoverCount, hasMisterWhite);
                  
                  return (
                    <>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className={cn(
                            "font-semibold",
                            validation.isValid ? "text-civil" : "text-destructive"
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
                      {!validation.isValid && (
                        <div className="text-destructive text-sm text-center">
                          ⚠️ {validation.error}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                variant="game"
                className="flex-1"
                onClick={handleSave}
                disabled={!canSaveSettings()}
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PlayerConfigDialog
        player={editingPlayer}
        open={showPlayerDialog}
        onOpenChange={setShowPlayerDialog}
        onSave={handleSavePlayer}
      />
    </>
  );
}
