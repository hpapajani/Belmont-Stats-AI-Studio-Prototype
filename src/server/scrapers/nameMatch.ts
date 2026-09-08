import levenshtein from "fast-levenshtein";
import { dbInstance } from "../db.js";

export async function matchAthleteToPlayer(
  scrapedName: string,
  sportId: string
): Promise<{ player_id: string | null; confidence: number; candidates: any[] }> {
  const d = dbInstance.get();
  
  // Get all players for this sport
  // A somewhat naive approach: we assume sport implies team
  const sportTeams = d.teams.filter((t: any) => t.sport_id === sportId);
  const teamIds = sportTeams.map((t: any) => t.id);
  const candidates = d.players.filter((p: any) => teamIds.includes(p.team_id));

  const trimmed = scrapedName.trim();
  const lowerScraped = trimmed.toLowerCase();

  // 1. Exact full name match, case-insensitive, trimmed
  let exactMatch = candidates.find((p: any) => p.name.trim().toLowerCase() === lowerScraped);
  if (exactMatch) {
    return { player_id: exactMatch.id, confidence: 1.0, candidates: [] };
  }

  // 2. Last name exact + first initial match
  // Extract last name and first initial from scraped name
  const scrapedParts = lowerScraped.split(' ');
  const scrapedFirstInitial = scrapedParts[0].charAt(0);
  const scrapedLastName = scrapedParts.length > 1 ? scrapedParts[scrapedParts.length - 1] : lowerScraped;

  let initialMatch = candidates.find((p: any) => {
    const dbParts = p.name.trim().toLowerCase().split(' ');
    const dbFirstInitial = dbParts[0].charAt(0);
    const dbLastName = dbParts.length > 1 ? dbParts[dbParts.length - 1] : p.name.trim().toLowerCase();
    
    return dbFirstInitial === scrapedFirstInitial && dbLastName === scrapedLastName;
  });

  if (initialMatch) {
    return { player_id: initialMatch.id, confidence: 0.85, candidates: [] };
  }

  // 3. Levenshtein distance of 2 or less
  let bestPlayer = null;
  let bestConfidence = 0;
  const scoredCandidates = candidates.map((p: any) => {
    const dist = levenshtein.get(lowerScraped, p.name.trim().toLowerCase());
    const confidence = 0.75 - (dist * 0.1);
    return { player: p, dist, confidence };
  }).sort((a, b) => b.confidence - a.confidence);

  if (scoredCandidates.length > 0 && scoredCandidates[0].dist <= 2) {
    bestPlayer = scoredCandidates[0].player;
    bestConfidence = scoredCandidates[0].confidence;
  }

  // If the best confidence is 0.75 or above, return it
  if (bestConfidence >= 0.75 && bestPlayer) {
    return { player_id: bestPlayer.id, confidence: bestConfidence, candidates: [] };
  }

  // Otherwise return null and the top 3 scored candidates
  return {
    player_id: null,
    confidence: bestConfidence,
    candidates: scoredCandidates.slice(0, 3).map(c => ({
      ...c.player,
      confidence_score: c.confidence
    }))
  };
}
