import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface LandingPageProps {
  onDevAccess: () => void;
}
const LandingPage = ({
  onDevAccess
}: LandingPageProps) => {
  const {
    toast
  } = useToast();
  const contractAddress = "FeesTypeContractAddressHere123456789";
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard"
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-racing-purple/20 to-gaming-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-racing-purple bg-clip-text text-transparent">
            FEESTYPE
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Type fast. Win fees. Fastest typer claims 80% of the pot.
          </p>
          
          {/* Status */}
          <div className="flex items-center justify-center gap-4 text-gray-400 italic mb-4">
            <span>No game is live right now</span>
            <span>·</span>
            <a href="https://x.com/FeesType" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neon-cyan transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow us on X
            </a>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* How to Play */}
          <Card className="bg-black/40 border-neon-cyan/20 p-6">
            <h3 className="text-xl font-bold mb-4 text-neon-cyan">How to Play</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              When a game starts, type the given paragraph as fast and accurately as possible. 
              The fastest typer with the highest accuracy wins.
            </p>
          </Card>

          {/* How to Win */}
          <Card className="bg-black/40 border-racing-purple/20 p-6">
            <h3 className="text-xl font-bold mb-4 text-racing-purple">How to Win</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Be the <span className="text-neon-cyan font-semibold">fastest typer</span> to complete 
              the paragraph with high accuracy. Speed and precision both matter.
            </p>
          </Card>

          {/* Rewards */}
          <Card className="bg-black/40 border-neon-cyan/20 p-6">
            <h3 className="text-xl font-bold mb-4 text-neon-cyan">Rewards</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Winners get <span className="text-racing-purple font-bold text-lg">80%</span> of 
              the collected entry fees. The faster you type, the more you earn.
            </p>
          </Card>

          {/* Entry Fee */}
          <Card className="bg-black/40 border-racing-purple/20 p-6">
            <h3 className="text-xl font-bold mb-4 text-racing-purple">Entry Fee</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Must hold at least 0.01 Solana of the coin</p>
          </Card>
        </div>

        {/* Important Prize Rules */}
        <Card className="bg-gradient-to-br from-red-950/40 to-black/40 border-red-500/30 p-8 mb-12">
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
            <code className="text-gray-400 text-sm font-mono flex-1 truncate">
              {contractAddress}
            </code>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="hover:bg-neon-cyan/20 hover:text-neon-cyan">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hidden Dev Access */}
        <div className="text-center mt-8">
          <button onClick={onDevAccess} className="text-xs text-gray-700 hover:text-gray-600 transition-colors">
            •
          </button>
        </div>
      </div>
    </div>;
};
export default LandingPage;