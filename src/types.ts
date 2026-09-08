export interface User {
  id: string;
  email: string;
  role: "public" | "editor" | "owner";
}

export interface Sport {
  id: string;
  name: string;
  gender: string;
  season_type: string;
  is_active: boolean;
  created_at: string;
}

export interface Season {
  id: string;
  sport_id: string;
  year: number;
  label: string;
  is_current: boolean;
  created_at: string;
}

export interface Team {
  id: string;
  sport_id: string;
  name: string;
  school: string;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  jersey_number: string;
  position: string;
  year: "FR" | "SO" | "JR" | "SR";
  team_id: string;
  photo_url: string;
  bio: string;
  is_claimed: boolean;
  claimed_by_user_id: string | null;
  is_alumni: boolean;
  is_recruiting_profile_active: boolean;
  created_at: string;
}

export interface Game {
  id: string;
  sport_id: string;
  season_id: string;
  home_team_id: string;
  away_team_id: string;
  game_date: string;
  home_score: number;
  away_score: number;
  location: string;
  home_or_away: "Home" | "Away" | "Neutral";
  video_url: string | null;
  video_type: string | null;
  status: "scheduled" | "live" | "final";
  live_score_home: number;
  live_score_away: number;
  created_at: string;
}

export interface PlayerGameStat {
  id: string;
  game_id: string;
  player_id: string;
  stat_key: string;
  stat_value: number;
  created_at: string;
}

export interface TeamGameStat {
  id: string;
  game_id: string;
  team_id: string;
  stat_key: string;
  stat_value: number;
  created_at: string;
}

export interface RecordEntry {
  id: string;
  sport_id: string;
  stat_key: string;
  record_type: "single_game" | "single_season";
  value: number;
  player_id: string;
  player_name: string;
  opponent_name: string;
  game_id: string | null;
  game_date: string | null;
  season_id: string;
  set_at: string;
}

export interface LeaderboardEntry {
  id: string;
  sport_id: string;
  season_id: string;
  stat_key: string;
  player_id: string;
  player_name: string;
  player_jersey: string;
  player_position: string;
  value: number;
  rank: number;
  updated_at: string;
}

export interface Correction {
  id: string;
  player_id: string;
  player_name?: string;
  game_id: string;
  game_label?: string;
  stat_key: string;
  current_value: number;
  suggested_value: number;
  reason: string;
  submitted_by: string;
  submitter_email?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
}

export interface Claim {
  id: string;
  player_id: string;
  player_name: string;
  user_id: string;
  user_email: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
}

export interface PhotographerLink {
  id: string;
  game_id: string;
  drive_url: string;
  photographer_name: string;
  submitted_by: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ScrapingConfig {
  platform: string;
  meet_url: string;
  cron_schedule: string;
  last_scraped_at: string | null;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
  sport_id: string | null;
  created_at: string;
}
