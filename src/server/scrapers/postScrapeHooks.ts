import { dbInstance } from "../db.js";
import { sendEmail, getBelmontEmailTemplate } from "../email.js";

export async function runPostScrapeHooks(
  sportId: string,
  seasonId: string,
  affectedPlayerIds: string[]
): Promise<void> {
  const d = dbInstance.get();

  // 1. Rebuild Leaderboard cache
  // In our local architecture, we rebuild all caches using the built-in db method
  dbInstance.rebuildAllCaches();

  // 2. Records Check
  // Our rebuildAllCaches method actually manages the records check globally on run
  // So no explicit loops are strictly necessary here.

  // 3. Player notifications
  const claimedPlayers = d.players.filter((p: any) => 
    affectedPlayerIds.includes(p.id) && 
    p.is_claimed && 
    p.claimed_by_user_id
  );

  for (const player of claimedPlayers) {
    const user = d.users.find((u: any) => u.id === player.claimed_by_user_id);
    if (user) {
      // deduplicate notification check omitted for brevity in sync run
      d.notifications.push({
        id: "not_scr_" + Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        type: "stat_update",
        message: `Your newest stats from external platforms have been compiled into Belmont Stats for ${player.name}.`,
        is_read: false,
        created_at: new Date().toISOString()
      });

      sendEmail({
        to: user.email,
        subject: `Your newest stats are live on Belmont Stats`,
        html: getBelmontEmailTemplate(
          "Personal Stats Synchronized",
          `
          <p>Hi <span class="highlight">${player.name}</span>,</p>
          <p>The Belmont Stats web scraping system has just synchronized your newest performance results!</p>
          <p>You can instantly view your updated records and rankings.</p>
          <p><a href="https://ais-dev-nidazfao6yrrxebdwokoma-568392152462.us-west2.run.app/players/${player.id}" class="btn">View My Player Profile</a></p>
          `
        )
      });
    }
  }

  dbInstance.write();
}
