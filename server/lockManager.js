// PostgreSQL-backed Seat Lock Manager
// Guarantees atomic distributed seat locking across all instances and serverless containers

class LockManager {
  // Ensure the held_seats table exists in PostgreSQL
  async initTable(pool) {
    const query = `
      CREATE TABLE IF NOT EXISTS held_seats (
        event_id UUID NOT NULL,
        seat_id TEXT NOT NULL,
        hold_id TEXT NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (event_id, seat_id)
      );
      CREATE INDEX IF NOT EXISTS idx_held_seats_expires ON held_seats(expires_at);
    `;
    try {
      await pool.query(query);
    } catch (err) {
      console.error('[LockManager] Failed to ensure held_seats table:', err.message);
    }
  }

  // Atomically hold a seat in PostgreSQL
  async holdSeat(pool, eventId, seatId, holdId, ttlMinutes = 15) {
    await this._cleanupExpiredLocks(pool);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60000);

    const query = `
      INSERT INTO held_seats (event_id, seat_id, hold_id, expires_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (event_id, seat_id) 
      DO UPDATE SET hold_id = EXCLUDED.hold_id, expires_at = EXCLUDED.expires_at
      WHERE held_seats.expires_at < NOW()
      RETURNING expires_at;
    `;

    try {
      const res = await pool.query(query, [eventId, seatId, holdId, expiresAt]);
      if (res.rowCount > 0) {
        return expiresAt;
      }
      return false; // Already locked by another active hold
    } catch (err) {
      console.error('[LockManager Error] holdSeat failed:', err.message);
      return false;
    }
  }

  // Releases a lock if the holdId matches
  async releaseHold(pool, eventId, seatId, holdId) {
    const query = `
      DELETE FROM held_seats
      WHERE event_id = $1 AND seat_id = $2 AND hold_id = $3
      RETURNING 1;
    `;
    try {
      const res = await pool.query(query, [eventId, seatId, holdId]);
      return res.rowCount > 0;
    } catch (err) {
      console.error('[LockManager Error] releaseHold failed:', err.message);
      return false;
    }
  }

  // Checks if a seat is currently locked by someone else
  async isSeatLocked(pool, eventId, seatId) {
    await this._cleanupExpiredLocks(pool);
    const query = `
      SELECT 1 FROM held_seats
      WHERE event_id = $1 AND seat_id = $2 AND expires_at > NOW();
    `;
    try {
      const res = await pool.query(query, [eventId, seatId]);
      return res.rowCount > 0;
    } catch (err) {
      console.error('[LockManager Error] isSeatLocked failed:', err.message);
      return false;
    }
  }

  // Get all currently locked seats for an event
  async getLockedSeats(pool, eventId) {
    await this._cleanupExpiredLocks(pool);
    const query = `
      SELECT seat_id FROM held_seats
      WHERE event_id = $1 AND expires_at > NOW();
    `;
    try {
      const res = await pool.query(query, [eventId]);
      return res.rows.map(r => r.seat_id);
    } catch (err) {
      console.error('[LockManager Error] getLockedSeats failed:', err.message);
      return [];
    }
  }

  // Clean up all expired locks across the DB
  async _cleanupExpiredLocks(pool) {
    try {
      await pool.query('DELETE FROM held_seats WHERE expires_at < NOW()');
    } catch (err) {
      // Ignore background cleanup errors to avoid blocking reads
    }
  }
}

export default new LockManager();
