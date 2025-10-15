import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DevPanelProps {
  onClose: () => void;
  onCreateGame: (waitTimeSeconds: number, paragraph: string) => Promise<void>;
}

const DevPanel = ({ onClose, onCreateGame }: DevPanelProps) => {
  const [waitTime, setWaitTime] = useState("60");
  const [paragraph, setParagraph] = useState(
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once."
  );
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateGame = async () => {
    const seconds = parseInt(waitTime);
    if (isNaN(seconds) || seconds < 10 || seconds > 300) {
      toast({
        title: "Invalid wait time",
        description: "Wait time must be between 10 and 300 seconds",
        variant: "destructive",
      });
      return;
    }

    if (paragraph.trim().length < 20) {
      toast({
        title: "Paragraph too short",
        description: "Paragraph must be at least 20 characters",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await onCreateGame(seconds, paragraph.trim());
      toast({
        title: "Game created!",
        description: `Game will start in ${seconds} seconds`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error creating game",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl bg-card border-border p-6 space-y-6 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-destructive/20 hover:text-destructive"
          data-testid="button-close-dev-panel"
        >
          <X className="w-5 h-5" />
        </Button>

        <div>
          <h2 className="text-2xl font-bold text-neon-cyan" data-testid="heading-dev-panel">Dev Panel</h2>
          <p className="text-sm text-muted-foreground" data-testid="text-dev-description">Create a new typing race game</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="wait-time" className="text-sm font-medium" data-testid="label-wait-time">
              Wait Time (seconds)
            </label>
            <Input
              id="wait-time"
              type="number"
              value={waitTime}
              onChange={(e) => setWaitTime(e.target.value)}
              min="10"
              max="300"
              className="bg-input border-border focus:border-neon-cyan focus:ring-neon-cyan"
              data-testid="input-wait-time"
            />
            <p className="text-xs text-muted-foreground" data-testid="text-wait-time-hint">
              Time players have to join before game starts (10-300 seconds)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="paragraph" className="text-sm font-medium" data-testid="label-paragraph">
              Typing Paragraph
            </label>
            <Textarea
              id="paragraph"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              rows={6}
              className="bg-input border-border focus:border-neon-cyan focus:ring-neon-cyan font-mono text-sm resize-none"
              data-testid="textarea-paragraph"
            />
            <p className="text-xs text-muted-foreground" data-testid="text-paragraph-hint">
              The text players will need to type (minimum 20 characters)
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCreateGame}
            disabled={isCreating}
            className="flex-1 bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 text-primary-foreground font-bold"
            data-testid="button-create-game"
          >
            {isCreating ? "Creating..." : "Create Game"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DevPanel;
