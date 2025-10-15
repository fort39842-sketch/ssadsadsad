import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

interface TypingRaceProps {
  paragraph: string;
  onComplete: (timeMs: number, accuracy: number, typedText: string) => void;
}

const TypingRace = ({ paragraph, onComplete }: TypingRaceProps) => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const words = paragraph.split(" ");
  const typedWords = userInput.split(" ");
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!hasStarted) {
      setHasStarted(true);
      setStartTime(Date.now());
    }
    
    setUserInput(value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: "Copy-paste is disabled!",
      description: "You must type the text manually",
      variant: "destructive",
    });
  };

  const calculateAccuracy = () => {
    const paragraphChars = paragraph.split("");
    const userChars = userInput.split("");
    let correctChars = 0;

    paragraphChars.forEach((char, index) => {
      if (userChars[index] === char) {
        correctChars++;
      }
    });

    return (correctChars / paragraphChars.length) * 100;
  };

  const handleFinish = () => {
    if (userInput.trim() !== paragraph.trim()) {
      toast({
        title: "Text doesn't match!",
        description: "Please type the exact text to finish the race",
        variant: "destructive",
      });
      return;
    }

    if (!startTime) return;

    const timeMs = Date.now() - startTime;
    const accuracy = calculateAccuracy();
    
    onComplete(timeMs, accuracy, userInput);
  };

  const getCharColor = (index: number) => {
    const userChar = userInput[index];
    const correctChar = paragraph[index];

    if (userChar === undefined) return "text-muted-foreground";
    if (userChar === correctChar) return "text-accent";
    return "text-destructive";
  };

  const isComplete = userInput.trim() === paragraph.trim();
  const progress = (userInput.length / paragraph.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-8 h-8 text-secondary text-glow-cyan animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-glow-purple">
              Type Fast!
            </h2>
          </div>
          <p className="text-muted-foreground">
            Type the paragraph below as fast and accurately as you can
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg blur opacity-25"></div>
          <div className="relative bg-card border border-border rounded-lg overflow-hidden">
            <div className="h-2 bg-muted">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-muted rounded-lg p-6 font-mono text-lg leading-relaxed select-none">
                {paragraph.split("").map((char, index) => (
                  <span key={index} className={getCharColor(index)}>
                    {char}
                  </span>
                ))}
              </div>

              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className="w-full h-48 bg-input border border-border rounded-lg p-6 font-mono text-lg leading-relaxed resize-none focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition-all"
                placeholder="Start typing here..."
                spellCheck={false}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Progress: {Math.round(progress)}%</div>
                  <div>Accuracy: {calculateAccuracy().toFixed(1)}%</div>
                </div>

                <Button
                  onClick={handleFinish}
                  disabled={!isComplete}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-bold px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finish Race
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>⚠️ Copy-paste is disabled • Text must match exactly to finish</p>
        </div>
      </div>
    </div>
  );
};

export default TypingRace;
