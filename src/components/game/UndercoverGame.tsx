import React, { useState } from 'react';
import { PlayerSetup } from './PlayerSetup';
import { GameBoard } from './GameBoard';
import { VictoryScreen } from './VictoryScreen';
import { MisterWhiteGuess } from './MisterWhiteGuess';
import { StartingPlayerSelection } from './StartingPlayerSelection';
import { AmnesicModeDialog } from './AmnesicModeDialog';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, SkipForward, Brain } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { Player } from '@/types/game';
import type { PlayerConfig } from '@/types/playerConfig';

export function UndercoverGame() {
  const {
    gameState,
    startGame,
    revealPlayerWord,
    eliminatePlayer,
    handleMisterWhiteGuessAttempt,
    selectStartingPlayer,
    skipRound,
    startNewRound,
    enableAmnesicMode,
    resetGame,
  } = useGame();

  const [showEliminationMode, setShowEliminationMode] = useState(false);
  const [showMisterWhiteGuess, setShowMisterWhiteGuess] = useState(false);
  const [misterWhitePlayer, setMisterWhitePlayer] = useState<Player | null>(null);
  const [amnesicPlayer, setAmnesicPlayer] = useState<Player | null>(null);
  const [showAmnesicDialog, setShowAmnesicDialog] = useState(false);

  const handleStartGame = (playerConfigs: PlayerConfig[], undercoverCount: number, hasMisterWhite: boolean) => {
    startGame(playerConfigs, undercoverCount, hasMisterWhite);
  };

  const handlePlayerCardClick = (player: Player) => {
    if (gameState.phase === 'word-distribution' && !player.hasSeenWord && !player.isEliminated) {
      revealPlayerWord(player);
    }
  };

  const handleEliminatePlayer = (player: Player) => {
    // Show role announcement toast
    const roleAnnouncement = {
      'civil': `👤 ${player.name} était un Civil !`,
      'undercover': `🕵️ ${player.name} était un Undercover !`,
      'mister-white': `❓ ${player.name} était Mister White !`
    };
    
    toast.success(roleAnnouncement[player.role], {
      duration: 3000,
      style: {
        background: player.role === 'civil' ? '#10b981' : 
                   player.role === 'undercover' ? '#f59e0b' : '#ef4444',
        color: 'white',
        fontWeight: 'bold'
      }
    });

    if (player.role === 'mister-white') {
      setMisterWhitePlayer(player);
      setShowMisterWhiteGuess(true);
      eliminatePlayer(player);
    } else {
      eliminatePlayer(player);
    }
    setShowEliminationMode(false);
  };

  const handleMisterWhiteGuess = (guess: string) => {
    handleMisterWhiteGuessAttempt(guess);
    setShowMisterWhiteGuess(false);
    setMisterWhitePlayer(null);
  };

  const handleSkipMisterWhiteGuess = () => {
    setShowMisterWhiteGuess(false);
    setMisterWhitePlayer(null);
  };

  const handleSkipRound = () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir passer à une nouvelle manche ? Les scores seront conservés mais de nouveaux mots seront distribués.'
    );
    if (confirmed) {
      skipRound();
    }
  };

  const handleAmnesicMode = (player: Player) => {
    setAmnesicPlayer(player);
    setShowAmnesicDialog(true);
  };

  const handleAmnesicConfirm = () => {
    if (amnesicPlayer) {
      enableAmnesicMode(amnesicPlayer.id);
    }
    setShowAmnesicDialog(false);
    setAmnesicPlayer(null);
  };

  const handleEndGameConfirm = () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir terminer la partie ? Les scores seront remis à zéro.'
    );
    if (confirmed) {
      resetGame();
    }
  };

  const renderGameContent = () => {
    // Mister White guess overlay
    if (showMisterWhiteGuess && misterWhitePlayer) {
      return (
        <MisterWhiteGuess
          player={misterWhitePlayer}
          onGuess={handleMisterWhiteGuess}
          onSkip={handleSkipMisterWhiteGuess}
        />
      );
    }

    switch (gameState.phase) {
      case 'setup':
        return <PlayerSetup onStartGame={handleStartGame} />;
      
      case 'starting-player-selection':
        return (
          <StartingPlayerSelection
            players={gameState.players}
            onPlayerSelected={selectStartingPlayer}
          />
        );
      
      case 'word-distribution':
      case 'amnesic-mode':
      case 'playing':
        return (
          <div className="space-y-6">
            {gameState.phase === 'playing' && (
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Phase de discussion</div>
                        <div className="text-sm text-muted-foreground">
                          {gameState.startingPlayerIndex !== undefined && (
                            <span className="text-accent font-medium">
                              Premier joueur : {gameState.players[gameState.startingPlayerIndex].name} • 
                            </span>
                          )} Discutez pour identifier les intrus !
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSkipRound}
                        className="whitespace-nowrap"
                      >
                        <SkipForward className="w-4 h-4" />
                        Skip la manche
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setShowEliminationMode(!showEliminationMode)}
                      >
                        {showEliminationMode ? 'Annuler' : 'Éliminer un joueur'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <GameBoard
              gameState={gameState}
              onPlayerCardClick={handlePlayerCardClick}
              onEliminatePlayer={handleEliminatePlayer}
              onEndGame={handleEndGameConfirm}
              onAmnesicMode={handleAmnesicMode}
              showEliminationMode={showEliminationMode}
            />
          </div>
        );

      case 'game-over':
        return (
          <VictoryScreen
            gameState={gameState}
            onNewRound={startNewRound}
            onBackToMenu={resetGame}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {renderGameContent()}
      </div>
      <Toaster position="top-center" />
      
      <AmnesicModeDialog
        playerName={amnesicPlayer?.name || ''}
        open={showAmnesicDialog}
        onOpenChange={setShowAmnesicDialog}
        onConfirm={handleAmnesicConfirm}
      />
    </div>
  );
}