-- Create game sessions table
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  paragraph TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, active, finished
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create player entries table
CREATE TABLE public.player_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_typing_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  time_taken_ms INTEGER,
  accuracy_percent DECIMAL(5,2),
  words_per_minute DECIMAL(6,2),
  placement INTEGER,
  typed_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for this game)
CREATE POLICY "Anyone can view game sessions" 
ON public.game_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create game sessions" 
ON public.game_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update game sessions" 
ON public.game_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view player entries" 
ON public.player_entries 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create player entries" 
ON public.player_entries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update player entries" 
ON public.player_entries 
FOR UPDATE 
USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_entries;

-- Create indexes for better performance
CREATE INDEX idx_game_sessions_status ON public.game_sessions(status);
CREATE INDEX idx_player_entries_session ON public.player_entries(game_session_id);
CREATE INDEX idx_player_entries_placement ON public.player_entries(placement);