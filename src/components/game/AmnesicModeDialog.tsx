import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AmnesicModeDialogProps {
  playerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function AmnesicModeDialog({ 
  playerName, 
  open, 
  onOpenChange, 
  onConfirm 
}: AmnesicModeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            🧠 Mode amnésique
          </AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{playerName}</strong> souhaite revoir sa carte.
            <br /><br />
            Es-tu sûr de vouloir révéler à nouveau ton mot/rôle ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Oui, revoir ma carte
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}