export function startAlertWorker(pool, intervalMs = 600000) { // Default 10 minutes
  setInterval(async () => {
    try {
      console.log('[AlertWorker] Checking for system alerts...');

      // 1. Check for low capacity on upcoming events (next 48 hours)
      // We calculate percentage of confirmed bookings versus ship capacity
      const upcomingEventsRes = await pool.query(`
        SELECT e.id, e.name, e.date, e.time, s.capacity,
               (SELECT COUNT(*) FROM bookings b WHERE b.event_id = e.id AND b.status = 'confirmed') as booked_count
        FROM events e
        JOIN ships s ON e.ship_id = s.id
        WHERE e.status = 'active'
          AND (e.date + e.time::time) >= NOW()
          AND (e.date + e.time::time) <= NOW() + INTERVAL '48 hours'
      `);

      for (const event of upcomingEventsRes.rows) {
        const capacity = event.capacity || 100;
        const loadFactor = (event.booked_count / capacity) * 100;
        
        if (loadFactor < 30) {
          // Check if alert already exists to avoid spamming
          const existingAlertRes = await pool.query(`
            SELECT id FROM alerts WHERE entity_type = 'event' AND entity_id = $1 AND status = 'new' AND title = 'Низкая загрузка рейса'
          `, [event.id]);

          if (existingAlertRes.rowCount === 0) {
            await pool.query(`
              INSERT INTO alerts (level, title, message, entity_type, entity_id)
              VALUES ('warning', 'Низкая загрузка рейса', $1, 'event', $2)
            `, [`Рейс "${event.name}" (${event.date.toISOString().split('T')[0]}) имеет загрузку всего ${loadFactor.toFixed(1)}% (${event.booked_count} из ${capacity} мест).`, event.id]);
          }
        }
      }

      // 2. Check for unpaid pending bookings older than 30 minutes
      const pendingBookingsRes = await pool.query(`
        SELECT id, customer_name, created_at FROM bookings
        WHERE status = 'pending' AND created_at <= NOW() - INTERVAL '30 minutes'
      `);

      for (const booking of pendingBookingsRes.rows) {
        const existingAlertRes = await pool.query(`
          SELECT id FROM alerts WHERE entity_type = 'booking' AND entity_id = $1 AND status = 'new' AND title = 'Зависшее бронирование'
        `, [booking.id]);

        if (existingAlertRes.rowCount === 0) {
          await pool.query(`
            INSERT INTO alerts (level, title, message, entity_type, entity_id)
            VALUES ('warning', 'Зависшее бронирование', $1, 'booking', $2)
          `, [`Бронирование от ${booking.customer_name} не оплачено более 30 минут.`, booking.id]);
        }
      }

    } catch (error) {
      console.error('[AlertWorker] Error processing alerts:', error);
    }
  }, intervalMs);
}
