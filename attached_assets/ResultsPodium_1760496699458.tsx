import { Trophy, Medal, Award, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  nickname: string;
  time_taken_ms: number;
  accuracy_percent: number;
  placement: number;
}

interface ResultsPodiumProps {
  players: Player[];
  currentPlayerId: string;
  onPlayAgain: () => void;
}

const ResultsPodium = ({ players, currentPlayerId, onPlayAgain }: ResultsPodiumProps) => {
  const sortedPlayers = [...players].sort((a, b) => a.placement - b.placement);
  const currentPlayer = players.find(p => p.id === currentPlayerId);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${String(milliseconds).padStart(3, '0')}s`;
  };

  const getPodiumHeight = (placement: number) => {
    if (placement === 1) return "h-48";
    if (placement === 2) return "h-36";
    if (placement === 3) return "h-28";
    return "h-20";
  };

  const getPodiumIcon = (placement: number) => {
    if (placement === 1) return <Trophy className="w-12 h-12 text-accent" />;
    if (placement === 2) return <Medal className="w-10 h-10 text-secondary" />;
    if (placement === 3) return <Award className="w-8 h-8 text-primary" />;
    return null;
  };

  const topThree = sortedPlayers.slice(0, 3);
  const rest = sortedPlayers.slice(3);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <Trophy className="w-24 h-24 mx-auto text-accent text-glow-green animate-pulse-glow" />
          <h2 className="text-4xl md:text-5xl font-bold text-glow-purple">
            Race Complete!
          </h2>
          {currentPlayer && (
            <div className="text-2xl text-secondary">
              You placed #{currentPlayer.placement}
            </div>
          )}
        </div>

        {currentPlayer && (
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg blur opacity-25"></div>
            <div className="relative bg-card border-2 border-secondary rounded-lg p-6">
              <h3 className="text-xl font-bold text-center mb-4 text-secondary">
                Your Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-muted rounded-lg p-4">
                  <Clock className="w-6 h-6 text-secondary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="text-xl font-bold">{formatTime(currentPlayer.time_taken_ms)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted rounded-lg p-4">
                  <Target className="w-6 h-6 text-accent" />
                  <div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="text-xl font-bold">{currentPlayer.accuracy_percent.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg blur opacity-25"></div>
          <div className="relative bg-card border border-border rounded-lg p-8 space-y-8">
            <h3 className="text-2xl font-bold text-center">Leaderboard</h3>

            {topThree.length > 0 && (
              <div className="flex items-end justify-center gap-4 mb-8">
                {topThree[1] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[200px]">
                    <div className="text-6xl">🥈</div>
                    <div className="text-center">
                      <div className="font-bold text-lg truncate">{topThree[1].nickname}</div>
                      <div className="text-sm text-muted-foreground">{formatTime(topThree[1].time_taken_ms)}</div>
                      <div className="text-xs text-accent">{topThree[1].accuracy_percent.toFixed(1)}%</div>
                    </div>
                    <div className={`w-full bg-gradient-to-t from-secondary to-secondary/50 rounded-t-lg ${getPodiumHeight(2)} flex items-center justify-center`}>
                      <span className="text-4xl font-bold text-primary-foreground">2</span>
                    </div>
                  </div>
                )}

                {topThree[0] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[200px]">
                    <div className="text-7xl animate-pulse-glow">🏆</div>
                    <div className="text-center">
                      <div className="font-bold text-xl truncate text-accent">{topThree[0].nickname}</div>
                      <div className="text-sm text-muted-foreground">{formatTime(topThree[0].time_taken_ms)}</div>
                      <div className="text-xs text-accent">{topThree[0].accuracy_percent.toFixed(1)}%</div>
                    </div>
                    <div className={`w-full bg-gradient-to-t from-accent to-accent/50 rounded-t-lg ${getPodiumHeight(1)} flex items-center justify-center`}>
                      <span className="text-5xl font-bold text-primary-foreground">1</span>
                    </div>
                  </div>
                )}

                {topThree[2] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[200px]">
                    <div className="text-5xl">🥉</div>
                    <div className="text-center">
                      <div className="font-bold text-lg truncate">{topThree[2].nickname}</div>
                      <div className="text-sm text-muted-foreground">{formatTime(topThree[2].time_taken_ms)}</div>
                      <div className="text-xs text-accent">{topThree[2].accuracy_percent.toFixed(1)}%</div>
                    </div>
                    <div className={`w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg ${getPodiumHeight(3)} flex items-center justify-center`}>
                      <span className="text-3xl font-bold text-primary-foreground">3</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {rest.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-center mb-4">Other Racers</h4>
                {rest.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      player.id === currentPlayerId
                        ? "bg-secondary/20 border border-secondary"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center font-bold text-xl">
                        #{player.placement}
                      </div>
                      <div className="font-semibold">{player.nickname}</div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{formatTime(player.time_taken_ms)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent" />
                        <span>{player.accuracy_percent.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-bold px-12 py-6 text-lg"
          >
            Race Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPodium;
