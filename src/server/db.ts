import fs from "fs";
import path from "path";

// Local file database for the ultimate free and self-contained experience.
// Seeds realistic data on first start to make the app ready to play.

const DB_PATH = path.join(process.cwd(), "db.json");

export interface db_types {
  sports: any[];
  seasons: any[];
  teams: any[];
  players: any[];
  games: any[];
  player_game_stats: any[];
  team_game_stats: any[];
  records: any[];
  leaderboard_cache: any[];
  users: any[];
  player_claims: any[];
  corrections: any[];
  photographer_links: any[];
  page_views: any[];
  csv_downloads: any[];
  search_queries: any[];
  favorites: any[];
  notifications: any[];
  scraping_config: any;
  calendar_events: any[];
  scraper_configs: any[];
  scraper_logs: any[];
}

// Initial Seed Data Creator
function createInitialSeedData(): db_types {
  const sportId = "f47ac10b-58cc-4372-a567-0e02b2c3d479"; // Football
  const seasonId = "d73bc10b-58cc-4372-a567-0e02b2c3d480"; // 2025 Season
  const bHS_TeamId = "a2cb10b-58cc-4372-a567-0e02b2c3d481"; // Belmont High
  const arlingtonTeamId = "b3cb10b-58cc-4372-a567-0e02b2c3d482"; // Arlington
  const winchesterTeamId = "c4cb10b-58cc-4372-a567-0e02b2c3d483"; // Winchester
  const lexingtonTeamId = "d5cb10b-58cc-4372-a567-0e02b2c3d484"; // Lexington

  const sports = [
    { id: sportId, name: "Football", gender: "Boys", season_type: "Fall", is_active: true, created_at: new Date().toISOString() },
    { id: "s2", name: "Boys Basketball", gender: "Boys", season_type: "Winter", is_active: false, created_at: new Date().toISOString() },
    { id: "s3", name: "Girls Basketball", gender: "Girls", season_type: "Winter", is_active: false, created_at: new Date().toISOString() },
    { id: "s4", name: "Boys Swimming", gender: "Boys", season_type: "Winter", is_active: false, created_at: new Date().toISOString() },
    { id: "s5", name: "Boys Indoor Track", gender: "Boys", season_type: "Winter", is_active: false, created_at: new Date().toISOString() },
    { id: "s6", name: "Girls Indoor Track", gender: "Girls", season_type: "Winter", is_active: false, created_at: new Date().toISOString() },
    { id: "s7", name: "Boys Outdoor Track", gender: "Boys", season_type: "Spring", is_active: false, created_at: new Date().toISOString() },
    { id: "s8", name: "Girls Outdoor Track", gender: "Girls", season_type: "Spring", is_active: false, created_at: new Date().toISOString() },
    { id: "s9", name: "Baseball", gender: "Boys", season_type: "Spring", is_active: false, created_at: new Date().toISOString() },
    { id: "s10", name: "Girls swim and dive", gender: "Girls", season_type: "Fall", is_active: false, created_at: new Date().toISOString() }
  ];

  const seasons = [
    { id: seasonId, sport_id: sportId, year: 2025, label: "2025 Season", is_current: true, created_at: new Date().toISOString() },
    ...["s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"].map(sid => ({
      id: `season_${sid}`,
      sport_id: sid,
      year: 2026,
      label: sid === "s10" ? "2025 Fall Season" : (sid.match(/s[2-6]/) ? "2025-2026 Winter Season" : "2026 Spring Season"),
      is_current: true,
      created_at: new Date().toISOString()
    }))
  ];

  const teams = [
    { id: bHS_TeamId, sport_id: sportId, name: "Belmont Marauders", school: "Belmont High School", created_at: new Date().toISOString() },
    { id: arlingtonTeamId, sport_id: sportId, name: "Arlington Spy Ponders", school: "Arlington High School", created_at: new Date().toISOString() },
    { id: winchesterTeamId, sport_id: sportId, name: "Winchester Sachems", school: "Winchester High School", created_at: new Date().toISOString() },
    { id: lexingtonTeamId, sport_id: sportId, name: "Lexington Minutemen", school: "Lexington High School", created_at: new Date().toISOString() }
  ];

  const opponentsDef = [
    { suffix: "arlington", school: "Arlington High School", name: "Arlington Spy Ponders" },
    { suffix: "winchester", school: "Winchester High School", name: "Winchester Sachems" },
    { suffix: "lexington", school: "Lexington High School", name: "Lexington Minutemen" },
    { suffix: "woburn", school: "Woburn High School", name: "Woburn Tanners" }
  ];

  ["s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"].forEach((sid) => {
    teams.push({
      id: `team_belmont_${sid}`,
      sport_id: sid,
      name: "Belmont Marauders",
      school: "Belmont High School",
      created_at: new Date().toISOString()
    });
    opponentsDef.forEach((opp) => {
      teams.push({
        id: `team_opp_${opp.suffix}_${sid}`,
        sport_id: sid,
        name: opp.name,
        school: opp.school,
        created_at: new Date().toISOString()
      });
    });
  });

  const players: any[] = [
    { id: "p1", name: "Danny Mara", jersey_number: "12", position: "QB", year: "SR", team_id: bHS_TeamId, photo_url: "", bio: "Danny Mara is a senior quarterback leading the Belmont Marauders with poise and precision.", is_claimed: true, claimed_by_user_id: "u_player1", is_alumni: false, is_recruiting_profile_active: false, created_at: new Date().toISOString() },
    { id: "p2", name: "Tyler Chen", jersey_number: "5", position: "RB", year: "SR", team_id: bHS_TeamId, photo_url: "", bio: "Four-year varsity running back.", is_claimed: false, claimed_by_user_id: null, is_alumni: false, is_recruiting_profile_active: false, created_at: new Date().toISOString() },
    { id: "p3", name: "Marcus Vance", jersey_number: "84", position: "WR", year: "JR", team_id: bHS_TeamId, photo_url: "", bio: "Highly athletic wide receiver.", is_claimed: false, claimed_by_user_id: null, is_alumni: false, is_recruiting_profile_active: false, created_at: new Date().toISOString() },
    { id: "p4", name: "Sam O'Neill", jersey_number: "52", position: "LB", year: "SR", team_id: bHS_TeamId, photo_url: "", bio: "Sam is the defensive captain of the Marauders.", is_claimed: false, claimed_by_user_id: null, is_alumni: false, is_recruiting_profile_active: false, created_at: new Date().toISOString() },
    { id: "p5", name: "Leo Martinez", jersey_number: "81", position: "TE", year: "SO", team_id: bHS_TeamId, photo_url: "", bio: "Sophomore tight end and punter.", is_claimed: false, claimed_by_user_id: null, is_alumni: false, is_recruiting_profile_active: false, created_at: new Date().toISOString() },
    { id: "p6", name: "Zach Brody", jersey_number: "22", position: "CB", year: "JR", team_id: bHS_TeamId, photo_url: "", bio: "Lockdown cornerback and special teams placekicker.", is_claimed: false, claimed_by_user_id: null, is_alumni: false, is_recruiting_profile_active: false, created_at: new Date().toISOString() },
    { id: "p7", name: "Henry Stone", jersey_number: "74", position: "OL", year: "SR", team_id: bHS_TeamId, photo_url: "", bio: "Legendary offensive tackle.", is_claimed: false, claimed_by_user_id: null, is_alumni: true, is_recruiting_profile_active: false, created_at: new Date().toISOString() },
    { id: "p8", name: "Jacob Wilde", jersey_number: "10", position: "WR", year: "FR", team_id: bHS_TeamId, photo_url: "", bio: "Outstanding freshman wideout.", is_claimed: false, claimed_by_user_id: null, is_alumni: false, is_recruiting_profile_active: false, created_at: new Date().toISOString() }
  ];

  const rosterDefinition: { [sid: string]: { name: string, num: string, pos: string, yr: string, bio: string }[] } = {
    s2: [
      { name: "Colby Duggan", num: "11", pos: "F", yr: "SR", bio: "All-League star player, lethal mid-range shooter." },
      { name: "Daniel Yardemian", num: "3", pos: "G", yr: "SR", bio: "Outstanding facilitator, fast breaks maestro." },
      { name: "Preston Jackson-Stephens", num: "24", pos: "C", yr: "JR", bio: "Rim protective anchor." },
      { name: "Kevin Logan", num: "5", pos: "G", yr: "SR", bio: "Lockdown playmaker." },
      { name: "Markus Bailey", num: "14", pos: "F", yr: "JR", bio: "Athletic forward, incredible on defensive rebounds." },
      { name: "Yovanni Gedeon", num: "2", pos: "G", yr: "SO", bio: "Sophomore speedster guard and sharpshooter." },
      { name: "Kiernan Fitzgerald", num: "10", pos: "G", yr: "JR", bio: "Sharpshooting facilitator, high basketball IQ." },
      { name: "Fletcher Chacon", num: "15", pos: "F", yr: "SR", bio: "Veteran frontcourt contributor, tough defender." }
    ],
    s3: [
      { name: "Nora Slesara", num: "12", pos: "G", yr: "SR", bio: "Senior guard with floor general instincts." },
      { name: "Camille Toomey", num: "14", pos: "G", yr: "SR", bio: "Highly composed senior shooter of Belmont." },
      { name: "Ellie Shea", num: "22", pos: "F", yr: "JR", bio: "Acclaimed dual-sport varsity star." },
      { name: "Sammy Toomey", num: "10", pos: "G", yr: "SO", bio: "Sophomore guard, fast transitions and defensive steals specialist." },
      { name: "Delaney Devoy", num: "4", pos: "G", yr: "JR", bio: "Tenacious defender and three-point specialist." },
      { name: "Reece Duggan", num: "23", pos: "F", yr: "SO", bio: "Versatile forward, dominant in paint contests." },
      { name: "Claire Jakes", num: "32", pos: "C", yr: "SR", bio: "Veteran post player with excellent rebounding." }
    ],
    s4: [
      { name: "Evan Dong", num: "N/A", pos: "Free/Fly", yr: "SR", bio: "School record challenger in sprints." },
      { name: "Arthur Chien", num: "N/A", pos: "Breast/IM", yr: "SR", bio: "Middlesex champion in breaststroke." },
      { name: "Gregory Koutrelakos", num: "N/A", pos: "Back/IM", yr: "JR", bio: "Versatile IM swimmer, exceptional turn technique." },
      { name: "Eren Ozcan", num: "N/A", pos: "Free Distance", yr: "SR", bio: "Stellar freestyle distance specialist, Middlesex division top finisher." },
      { name: "Matthew Chien", num: "N/A", pos: "Back/Fly", yr: "SO", bio: "Young rising star in butterfly sprints." }
    ],
    s5: [
      { name: "Jared Knight", num: "N/A", pos: "Sprints", yr: "SR", bio: "Middlesex sprint leader. Excels in 55m and 300m." },
      { name: "Austin Lasell", num: "N/A", pos: "Distance", yr: "SR", bio: "Elite 1-Mile champion representing Belmont." },
      { name: "Thomas Sideris", num: "N/A", pos: "Mid-Distance", yr: "JR", bio: "Strong 600m run athlete." },
      { name: "James Harrison", num: "N/A", pos: "Hurdles", yr: "SR", bio: "Pristine technique in 55m hurdles, podium finisher." },
      { name: "Bryce Cooper", num: "N/A", pos: "Shot Put", yr: "SR", bio: "Elite thrower driving team points in strength events." },
      { name: "Ethan Chang", num: "N/A", pos: "High Jump", yr: "JR", bio: "Incredible vertical leaper clearing heights." },
      { name: "Nolan O'Hara", num: "N/A", pos: "Mid-Distance", yr: "SO", bio: "Dedicated 1000m and mile runner with great pacing." },
      { name: "Mark Sullivan", num: "N/A", pos: "Sprints", yr: "JR", bio: "Reliable 300m runner and relay leg anchor." }
    ],
    s6: [
      { name: "Ellie Shea", num: "N/A", pos: "Distance", yr: "SR", bio: "State champion distance runner, holds records in 1 Mile and 2 Mile." },
      { name: "Olivia von Kleist", num: "N/A", pos: "Sprints", yr: "JR", bio: "Talented blocks runner dominating dashes." },
      { name: "Clara Taylor", num: "N/A", pos: "Mid-Distance", yr: "SR", bio: "Solid 1000m specialist and relay leader." },
      { name: "Mia Carson", num: "N/A", pos: "High Jump / Hurdles", yr: "SR", bio: "Versatile athlete scoring highly across events." },
      { name: "Sophia MacDonald", num: "N/A", pos: "Distance", yr: "JR", bio: "Excellent distance runner supporting 2 Mile standings." },
      { name: "Julia Lando", num: "N/A", pos: "Shot Put", yr: "SR", bio: "Top girl thrower leading the Marauders' field events." }
    ],
    s7: [
      { name: "Jared Knight", num: "N/A", pos: "Sprints / Relays", yr: "SR", bio: "Dominates outdoor 100m, 200m." },
      { name: "Austin Lasell", num: "N/A", pos: "Endurance", yr: "SR", bio: "Belmont's premium 1 Mile and 2 Mile outdoor pacemaker." },
      { name: "Thomas Sideris", num: "N/A", pos: "800m Run", yr: "JR", bio: "Middlesex division 800m specialist." },
      { name: "Noah Miller", num: "N/A", pos: "Hurdles / Jumps", yr: "SR", bio: "Excellent 110m hurdles and long jump champion." },
      { name: "Bryce Cooper", num: "N/A", pos: "Throws / Shot Put", yr: "SR", bio: "Senior captain dominating shot put and discus events." },
      { name: "James Harrison", num: "N/A", pos: "Sprints", yr: "SR", bio: "Lethal 400m dash runner and relay engine." }
    ],
    s8: [
      { name: "Ellie Shea", num: "N/A", pos: "Distance / Mile", yr: "SR", bio: "National-level distance contender sweeping outdoor events." },
      { name: "Olivia von Kleist", num: "N/A", pos: "100m / 200m Sprints", yr: "JR", bio: "Powerhouse outdoor sprint specialist." },
      { name: "Clara Taylor", num: "N/A", pos: "800m / Mid-Distance", yr: "SR", bio: "Middlesex standout in 800m run." },
      { name: "Sophia MacDonald", num: "N/A", pos: "3200m / Distance", yr: "JR", bio: "Composed long-distance outdoor competitor." },
      { name: "Rose Miller", num: "N/A", pos: "Javelin / Discus", yr: "SR", bio: "Top-ranked Middlesex javelin thrower with powerful technique." },
      { name: "Fiona Murray", num: "N/A", pos: "Hurdles", yr: "SO", bio: "Rising star in 100m and 400m outdoor hurdles." }
    ],
    s9: [
      { name: "Jason Reynolds", num: "8", pos: "P / SS", yr: "SR", bio: "Belmont's starting pitching ace, sharp fastball." },
      { name: "Ryan Fitzgerald", num: "10", pos: "3B", yr: "SR", bio: "Powerhouse third baseman." },
      { name: "Pete Richardson", num: "3", pos: "C", yr: "SR", bio: "Calm and tactical game manager backstop catcher." },
      { name: "Zach Brody", num: "22", pos: "OF", yr: "JR", bio: "Exceptional speed, lock-down centerfielder." },
      { name: "Luke Reynolds", num: "4", pos: "OF / P", yr: "SO", bio: "Sophomore outfielder and strong relief pitcher." },
      { name: "Christopher Sullivan", num: "7", pos: "2B", yr: "SR", bio: "Reliable infielder, outstanding contact hitter." }
    ],
    s10: [
      { name: "Maya Patel", num: "N/A", pos: "Free/Back", yr: "SR", bio: "Outstanding senior backstroke swimmer." },
      { name: "Chloe Sullivan", num: "N/A", pos: "Breast/Fly", yr: "JR", bio: "Leads the butterfly sprints team." },
      { name: "Sophia Yang", num: "N/A", pos: "IM/Diving", yr: "SR", bio: "Middlesex champion in 1m dive and 200 IM." },
      { name: "Isabella Rossi", num: "N/A", pos: "Free Distance", yr: "SO", bio: "Elite 500yd distance specialist." },
      { name: "Katelyn Zheng", num: "N/A", pos: "Diving", yr: "FR", bio: "Remarkable rookie diver scoring high point averages." }
    ]
  };

  Object.keys(rosterDefinition).forEach((sid) => {
    rosterDefinition[sid].forEach((p, idx) => {
      players.push({
        id: `p_${sid}_${idx + 1}`,
        name: p.name,
        jersey_number: p.num,
        position: p.pos,
        year: p.yr,
        team_id: `team_belmont_${sid}`,
        photo_url: "",
        bio: p.bio,
        is_claimed: false,
        claimed_by_user_id: null,
        is_alumni: false,
        is_recruiting_profile_active: false,
        created_at: new Date().toISOString()
      });
    });
  });

  const game1Id = "g1_belmont_arlington";
  const game2Id = "g2_belmont_winchester";
  const game3Id = "g3_belmont_lexington";

  const games: any[] = [];
  const sportsIds = [sportId, "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"];

  sportsIds.forEach((sid) => {
    const belmontTeamId = sid === sportId ? bHS_TeamId : `team_belmont_${sid}`;
    const yearDatePrefix = sid === sportId || sid === "s10" ? "2025" : "2026";
    const baseMonthFinal1 = sid === sportId || sid === "s10" ? "10" : "01";
    const baseMonthFinal2 = sid === sportId || sid === "s10" ? "11" : "02";
    
    // 1. Home Game Final (Result)
    games.push({
      id: `game_${sid}_1`,
      sport_id: sid,
      season_id: sid === sportId ? seasonId : `season_${sid}`,
      home_team_id: belmontTeamId,
      away_team_id: `team_opp_arlington_${sid}`,
      game_date: `${yearDatePrefix}-${baseMonthFinal1}-15`,
      home_score: sid === "s2" || sid === "s3" ? 72 : (sid === "s6" || sid === "s5" ? 64 : (sid === "s4" || sid === "s10" ? 94 : 5)),
      away_score: sid === "s2" || sid === "s3" ? 68 : (sid === "s6" || sid === "s5" ? 56 : (sid === "s4" || sid === "s10" ? 82 : 3)),
      location: sid === "s2" || sid === "s3" ? "Belmont Gym" : (sid.match(/Swimming|swim/) ? "Belmont High Pool" : "Harris Field"),
      home_or_away: "Home",
      video_url: sid === sportId ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : null,
      video_type: sid === sportId ? "YouTube" : null,
      media_url: null,
      media_type: null,
      is_ai_generated: false,
      status: "final",
      live_score_home: sid === "s2" || sid === "s3" ? 72 : (sid === "s6" || sid === "s5" ? 64 : (sid === "s4" || sid === "s10" ? 94 : 5)),
      live_score_away: sid === "s2" || sid === "s3" ? 68 : (sid === "s6" || sid === "s5" ? 56 : (sid === "s4" || sid === "s10" ? 82 : 3)),
      opponent_name: "Arlington Spy Ponders",
      created_at: new Date().toISOString()
    });

    // 2. Away Game Final (Result)
    games.push({
      id: `game_${sid}_2`,
      sport_id: sid,
      season_id: sid === sportId ? seasonId : `season_${sid}`,
      home_team_id: `team_opp_winchester_${sid}`,
      away_team_id: belmontTeamId,
      game_date: `${yearDatePrefix}-${baseMonthFinal2}-04`,
      home_score: sid === "s2" || sid === "s3" ? 58 : (sid === "s5" || sid === "s6" ? 48 : (sid === "s4" || sid === "s10" ? 72 : 2)),
      away_score: sid === "s2" || sid === "s3" ? 65 : (sid === "s5" || sid === "s6" ? 62 : (sid === "s4" || sid === "s10" ? 98 : 6)),
      location: "Winchester Facilities",
      home_or_away: "Away",
      video_url: null,
      video_type: null,
      media_url: null,
      media_type: null,
      is_ai_generated: false,
      status: "final",
      live_score_home: sid === "s2" || sid === "s3" ? 58 : (sid === "s5" || sid === "s6" ? 48 : (sid === "s4" || sid === "s10" ? 72 : 2)),
      live_score_away: sid === "s2" || sid === "s3" ? 65 : (sid === "s5" || sid === "s6" ? 62 : (sid === "s4" || sid === "s10" ? 98 : 6)),
      opponent_name: "Winchester Sachems",
      created_at: new Date().toISOString()
    });

    // 3. Game with NO score recorded (Schedule)
    games.push({
      id: `game_${sid}_3`,
      sport_id: sid,
      season_id: sid === sportId ? seasonId : `season_${sid}`,
      home_team_id: belmontTeamId,
      away_team_id: `team_opp_lexington_${sid}`,
      game_date: sid === sportId || sid === "s10" ? "2025-11-18" : "2026-05-15",
      home_score: null,
      away_score: null,
      location: sid.match(/Swimming|swim/) ? "Belmont High Pool" : "Harris High Ground",
      home_or_away: "Home",
      video_url: null,
      video_type: null,
      media_url: null,
      media_type: null,
      is_ai_generated: false,
      status: "scheduled",
      live_score_home: null,
      live_score_away: null,
      opponent_name: "Lexington Minutemen",
      created_at: new Date().toISOString()
    });

    // 4. Game with NO score recorded (Schedule)
    games.push({
      id: `game_${sid}_4`,
      sport_id: sid,
      season_id: sid === sportId ? seasonId : `season_${sid}`,
      home_team_id: `team_opp_woburn_${sid}`,
      away_team_id: belmontTeamId,
      game_date: sid === sportId || sid === "s10" ? "2025-11-27" : "2026-06-01",
      home_score: null,
      away_score: null,
      location: "Woburn High Ground",
      home_or_away: "Away",
      video_url: null,
      video_type: null,
      media_url: null,
      media_type: null,
      is_ai_generated: false,
      status: "scheduled",
      live_score_home: null,
      live_score_away: null,
      opponent_name: "Woburn Tanners",
      created_at: new Date().toISOString()
    });
  });

  const player_game_stats: any[] = [];
  let pgsIdCounter = 1;

  const sportsList = [
    { id: sportId, type: "Football" },
    { id: "s2", type: "Basketball" },
    { id: "s3", type: "Basketball" },
    { id: "s4", type: "Swimming" },
    { id: "s5", type: "Track" },
    { id: "s6", type: "Track" },
    { id: "s7", type: "Track" },
    { id: "s8", type: "Track" },
    { id: "s9", type: "Baseball" },
    { id: "s10", type: "Swimming" }
  ];

  sportsList.forEach((sportInfo) => {
    const sid = sportInfo.id;
    const type = sportInfo.type;
    const sportPlayers = players.filter(p => p.team_id === (sid === sportId ? bHS_TeamId : `team_belmont_${sid}`));

    ["1", "2"].forEach((gNum) => {
      const gId = `game_${sid}_${gNum}`;

      if (type === "Football") {
        sportPlayers.forEach((p) => {
          if (p.name === "Danny Mara") {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "passing_completions", stat_value: gNum === "1" ? 18 : 12 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "passing_attempts", stat_value: gNum === "1" ? 25 : 22 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "passing_yards", stat_value: gNum === "1" ? 240 : 180 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "passing_touchdowns", stat_value: gNum === "1" ? 3 : 1 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "passing_interceptions", stat_value: gNum === "1" ? 1 : 2 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "passing_longest", stat_value: gNum === "1" ? 45 : 38 }
            );
          } else if (p.name === "Tyler Chen") {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "rushing_carries", stat_value: gNum === "1" ? 16 : 14 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "rushing_yards", stat_value: gNum === "1" ? 115 : 85 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "rushing_touchdowns", stat_value: gNum === "1" ? 1 : 1 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "rushing_longest", stat_value: gNum === "1" ? 28 : 20 }
            );
          } else if (p.name === "Marcus Vance") {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "receiving_receptions", stat_value: gNum === "1" ? 8 : 6 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "receiving_targets", stat_value: gNum === "1" ? 11 : 9 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "receiving_yards", stat_value: gNum === "1" ? 135 : 110 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "receiving_touchdowns", stat_value: gNum === "1" ? 2 : 0 }
            );
          } else if (p.name === "Sam O'Neill") {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "defense_tackles", stat_value: gNum === "1" ? 12 : 9 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "defense_sacks", stat_value: gNum === "1" ? 1.5 : 0.5 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "defense_interceptions", stat_value: 0 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "defense_fumble_recoveries", stat_value: gNum === "1" ? 1 : 0 }
            );
          } else if (p.name === "Zach Brody") {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "defense_tackles", stat_value: gNum === "1" ? 3 : 5 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "defense_interceptions", stat_value: gNum === "1" ? 1 : 0 }
            );
          }
        });
      }

      else if (type === "Basketball") {
        sportPlayers.forEach((p, idx) => {
          let pts = 10 + (idx * 3) + (gNum === "1" ? 2 : -1);
          let ast = 1 + (idx % 3) + (gNum === "1" ? 2 : 0);
          let reb = 2 + (idx % 4) + (gNum === "1" ? 1 : 0);
          let stl = idx % 2;
          let blk = idx % 3 === 0 ? 1 : 0;

          player_game_stats.push(
            { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "points", stat_value: pts },
            { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "assists", stat_value: ast },
            { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "rebounds", stat_value: reb },
            { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "steals", stat_value: stl },
            { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "blocks", stat_value: blk }
          );
        });
      }

      else if (type === "Swimming") {
        sportPlayers.forEach((p, idx) => {
          let pts = 6 + (idx * 2) - (gNum === "1" ? 0 : 2);
          player_game_stats.push(
            { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "points", stat_value: pts }
          );

          if (idx === 0) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "50yd_Freestyle", stat_value: gNum === "1" ? 21.84 : 22.02 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "100yd_Freestyle", stat_value: gNum === "1" ? 48.62 : 49.12 }
            );
          } else if (idx === 1) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "100yd_Breaststroke", stat_value: gNum === "1" ? 60.12 : 61.40 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "200yd_IM", stat_value: gNum === "1" ? 122.50 : 124.80 }
            );
          } else if (idx === 2) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "100yd_Backstroke", stat_value: gNum === "1" ? 54.80 : 55.40 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "200yd_IM", stat_value: gNum === "1" ? 126.10 : 128.20 }
            );
          } else if (idx === 3) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "500yd_Freestyle", stat_value: gNum === "1" ? 285.5 : 290.1 }
            );
          } else if (idx === 4) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "100yd_Butterfly", stat_value: gNum === "1" ? 53.40 : 54.10 }
            );
          }
        });
      }

      else if (type === "Track") {
        sportPlayers.forEach((p, idx) => {
          let pts = 5 + (idx % 3) * 2;
          player_game_stats.push(
            { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "points", stat_value: pts }
          );

          if (idx === 0) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: sid.match(/s5|s6/) ? "55m_Dash" : "100m_Dash", stat_value: sid.match(/s5|s6/) ? 6.64 : 10.92 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: sid.match(/s5|s6/) ? "300m_Dash" : "200m_Dash", stat_value: sid.match(/s5|s6/) ? 36.50 : 22.10 }
            );
          } else if (idx === 1) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "1_Mile_Run", stat_value: gNum === "1" ? 265.40 : 272.10 }
            );
          } else if (idx === 2) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: sid.match(/s5|s6/) ? "600m_Run" : "800m_Run", stat_value: sid.match(/s5|s6/) ? 84.80 : 114.20 }
            );
          } else if (idx === 3) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: sid.match(/s5|s6/) ? "55m_Hurdles" : "110m_Hurdles", stat_value: sid.match(/s5|s6/) ? 8.02 : 15.12 }
            );
          } else if (idx === 4) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "Shot_Put", stat_value: gNum === "1" ? 48.25 : 46.80 }
            );
          } else if (idx === 5) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "High_Jump", stat_value: gNum === "1" ? 5.80 : 5.60 }
            );
          }
        });
      }

      else if (type === "Baseball") {
        sportPlayers.forEach((p, idx) => {
          if (idx === 0) {
            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "strikeouts_thrown", stat_value: gNum === "1" ? 9 : 11 },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "innings_pitched", stat_value: gNum === "1" ? 7 : 6 }
            );
          } else {
            let runs = idx % 2;
            let hits = 1 + (idx % 3);
            let rbi = idx % 2 === 0 ? 2 : 0;
            let hr = idx === 1 && gNum === "1" ? 1 : 0;
            let sb = idx % 3 === 0 ? 1 : 0;

            player_game_stats.push(
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "runs", stat_value: runs },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "hits", stat_value: hits },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "rbis", stat_value: rbi },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "home_runs", stat_value: hr },
              { id: `pgs_${pgsIdCounter++}`, game_id: gId, player_id: p.id, stat_key: "stolen_bases", stat_value: sb }
            );
          }
        });
      }
    });
  });

  const team_game_stats: any[] = [];

  // Seed stats for Football Game 1
  team_game_stats.push(
    { id: "tgs_g1_1", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: bHS_TeamId, stat_key: "total_offensive_yards", stat_value: 390 },
    { id: "tgs_g1_2", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: bHS_TeamId, stat_key: "passing_yards", stat_value: 240 },
    { id: "tgs_g1_3", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: bHS_TeamId, stat_key: "rushing_yards", stat_value: 150 },
    { id: "tgs_g1_4", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: bHS_TeamId, stat_key: "turnovers", stat_value: 1 },
    { id: "tgs_g1_5", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: bHS_TeamId, stat_key: "points_scored", stat_value: 28 },
    { id: "tgs_g1_6", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: bHS_TeamId, stat_key: "points_allowed", stat_value: 21 },
    { id: "tgs_g1_7", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: bHS_TeamId, stat_key: "team_forced_fumbles", stat_value: 2 },
    { id: "tgs_g1_8", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: bHS_TeamId, stat_key: "defensive_touchdowns", stat_value: 0 },
    { id: "tgs_g1_9", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: "team_opp_arlington_f47ac10b-58cc-4372-a567-0e02b2c3d479", stat_key: "total_offensive_yards", stat_value: 310 },
    { id: "tgs_g1_10", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: "team_opp_arlington_f47ac10b-58cc-4372-a567-0e02b2c3d479", stat_key: "passing_yards", stat_value: 190 },
    { id: "tgs_g1_11", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: "team_opp_arlington_f47ac10b-58cc-4372-a567-0e02b2c3d479", stat_key: "rushing_yards", stat_value: 120 },
    { id: "tgs_g1_12", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: "team_opp_arlington_f47ac10b-58cc-4372-a567-0e02b2c3d479", stat_key: "turnovers", stat_value: 3 },
    { id: "tgs_g1_13", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: "team_opp_arlington_f47ac10b-58cc-4372-a567-0e02b2c3d479", stat_key: "points_scored", stat_value: 21 },
    { id: "tgs_g1_14", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: "team_opp_arlington_f47ac10b-58cc-4372-a567-0e02b2c3d479", stat_key: "points_allowed", stat_value: 28 },
    { id: "tgs_g1_15", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: "team_opp_arlington_f47ac10b-58cc-4372-a567-0e02b2c3d479", stat_key: "team_forced_fumbles", stat_value: 1 },
    { id: "tgs_g1_16", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", team_id: "team_opp_arlington_f47ac10b-58cc-4372-a567-0e02b2c3d479", stat_key: "defensive_touchdowns", stat_value: 1 }
  );

  const users = [
    { id: "u_owner", email: "belmontdataclub@gmail.com", role: "owner", password: "password", created_at: new Date().toISOString() },
    { id: "u_editor", email: "editor@belmontstats.com", role: "editor", password: "password", created_at: new Date().toISOString() },
    { id: "u_player1", email: "danny.mara@belmontstats.com", role: "public", password: "password", created_at: new Date().toISOString() }
  ];

  const favorites = [
    { id: "fav1", user_id: "u_owner", entity_type: "player", entity_id: "p1", created_at: new Date().toISOString() },
    { id: "fav2", user_id: "u_owner", entity_type: "player", entity_id: "p2", created_at: new Date().toISOString() }
  ];

  const notifications = [
    { id: "not1", user_id: "u_player1", type: "claim_resolved", message: "Your athlete profile claim for Danny Mara has been APPROVED.", is_read: false, created_at: new Date().toISOString() }
  ];

  const corrections = [
    {
      id: "corr1",
      player_id: "p1",
      game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1",
      stat_key: "passing_yards",
      current_value: 235,
      suggested_value: 240,
      reason: "Post-review adjustments verified.",
      submitted_by: "u_player1",
      status: "approved",
      created_at: new Date().toISOString(),
      reviewed_at: new Date().toISOString()
    }
  ];

  const player_claims = [
    { id: "cl1", player_id: "p1", user_id: "u_player1", status: "approved", submitted_at: new Date().toISOString(), reviewed_at: new Date().toISOString() }
  ];

  const photographer_links = [
    { id: "pl1", game_id: "game_f47ac10b-58cc-4372-a567-0e02b2c3d479_1", drive_url: "https://drive.google.com/drive/folders/1dQw4w9WgXcQ", photographer_name: "Liam O'Connor (Class of '26)", submitted_by: "u_owner", created_at: new Date().toISOString() }
  ];

  const scraping_config = {
    platform: "MileSplit",
    meet_url: "https://ma.milesplit.com/meets/512345-belmont-vs-lexington-dual-meet",
    cron_schedule: "0 18 * * 3",
    last_scraped_at: null
  };

  const records: any[] = [];
  const leaderboard_cache: any[] = [];

  return {
    sports,
    seasons,
    teams,
    players,
    games,
    player_game_stats,
    team_game_stats,
    records,
    leaderboard_cache,
    users,
    player_claims,
    corrections,
    photographer_links,
    page_views: [],
    csv_downloads: [],
    search_queries: [],
    favorites,
    notifications,
    scraping_config,
    calendar_events: [],
    scraper_configs: [
      {
        id: "gen_random_uuid_1",
        sport_id: "s5",
        platform: "milesplit",
        target_url: "https://ma.milesplit.com/teams/19194-belmont-high-school",
        scrape_type: "meet_results",
        cron_schedule: "0 6 * * *",
        is_active: true,
        last_run_at: null,
        last_run_status: null,
        last_run_count: 0,
        created_at: new Date().toISOString()
      },
      {
        id: "gen_random_uuid_2",
        sport_id: "s7",
        platform: "milesplit",
        target_url: "https://ma.milesplit.com/teams/19194-belmont-high-school",
        scrape_type: "meet_results",
        cron_schedule: "0 6 * * *",
        is_active: true,
        last_run_at: null,
        last_run_status: null,
        last_run_count: 0,
        created_at: new Date().toISOString()
      },
      {
        id: "gen_random_uuid_3",
        sport_id: "s5",
        platform: "athletic_net",
        target_url: "https://www.athletic.net/team/19154/track-and-field-indoor/12026",
        scrape_type: "meet_results",
        cron_schedule: "0 6 * * *",
        is_active: true,
        last_run_at: null,
        last_run_status: null,
        last_run_count: 0,
        created_at: new Date().toISOString()
      }
    ],
    scraper_logs: []
  };
}

// Low-level database file loader & synchronizer with locking/mutex behavior
class LowDB {
  private data: db_types | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_PATH)) {
      const seeded = createInitialSeedData();
      this.data = seeded;
      this.write();
      this.rebuildAllCaches();
    } else {
      try {
        const raw = fs.readFileSync(DB_PATH, "utf8");
        this.data = JSON.parse(raw);
        // Fallback for scraping config if missing in legacy formats
        if (this.data && !this.data.scraping_config) {
          this.data.scraping_config = {
            platform: "MileSplit",
            meet_url: "https://ma.milesplit.com/meets/512345-belmont-vs-lexington-dual-meet",
            cron_schedule: "0 18 * * 3",
            last_scraped_at: null
          };
          this.write();
        }
      } catch (err) {
        console.error("Failed to load local DB. Re-creating seed data.", err);
        this.data = createInitialSeedData();
        this.write();
        this.rebuildAllCaches();
      }
    }
  }

  public get(): db_types {
    if (!this.data) {
      this.init();
    }
    return this.data!;
  }

  public write() {
    if (this.data) {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), "utf8");
    }
  }

  // Rebuild the Leaderboards and Records tables following a CSV import or update
  public rebuildAllCaches() {
    const d = this.get();
    
    // Clear cache
    d.leaderboard_cache = [];
    d.records = [];

    // Loop through all sports definitions to calculate caches & records
    d.sports.forEach((sport) => {
      const sportId = sport.id;
      const seasonObj = d.seasons.find(s => s.sport_id === sportId) || { id: `season_${sportId}` };
      const seasonId = seasonObj.id;

      const checkIsTimeEvent = (kStr: string) => {
        const kLt = kStr.toLowerCase();
        return kLt.includes("dash") || kLt.includes("run") || kLt.includes("hurdles") || kLt.includes("time") || kLt.includes("freestyle") || kLt.includes("breaststroke") || kLt.includes("backstroke") || kLt.includes("butterfly") || kLt.includes("im") || kLt.includes("yd_");
      };

      let categories: string[] = [];
      let singleGameKeys: string[] = [];

      if (sport.name.includes("Football")) {
        categories = [
          "passing_yards",
          "rushing_yards",
          "receiving_yards",
          "touchdowns",
          "defense_tackles",
          "defense_sacks",
          "defense_interceptions"
        ];
        singleGameKeys = ["passing_yards", "rushing_yards", "receiving_yards", "defense_tackles", "defense_sacks"];
      } else if (sport.name.includes("Basketball")) {
        categories = ["points", "assists", "rebounds", "blocks", "steals", "three_pointers"];
        singleGameKeys = ["points", "assists", "rebounds", "blocks", "steals"];
      } else if (sport.name.toLowerCase().includes("track")) {
        if (sport.id === "s5" || sport.id === "s6") {
          categories = ["points", "55m_Dash", "300m_Dash", "600m_Run", "1000m_Run", "1_Mile_Run", "2_Mile_Run", "55m_Hurdles", "Shot_Put", "High_Jump"];
          singleGameKeys = ["55m_Dash", "300m_Dash", "600m_Run", "1000m_Run", "1_Mile_Run", "2_Mile_Run", "55m_Hurdles", "Shot_Put", "High_Jump"];
        } else {
          categories = ["points", "100m_Dash", "200m_Dash", "400m_Dash", "800m_Run", "1_Mile_Run", "2_Mile_Run", "110m_Hurdles", "Shot_Put", "Discus", "Javelin", "High_Jump", "Long_Jump"];
          singleGameKeys = ["100m_Dash", "200m_Dash", "400m_Dash", "800m_Run", "1_Mile_Run", "2_Mile_Run", "110m_Hurdles", "Shot_Put", "Discus", "Javelin", "High_Jump", "Long_Jump"];
        }
      } else if (sport.name.toLowerCase().includes("swim")) {
        categories = ["points", "50yd_Freestyle", "100yd_Freestyle", "100yd_Breaststroke", "100yd_Backstroke", "100yd_Butterfly", "200yd_IM", "500yd_Freestyle"];
        singleGameKeys = ["50yd_Freestyle", "100yd_Freestyle", "100yd_Breaststroke", "100yd_Backstroke", "100yd_Butterfly", "200yd_IM", "500yd_Freestyle"];
      } else if (sport.name.toLowerCase().includes("baseball")) {
        categories = ["strikeouts_thrown", "innings_pitched", "runs", "hits", "rbis", "home_runs", "stolen_bases"];
        singleGameKeys = ["strikeouts_thrown", "innings_pitched", "runs", "hits", "rbis", "home_runs", "stolen_bases"];
      } else {
        categories = ["points", "time", "distance"];
        singleGameKeys = ["points"];
      }

      // Build leaderboard totals per category per player for this sport
      categories.forEach((cat) => {
        const playerTotals: { [playerId: string]: number } = {};

        d.player_game_stats.forEach((stat) => {
          const player = d.players.find(p => p.id === stat.player_id);
          if (!player) return;

          const team = d.teams.find(t => t.id === player.team_id);
          if (!team || team.sport_id !== sportId) return;

          let val = Number(stat.stat_value);
          if (isNaN(val)) return;

          if (cat === "touchdowns") {
            if (["rushing_touchdowns", "receiving_touchdowns", "passing_touchdowns"].includes(stat.stat_key)) {
              playerTotals[stat.player_id] = (playerTotals[stat.player_id] || 0) + val;
            }
          } else if (stat.stat_key === cat) {
            playerTotals[stat.player_id] = (playerTotals[stat.player_id] || 0) + val;
          }
        });

        const isTimeEvent = checkIsTimeEvent(cat);
        const sorted = Object.keys(playerTotals)
          .map((pid) => ({ player_id: pid, value: playerTotals[pid] }))
          .sort((a, b) => isTimeEvent ? a.value - b.value : b.value - a.value);

        sorted.forEach((item, index) => {
          d.leaderboard_cache.push({
            id: `lc_${sportId}_${cat}_${item.player_id}`,
            sport_id: sportId,
            season_id: seasonId,
            stat_key: cat,
            player_id: item.player_id,
            value: item.value,
            rank: index + 1,
            updated_at: new Date().toISOString()
          });
        });
      });

      // Auto-compute Records for this sport
      singleGameKeys.forEach((key) => {
        let maxStat: any = null;
        d.player_game_stats.forEach((stat) => {
          if (stat.stat_key === key) {
            const player = d.players.find(p => p.id === stat.player_id);
            if (!player) return;
            const team = d.teams.find(t => t.id === player.team_id);
            if (!team || team.sport_id !== sportId) return;

            const isTimeEvent = checkIsTimeEvent(key);
            const val = Number(stat.stat_value);
            if (!maxStat || (isTimeEvent ? val < Number(maxStat.stat_value) : val > Number(maxStat.stat_value))) {
              maxStat = stat;
            }
          }
        });

        if (maxStat) {
          const game = d.games.find(g => g.id === maxStat.game_id);
          d.records.push({
            id: `rec_sg_${sportId}_${key}`,
            sport_id: sportId,
            stat_key: key,
            record_type: "single_game",
            value: Number(maxStat.stat_value),
            player_id: maxStat.player_id,
            game_id: maxStat.game_id,
            season_id: seasonId,
            set_at: game ? game.game_date + "T00:00:00Z" : new Date().toISOString()
          });
        }
      });

      singleGameKeys.forEach((key) => {
        const cacheEntries = d.leaderboard_cache.filter(e => e.sport_id === sportId && e.stat_key === key);
        if (cacheEntries.length > 0) {
          const isTimeEvent = checkIsTimeEvent(key);
          const best = cacheEntries.sort((a, b) => isTimeEvent ? a.value - b.value : b.value - a.value)[0];
          
          d.records.push({
            id: `rec_ss_${sportId}_${key}`,
            sport_id: sportId,
            stat_key: key,
            record_type: "single_season",
            value: best.value,
            player_id: best.player_id,
            game_id: null,
            season_id: seasonId,
            set_at: new Date().toISOString()
          });
        }
      });
    });

    this.write();
  }
}

export const dbInstance = new LowDB();
