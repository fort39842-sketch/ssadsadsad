import { useEffect, useState } from "react";
import { Trophy, Users, Clock } from "lucide-react";

interface WaitingRoomProps {
  playerCount: number;
  endsAt: string;
  onStart: () => void;
}

const WaitingRoom = ({ playerCount, endsAt, onStart }: WaitingRoomProps) => {
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const end = new Date(endsAt).getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      
      setDisplayTime(remaining);
      
      if (remaining <= 0) {
        onStart();
      }
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [endsAt, onStart]);

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <Trophy className="w-20 h-20 mx-auto text-secondary text-glow-cyan animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold text-glow-purple">
            You're in!
          </h2>
          <p className="text-muted-foreground text-lg">
            Get ready to race. The game starts when the timer reaches zero.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg blur opacity-25"></div>
          <div className="relative bg-card border border-border rounded-lg p-8 space-y-8">
            <div className="flex items-center justify-center gap-3">
              <Users className="w-6 h-6 text-secondary" />
              <span className="text-3xl font-bold text-glow-cyan">
                {playerCount}
              </span>
              <span className="text-muted-foreground">
                {playerCount === 1 ? "racer" : "racers"} joined
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-6 h-6 text-accent" />
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  Race starts in
                </span>
              </div>
              
              <div className="text-center">
                <div className="inline-block bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 animate-typing-pulse">
                  <div className="text-7xl md:text-8xl font-bold text-primary-foreground tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                All racers will start typing at the same time
              </p>
              <p className="text-xs text-muted-foreground/70">
                Type the paragraph accurately and quickly to win!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-muted-foreground">Waiting for race to start...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
