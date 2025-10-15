import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LandingPageProps {
  onDevAccess: () => void;
  onJoinGame?: () => void;
  hasActiveGame: boolean;
  gameEndsAt?: string;
  playerCount?: number;
}

const LandingPage = ({
  onDevAccess,
  onJoinGame,
  hasActiveGame,
  gameEndsAt,
  playerCount = 0
}: LandingPageProps) => {
  const { toast } = useToast();
  const contractAddress = "FeesTypeContractAddressHere123456789";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard"
    });
  };

  const getTimeRemaining = () => {
    if (!gameEndsAt) return null;
    const now = Date.now();
    const end = new Date(gameEndsAt).getTime();
    const remaining = Math.max(0, Math.floor((end - now) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-racing-purple/20 to-gaming-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in duration-500">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-racing-purple bg-clip-text text-transparent animate-pulse-glow" data-testid="heading-title">
            FEESTYPE
          </h1>
          <p className="text-xl text-gray-400 mb-8" data-testid="text-tagline">
            Type fast. Win fees. Fastest typer claims 80% of the pot.
          </p>
          
          {/* Status */}
          <div className="flex items-center justify-center gap-4 text-gray-400 italic mb-6">
            {hasActiveGame ? (
              <>
                <div className="flex items-center gap-2 text-neon-cyan" data-testid="status-game-live">
                  <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
                  <span>Game starting soon!</span>
                </div>
                {gameEndsAt && (
                  <>
                    <span>·</span>
                    <div className="flex items-center gap-2" data-testid="timer-countdown">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeRemaining()}</span>
                    </div>
                  </>
                )}
                {playerCount > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex items-center gap-2" data-testid="count-players">
                      <Users className="w-4 h-4" />
                      <span>{playerCount} {playerCount === 1 ? 'racer' : 'racers'}</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <span data-testid="status-no-game">No game is live right now</span>
            )}
            <span>·</span>
            <a href="https://x.com/FeesType" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neon-cyan transition-colors" data-testid="link-twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow us on X
            </a>
          </div>

          {/* Join Button */}
          {hasActiveGame && onJoinGame && (
            <div className="mb-8">
              <Button
                onClick={onJoinGame}
                className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 text-white font-bold text-xl px-12 py-8 rounded-lg transition-all shadow-lg hover:shadow-neon-purple/50 animate-in zoom-in duration-300"
                data-testid="button-join-game"
              >
                Join Race Now
              </Button>
            </div>
          )}
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* How to Play */}
          <Card className="bg-black/40 border-neon-cyan/20 p-6 hover-elevate" data-testid="card-how-to-play">
            <h3 className="text-xl font-bold mb-4 text-neon-cyan">How to Play</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              When a game starts, type the given paragraph as fast and accurately as possible. 
              The fastest typer with the highest accuracy wins.
            </p>
          </Card>

          {/* How to Win */}
          <Card className="bg-black/40 border-racing-purple/20 p-6 hover-elevate" data-testid="card-how-to-win">
            <h3 className="text-xl font-bold mb-4 text-racing-purple">How to Win</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Be the <span className="text-neon-cyan font-semibold">fastest typer</span> to complete 
              the paragraph with high accuracy. Speed and precision both matter.
            </p>
          </Card>

          {/* Rewards */}
          <Card className="bg-black/40 border-neon-cyan/20 p-6 hover-elevate" data-testid="card-rewards">
            <h3 className="text-xl font-bold mb-4 text-neon-cyan">Rewards</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Winners get <span className="text-racing-purple font-bold text-lg">80%</span> of 
              the collected entry fees. The faster you type, the more you earn.
            </p>
          </Card>

          {/* Entry Fee */}
          <Card className="bg-black/40 border-racing-purple/20 p-6 hover-elevate" data-testid="card-entry-fee">
            <h3 className="text-xl font-bold mb-4 text-racing-purple">Entry Fee</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Must hold at least 0.01 Solana of the coin</p>
          </Card>
        </div>

        {/* Important Prize Rules */}
        <Card className="bg-gradient-to-br from-red-950/40 to-black/40 border-red-500/30 p-8 mb-12" data-testid="card-prize-rules">
          <h3 className="text-2xl font-bold mb-6 text-center">Important Prize Rules</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">●</span>
              <p className="text-gray-300">
                <span className="font-semibold">If 0 winners:</span> Funds are used for future prize pools
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">●</span>
              <p className="text-gray-300">
                <span className="font-semibold">Fair play only:</span> Any detected cheating results in 
                disqualification and forfeiture of rewards
              </p>
            </div>
          </div>
        </Card>

        {/* Contract Address */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Contract Address</h3>
          <div className="flex items-center justify-center gap-2 bg-black/40 border border-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
            <code className="text-gray-400 text-sm font-mono flex-1 truncate" data-testid="text-contract-address">
              {contractAddress}
            </code>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="hover:bg-neon-cyan/20 hover:text-neon-cyan" data-testid="button-copy-address">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hidden Dev Access */}
        <div className="text-center mt-8">
          <button onClick={onDevAccess} className="text-xs text-gray-700 hover:text-gray-600 transition-colors" data-testid="button-dev-access">
            •
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
