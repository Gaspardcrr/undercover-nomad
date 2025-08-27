import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import type { PlayerConfig } from '@/types/playerConfig';

interface PlayerConfigDialogProps {
  player?: PlayerConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (player: PlayerConfig) => void;
}

export function PlayerConfigDialog({ 
  player, 
  open, 
  onOpenChange, 
  onSave 
}: PlayerConfigDialogProps) {
  const [name, setName] = useState(player?.name || '');
  const [profileImage, setProfileImage] = useState(player?.profileImage);

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        id: player?.id || `player-${Date.now()}`,
        name: name.trim(),
        profileImage,
      });
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setName(player?.name || '');
    setProfileImage(player?.profileImage);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {player ? 'Modifier le joueur' : 'Ajouter un joueur'}
          </DialogTitle>
          <DialogDescription>
            Configurez les informations du joueur
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center space-y-4">
            <ImageUpload
              value={profileImage}
              onChange={setProfileImage}
              fallback={name.slice(0, 2).toUpperCase() || '??'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="player-name">Prénom</Label>
            <Input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 16))}
              placeholder="Entrez le prénom"
              maxLength={16}
            />
            <div className="text-xs text-muted-foreground">
              {name.length}/16 caractères
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {player ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}