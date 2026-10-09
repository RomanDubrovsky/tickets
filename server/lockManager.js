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
        seats_count INT DEFAULT 1 NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (event_id, seat_id)
      );
      ALTER TABLE held_seats ADD COLUMN IF NOT EXISTS seats_count INT DEFAULT 1 NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_held_seats_expires ON held_seats(expires_at);
      CREATE INDEX IF NOT EXISTS idx_held_seats_hold_id ON held_seats(hold_id);
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

  // Checks remaining available capacity for an event (capacity - confirmed bookings - active holds)
  async getAvailableCapacity(pool, eventId) {
    await this._cleanupExpiredLocks(pool);
    const query = `
      WITH event_info AS (
        SELECT e.id, COALESCE(s.capacity, 100) AS total_capacity
        FROM events e
        LEFT JOIN ships s ON e.ship_id = s.id
        WHERE e.id = $1
      ),
      booked AS (
        SELECT COALESCE(SUM(tickets_count), 0) AS booked_count
        FROM bookings
        WHERE event_id = $1 AND status = 'confirmed'
      ),
      held AS (
        SELECT COALESCE(SUM(seats_count), 0) AS held_count
        FROM held_seats
        WHERE event_id = $1 AND expires_at > NOW()
      )
      SELECT 
        ei.total_capacity,
        b.booked_count,
        h.held_count,
        GREATEST(0, ei.total_capacity - b.booked_count - h.held_count) AS available_capacity
      FROM event_info ei
      CROSS JOIN booked b
      CROSS JOIN held h;
    `;
    try {
      const res = await pool.query(query, [eventId]);
      if (res.rowCount === 0) return null;
      return {
        totalCapacity: parseInt(res.rows[0].total_capacity, 10),
        bookedCount: parseInt(res.rows[0].booked_count, 10),
        heldCount: parseInt(res.rows[0].held_count, 10),
        availableCapacity: parseInt(res.rows[0].available_capacity, 10)
      };
    } catch (err) {
      console.error('[LockManager Error] getAvailableCapacity failed:', err.message);
      return null;
    }
  }

  // Atomically hold capacity (multiple seats for seatless / entry tickets)
  async holdCapacity(pool, eventId, seatsCount, holdId, ttlMinutes = 15) {
    await this._cleanupExpiredLocks(pool);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Lock the event row to serialize concurrent holds on the same event
      const eventRes = await client.query(`
        SELECT e.id, COALESCE(s.capacity, 100) AS total_capacity
        FROM events e
        LEFT JOIN ships s ON e.ship_id = s.id
        WHERE e.id = $1
        FOR UPDATE OF e
      `, [eventId]);

      if (eventRes.rowCount === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      const totalCapacity = parseInt(eventRes.rows[0].total_capacity, 10);

      const bookedRes = await client.query(`
        SELECT COALESCE(SUM(tickets_count), 0) AS booked_count
        FROM bookings
        WHERE event_id = $1 AND status = 'confirmed'
      `, [eventId]);
      const bookedCount = parseInt(bookedRes.rows[0].booked_count, 10);

      const heldRes = await client.query(`
        SELECT COALESCE(SUM(seats_count), 0) AS held_count
        FROM held_seats
        WHERE event_id = $1 AND expires_at > NOW()
      `, [eventId]);
      const heldCount = parseInt(heldRes.rows[0].held_count, 10);

      const remaining = totalCapacity - bookedCount - heldCount;
      if (remaining < seatsCount) {
        await client.query('ROLLBACK');
        return false; // Insufficient remaining capacity
      }

      const expiresAt = new Date(Date.now() + ttlMinutes * 60000);
      const seatPlaceholder = `capacity_${holdId}`;
      await client.query(`
        INSERT INTO held_seats (event_id, seat_id, hold_id, expires_at, seats_count)
        VALUES ($1, $2, $3, $4, $5)
      `, [eventId, seatPlaceholder, holdId, expiresAt, seatsCount]);

      await client.query('COMMIT');
      return expiresAt;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[LockManager Error] holdCapacity failed:', err.message);
      return false;
    } finally {
      client.release();
    }
  }

  // Releases a capacity or single hold by holdId
  async releaseHoldById(pool, eventId, holdId) {
    const query = `
      DELETE FROM held_seats
      WHERE event_id = $1 AND hold_id = $2
      RETURNING seats_count;
    `;
    try {
      const res = await pool.query(query, [eventId, holdId]);
      return res.rowCount > 0;
    } catch (err) {
      console.error('[LockManager Error] releaseHoldById failed:', err.message);
      return false;
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

