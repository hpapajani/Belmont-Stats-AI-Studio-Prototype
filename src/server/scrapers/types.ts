export interface ScraperConfig {
  id: string;
  sport_id: string;
  platform: 'maxpreps' | 'milesplit' | 'athletic_net' | 'miaa';
  target_url: string;
  scrape_type: 'schedule' | 'roster' | 'meet_results';
  cron_schedule?: string;
  is_active: boolean;
  last_run_at?: string;
  last_run_status?: 'success' | 'partial' | 'failed';
  last_run_count: number;
  created_by?: string;
  created_at: string;
}

export interface ScraperResult {
  rows_inserted: number;
  rows_updated: number;
  rows_skipped: number;
  errors: string[];
  affected_player_ids: string[];
  affected_sport_id: string;
  affected_season_id: string;
  raw_payload?: Record<string, any>;
}
