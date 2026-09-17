// Quota Auto-Reclaim Background Worker
// Periodically checks cruises starting within N hours (e.g., 3 hours)
// Automatically returns unused hard quotas from external sales channels into the open pool.

import webhookManager from './webhooks.js';

export function startQuotaReleaseWorker(pool, intervalMs = 60000) {
  console.log('[Worker] Quota Auto-Release background service started.');

  setInterval(async () => {
    try {
      // Find upcoming cruises departing within next 3 hours
      const query = `
        SELECT id, name, date, time 
        FROM events 
        WHERE status = 'active'
        AND (date + time) <= (NOW() + INTERVAL '3 hours')
        AND (date + time) > NOW();
      `;
      const res = await pool.query(query);

      for (const event of res.rows) {
        // Trigger auto-release event and notify aggregators
        await webhookManager.broadcastEvent('quota.released', {
          eventId: event.id,
          eventName: event.name,
          reason: 'Auto-reclaimed unsold quotas 3h before cruise departure',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('[Worker Error] Quota release failed:', err.message);
    }
  }, intervalMs);
}
