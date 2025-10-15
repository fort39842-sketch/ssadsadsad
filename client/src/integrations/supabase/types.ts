export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      game_sessions: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          paragraph: string
          started_at: string
          status: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          paragraph: string
          started_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          paragraph?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      player_entries: {
        Row: {
          accuracy_percent: number | null
          created_at: string
          finished_at: string | null
          game_session_id: string
          id: string
          joined_at: string
          nickname: string
          placement: number | null
          started_typing_at: string | null
          time_taken_ms: number | null
          typed_text: string | null
          wallet_address: string
          words_per_minute: number | null
        }
        Insert: {
          accuracy_percent?: number | null
          created_at?: string
          finished_at?: string | null
          game_session_id: string
          id?: string
          joined_at?: string
          nickname: string
          placement?: number | null
          started_typing_at?: string | null
          time_taken_ms?: number | null
          typed_text?: string | null
          wallet_address: string
          words_per_minute?: number | null
        }
        Update: {
          accuracy_percent?: number | null
          created_at?: string
          finished_at?: string | null
          game_session_id?: string
          id?: string
          joined_at?: string
          nickname?: string
          placement?: number | null
          started_typing_at?: string | null
          time_taken_ms?: number | null
          typed_text?: string | null
          wallet_address?: string
          words_per_minute?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_entries_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
