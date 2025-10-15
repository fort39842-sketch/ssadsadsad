import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Target, Clock } from "lucide-react";

interface Player {
  id: string;
  nickname: string;
  time_taken_ms: number | null;
  accuracy_percent: number | null;
  finished_at: string | null;
}

interface ResultsProps {
  players: Player[];
  currentPlayerId: string;
  onBackToLanding: () => void;
}

const Results = ({ players, currentPlayerId, onBackToLanding }: ResultsProps) => {
  const sortedPlayers = [...players].sort((a, b) => {
    if (!a.time_taken_ms && !b.time_taken_ms) return 0;
    if (!a.time_taken_ms) return 1;
    if (!b.time_taken_ms) return -1;
    return a.time_taken_ms - b.time_taken_ms;
  });

  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const winner = sortedPlayers[0];
  const isWinner = winner?.id === currentPlayerId;

  const formatTime = (timeMs: number | null) => {
    if (!timeMs) return "--";
    const seconds = (timeMs / 1000).toFixed(2);
    return `${seconds}s`;
  };

  const formatAccuracy = (accuracy: number | null) => {
    if (!accuracy) return "--";
    return `${accuracy.toFixed(1)}%`;
  };

  const getRankDisplay = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gaming-dark via-racing-purple/20 to-gaming-dark">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          {isWinner ? (
            <>
              <Trophy className="w-24 h-24 mx-auto text-neon-cyan text-glow-cyan animate-bounce" data-testid="icon-trophy-winner" />
              <h2 className="text-5xl md:text-6xl font-bold text-glow-cyan" data-testid="heading-winner">
                You Won! 🎉
              </h2>
              <p className="text-xl text-neon-green" data-testid="text-winner-prize">
                You claimed 80% of the prize pool!
              </p>
            </>
          ) : (
            <>
              <Target className="w-20 h-20 mx-auto text-racing-purple text-glow-purple" data-testid="icon-target" />
              <h2 className="text-4xl md:text-5xl font-bold text-glow-purple" data-testid="heading-race-complete">
                Race Complete
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-better-luck">
                Better luck next time!
              </p>
            </>
          )}
        </div>

        {currentPlayer && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-lg blur opacity-25"></div>
            <Card className="relative bg-card border-border p-6">
              <h3 className="text-lg font-semibold mb-4 text-neon-cyan" data-testid="heading-your-stats">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground" data-testid="label-your-time">Time</div>
                    <div className="text-xl font-bold text-neon-green" data-testid="value-your-time">
                      {formatTime(currentPlayer.time_taken_ms)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground" data-testid="label-your-accuracy">Accuracy</div>
                    <div className="text-xl font-bold text-neon-cyan" data-testid="value-your-accuracy">
                      {formatAccuracy(currentPlayer.accuracy_percent)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green rounded-lg blur opacity-25"></div>
          <Card className="relative bg-card border-border p-6">
            <h3 className="text-lg font-semibold mb-4 text-racing-purple" data-testid="heading-leaderboard">Leaderboard</h3>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    player.id === currentPlayerId
                      ? "bg-neon-cyan/10 border border-neon-cyan/30"
                      : "bg-muted/50"
                  }`}
                  data-testid={`leaderboard-row-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl w-12 text-center" data-testid={`rank-${index}`}>
                      {getRankDisplay(index)}
                    </span>
                    <div>
                      <div className="font-semibold" data-testid={`player-name-${index}`}>
                        {player.nickname}
                        {player.id === currentPlayerId && (
                          <span className="ml-2 text-xs text-neon-cyan">(You)</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`player-stats-${index}`}>
                        {formatTime(player.time_taken_ms)} • {formatAccuracy(player.accuracy_percent)}
                      </div>
                    </div>
                  </div>
                  {index === 0 && player.time_taken_ms && (
                    <Trophy className="w-6 h-6 text-neon-cyan" data-testid="icon-winner-trophy" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={onBackToLanding}
            className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 text-primary-foreground font-bold px-8 py-6 text-lg"
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
