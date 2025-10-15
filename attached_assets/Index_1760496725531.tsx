import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LandingPage from "@/components/LandingPage";
import EntryForm from "@/components/EntryForm";
import WaitingRoom from "@/components/WaitingRoom";
import TypingRace from "@/components/TypingRace";
import ResultsPodium from "@/components/ResultsPodium";
import DevPanel from "@/components/DevPanel";

const GAME_PARAGRAPH = "FeesType is the ultimate coin for speed and skill a crypto that rewards the fastest hands on the keyboard. Unlike other tokens that sit idle in your wallet, FeesType brings competition to the blockchain. The concept is simple: every transaction comes with a fee, and if you're the fastest typer, you win the fees. It's a test of reflexes, precision, and timing turning what's normally just a boring transaction cost into a real-time game of profit. In the world of FeesType, the sharpest typers don't just type fast they earn fast.";

type GameState = "landing" | "dev" | "entry" | "waiting" | "racing" | "results";

interface Player {
  id: string;
  nickname: string;
  wallet_address: string;
  time_taken_ms: number;
  accuracy_percent: number;
  placement: number;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [sessionEndsAt, setSessionEndsAt] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const findValidSession = async () => {
      // Look for an active or waiting session
      const { data: sessions, error } = await supabase
        .from("game_sessions")
        .select("*")
        .in("status", ["waiting", "active"])
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
        return;
      }

      if (sessions && sessions.length > 0) {
        const now = new Date();
        
        // Mark expired sessions as finished
        const expiredSessions = sessions.filter(
          (s) => new Date(s.ends_at) <= now
        );
        
        for (const expiredSession of expiredSessions) {
          await supabase
            .from("game_sessions")
            .update({ status: "finished" })
            .eq("id", expiredSession.id);
        }
        
        // Find the first valid (non-expired) session
        const validSession = sessions.find(
          (s) => new Date(s.ends_at) > now
        );
        
        if (validSession) {
          setCurrentSessionId(validSession.id);
          setSessionEndsAt(validSession.ends_at);
          
          if (validSession.status === "active") {
            setGameState("racing");
          } else if (validSession.status === "waiting") {
            // Don't auto-transition to waiting - stay on landing
            // User needs to manually join via the entry form
          }
        }
      }
      // If no valid session exists, stay on landing page
    };

    findValidSession();
  }, []);

  useEffect(() => {
    if (!currentSessionId) return;

    // Subscribe to player entries
    const playersChannel = supabase
      .channel("player-entries")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_entries",
          filter: `game_session_id=eq.${currentSessionId}`,
        },
        async () => {
          const { data, error } = await supabase
            .from("player_entries")
            .select("*")
            .eq("game_session_id", currentSessionId);

          if (error) {
            console.error("Error fetching players:", error);
            return;
          }

          setPlayerCount(data.length);
          
          // Update players for results
          if (gameState === "results") {
            setPlayers(data as Player[]);
          }
        }
      )
      .subscribe();

    // Subscribe to session changes
    const sessionChannel = supabase
      .channel("game-session")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_sessions",
          filter: `id=eq.${currentSessionId}`,
        },
        (payload) => {
          if (payload.new.status === "active" && gameState === "waiting") {
            setGameState("racing");
          }
        }
      )
      .subscribe();

    // Initial player count fetch
    const fetchPlayerCount = async () => {
      const { data, error } = await supabase
        .from("player_entries")
        .select("*")
        .eq("game_session_id", currentSessionId);

      if (!error && data) {
        setPlayerCount(data.length);
      }
    };

    fetchPlayerCount();

    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [currentSessionId, gameState]);

  const handleEntry = async (wallet: string) => {
    if (!currentSessionId) return;

    const { data: entry, error } = await supabase
      .from("player_entries")
      .insert({
        game_session_id: currentSessionId,
        wallet_address: wallet,
        nickname: wallet.substring(0, 8), // Use first 8 chars of wallet as nickname
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error joining game",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setCurrentPlayerId(entry.id);
    setGameState("waiting");
    
    toast({
      title: "You're in!",
      description: "Wait for the timer to reach zero to start racing",
    });
  };

  const handleRaceStart = async () => {
    if (!currentSessionId) return;

    // Update session status to active
    await supabase
      .from("game_sessions")
      .update({ status: "active" })
      .eq("id", currentSessionId);

    setGameState("racing");
  };

  const handleRaceComplete = async (timeMs: number, accuracy: number, typedText: string) => {
    if (!currentPlayerId || !currentSessionId) return;

    // Calculate WPM
    const minutes = timeMs / 60000;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const wpm = wordsTyped / minutes;

    // Update player entry
    const { error: updateError } = await supabase
      .from("player_entries")
      .update({
        finished_at: new Date().toISOString(),
        time_taken_ms: timeMs,
        accuracy_percent: accuracy,
        words_per_minute: wpm,
        typed_text: typedText,
      })
      .eq("id", currentPlayerId);

    if (updateError) {
      console.error("Error updating player:", updateError);
      return;
    }

    // Calculate placements
    const { data: allPlayers, error: fetchError } = await supabase
      .from("player_entries")
      .select("*")
      .eq("game_session_id", currentSessionId)
      .not("finished_at", "is", null)
      .order("time_taken_ms", { ascending: true });

    if (fetchError || !allPlayers) {
      console.error("Error fetching players:", fetchError);
      return;
    }

    // Update placements
    for (let i = 0; i < allPlayers.length; i++) {
      await supabase
        .from("player_entries")
        .update({ placement: i + 1 })
        .eq("id", allPlayers[i].id);
    }

    // Fetch updated players with placements
    const { data: updatedPlayers } = await supabase
      .from("player_entries")
      .select("*")
      .eq("game_session_id", currentSessionId)
      .not("placement", "is", null)
      .order("placement", { ascending: true });

    if (updatedPlayers) {
      setPlayers(updatedPlayers as Player[]);
    }

    setGameState("results");
    
    toast({
      title: "Race complete!",
      description: `Time: ${(timeMs / 1000).toFixed(2)}s | Accuracy: ${accuracy.toFixed(1)}%`,
    });
  };

  const handlePlayAgain = () => {
    setGameState("landing");
    setCurrentSessionId(null);
    setCurrentPlayerId(null);
    setPlayerCount(0);
    setSessionEndsAt("");
    setPlayers([]);
    
    // Trigger new session creation
    window.location.reload();
  };

  if (gameState === "landing") {
    return (
      <LandingPage 
        onDevAccess={() => setGameState("dev")} 
      />
    );
  }

  if (gameState === "dev") {
    return <DevPanel onClose={() => setGameState("landing")} />;
  }

  if (gameState === "entry") {
    return <EntryForm onSubmit={handleEntry} />;
  }

  if (gameState === "waiting" && sessionEndsAt) {
    return (
      <WaitingRoom
        playerCount={playerCount}
        endsAt={sessionEndsAt}
        onStart={handleRaceStart}
      />
    );
  }

  if (gameState === "racing") {
    return (
      <TypingRace
        paragraph={GAME_PARAGRAPH}
        onComplete={handleRaceComplete}
      />
    );
  }

  if (gameState === "results" && currentPlayerId) {
    return (
      <ResultsPodium
        players={players}
        currentPlayerId={currentPlayerId}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return null;
};

export default Index;
