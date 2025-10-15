import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import LandingPage from "@/components/LandingPage";
import EntryForm from "@/components/EntryForm";
import WaitingRoom from "@/components/WaitingRoom";
import TypingRace from "@/components/TypingRace";
import Results from "@/components/Results";
import DevPanel from "@/components/DevPanel";

type GameStatus = "waiting" | "active" | "finished";
type AppState = "landing" | "entry" | "waiting" | "typing" | "results";

interface Game {
  id: string;
  paragraph: string;
  status: GameStatus;
  ends_at: string;
}

interface Player {
  id: string;
  nickname: string;
  wallet_address: string;
  game_session_id: string;
  time_taken_ms: number | null;
  accuracy_percent: number | null;
  finished_at: string | null;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveGame();
    
    const gamesChannel = supabase
      .channel("games-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_sessions" },
        () => {
          fetchActiveGame();
        }
      )
      .subscribe();

    const playersChannel = supabase
      .channel("players-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_entries" },
        (payload) => {
          if (currentGame) {
            fetchPlayers(currentGame.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gamesChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [currentGame?.id]);

  const fetchActiveGame = async () => {
    const { data, error } = await supabase
      .from("game_sessions")
      .select("*")
      .in("status", ["waiting", "active"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching game:", error);
      return;
    }

    setCurrentGame(data);
    
    if (data) {
      fetchPlayers(data.id);
      
      if (data.status === "active" && appState === "waiting") {
        setAppState("typing");
      }
    }
  };

  const fetchPlayers = async (gameId: string) => {
    const { data, error } = await supabase
      .from("player_entries")
      .select("*")
      .eq("game_session_id", gameId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching players:", error);
      return;
    }

    setPlayers(data || []);
  };

  const handleCreateGame = async (waitTimeSeconds: number, paragraph: string) => {
    const endsAt = new Date(Date.now() + waitTimeSeconds * 1000).toISOString();
    
    const { data, error } = await supabase
      .from("game_sessions")
      .insert({
        paragraph,
        status: "waiting",
        ends_at: endsAt,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    setCurrentGame(data);
  };

  const handleJoinGame = () => {
    if (!currentGame) return;
    setAppState("entry");
  };

  const handleEntry = async (nickname: string, wallet: string) => {
    if (!currentGame) return;

    const { data, error } = await supabase
      .from("player_entries")
      .insert({
        game_session_id: currentGame.id,
        nickname,
        wallet_address: wallet,
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

    setCurrentPlayer(data);
    setAppState("waiting");
  };

  const handleRaceStart = () => {
    setAppState("typing");
  };

  const handleRaceComplete = async (timeMs: number, accuracy: number, typedText: string) => {
    if (!currentPlayer) return;

    const { error } = await supabase
      .from("player_entries")
      .update({
        time_taken_ms: timeMs,
        accuracy_percent: accuracy,
        typed_text: typedText,
        finished_at: new Date().toISOString(),
      })
      .eq("id", currentPlayer.id);

    if (error) {
      toast({
        title: "Error submitting result",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await fetchPlayers(currentPlayer.game_session_id);
    setAppState("results");
  };

  const handleBackToLanding = () => {
    setAppState("landing");
    setCurrentGame(null);
    setCurrentPlayer(null);
    setPlayers([]);
    fetchActiveGame();
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      {appState === "landing" && (
        <LandingPage
          onDevAccess={() => setShowDevPanel(true)}
          onJoinGame={currentGame?.status === "waiting" ? handleJoinGame : undefined}
          hasActiveGame={!!currentGame}
          gameEndsAt={currentGame?.ends_at}
          playerCount={players.length}
        />
      )}

      {appState === "entry" && <EntryForm onSubmit={handleEntry} />}

      {appState === "waiting" && currentGame && (
        <WaitingRoom
          playerCount={players.length}
          endsAt={currentGame.ends_at}
          onStart={handleRaceStart}
        />
      )}

      {appState === "typing" && currentGame && (
        <TypingRace
          paragraph={currentGame.paragraph}
          onComplete={handleRaceComplete}
        />
      )}

      {appState === "results" && currentPlayer && (
        <Results
          players={players}
          currentPlayerId={currentPlayer.id}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {showDevPanel && (
        <DevPanel
          onClose={() => setShowDevPanel(false)}
          onCreateGame={handleCreateGame}
        />
      )}

      <Toaster />
    </div>
  );
}
