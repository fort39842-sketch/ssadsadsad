import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface EntryFormProps {
  onSubmit: (nickname: string, wallet: string) => void;
}

const EntryForm = ({ onSubmit }: EntryFormProps) => {
  const [nickname, setNickname] = useState("");
  const [wallet, setWallet] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      toast({
        title: "Nickname required",
        description: "Please enter your nickname",
        variant: "destructive",
      });
      return;
    }
    
    if (!wallet.trim()) {
      toast({
        title: "Wallet required",
        description: "Please enter your wallet address",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(nickname.trim(), wallet.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold text-glow-purple bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse-glow">
            FeesType
          </h1>
          <p className="text-muted-foreground text-lg">
            The ultimate coin for speed and skill
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25"></div>
            <div className="relative bg-card border border-border rounded-lg p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="nickname" className="text-sm font-medium text-secondary">
                  Nickname
                </label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Enter your nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-input border-border focus:border-secondary focus:ring-secondary transition-all"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="wallet" className="text-sm font-medium text-secondary">
                  Wallet Address
                </label>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="Enter your wallet address"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className="bg-input border-border focus:border-secondary focus:ring-secondary transition-all font-mono text-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-bold text-lg py-6 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Enter Race
              </Button>
            </div>
          </div>
        </form>

        <div className="text-center text-xs text-muted-foreground max-w-sm mx-auto">
          <p>
            FeesType is a crypto that rewards the fastest hands on the keyboard.
            Type fast, earn fast.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntryForm;
