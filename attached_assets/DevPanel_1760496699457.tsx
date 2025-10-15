import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const GAME_PARAGRAPH = "FeesType is the ultimate coin for speed and skill a crypto that rewards the fastest hands on the keyboard. Unlike other tokens that sit idle in your wallet, FeesType brings competition to the blockchain. The concept is simple: every transaction comes with a fee, and if you're the fastest typer, you win the fees. It's a test of reflexes, precision, and timing turning what's normally just a boring transaction cost into a real-time game of profit. In the world of FeesType, the sharpest typers don't just type fast they earn fast.";

interface DevPanelProps {
  onClose: () => void;
}

const DevPanel = ({ onClose }: DevPanelProps) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === "devaccess123") {
      setIsAuthenticated(true);
      toast({
        title: "Access granted",
        description: "Welcome to dev panel",
      });
    } else {
      toast({
        title: "Access denied",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  const createNewGame = async () => {
    setIsCreating(true);
    
    try {
      const endsAt = new Date(Date.now() + durationMinutes * 60 * 1000);
      
      const { data, error } = await supabase
        .from("game_sessions")
        .insert({
          ends_at: endsAt.toISOString(),
          paragraph: GAME_PARAGRAPH,
          status: "waiting",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Game created!",
        description: `New game will start in ${durationMinutes} minutes`,
      });
      
      // Reload to show the new game
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-racing-purple/20 to-gaming-dark flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500/20 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-500">
              Dev Access
            </CardTitle>
            <CardDescription className="text-center">
              Enter password to access dev panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border-red-500/30"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Access
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-racing-purple/20 to-gaming-dark p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Card className="border-red-500/20 bg-black/40 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500">
              Developer Panel
            </CardTitle>
            <CardDescription>
              Manage game sessions and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Create New Game */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Create New Game</h3>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Game Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={60}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="bg-black/50 border-red-500/30"
                />
              </div>

              <Button
                onClick={createNewGame}
                disabled={isCreating}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                {isCreating ? "Creating..." : "Create New Game Session"}
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevPanel;
