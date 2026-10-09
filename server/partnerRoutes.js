import crypto from 'crypto';
import lockManager from './lockManager.js';

/**
 * Middleware: Authenticate Partner or Promoter via API Key or Header
 */
export async function authenticatePartner(req, res, next, pool) {
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'] || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error_code: 'UNAUTHORIZED',
      message: 'Missing partner API key in X-API-Key or Authorization header'
    });
  }

  try {
    const agentRes = await pool.query(
      'SELECT id, name, promo_code, commission_rate, type FROM agents WHERE api_key = $1',
      [apiKey]
    );

    if (agentRes.rowCount === 0) {
      return res.status(403).json({
        success: false,
        error_code: 'INVALID_CREDENTIALS',
        message: 'Invalid partner API key'
      });
    }

    req.partner = agentRes.rows[0];
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Generates an encrypted/verifiable Ticket Code for boarding pass (СКУД)
 * Format: SHP-<YEAR>-<RANDOM-HEX>
 */
export function generateTicketCode() {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SHP-${year}-${randomPart}`;
}

/**
 * Register Partner API routes into the Express app
 */
export function setupPartnerRoutes(app, pool) {
  // 1. Catalog / Trips list for Sputnik8 & Aggregators
  app.get('/api/v1/partner/trips', async (req, res) => {
    try {
      const { date, ship_id } = req.query;
      let query = `
        SELECT 
          e.id, 
          e.name, 
          e.description, 
          e.date, 
          e.time, 
          e.price_standard, 
          e.price_vip,
          e.status,
          s.id AS ship_id,
          s.name AS ship_name,
          COALESCE(s.capacity, 100) AS ship_capacity,
          s.image_url,
          s.coordinates,
          p.name AS program_name
        FROM events e
        LEFT JOIN ships s ON e.ship_id = s.id
        LEFT JOIN programs p ON e.program_id = p.id
        WHERE e.status = 'active'
      `;
      const params = [];
      if (date) {
        params.push(date);
        query += ` AND e.date = $${params.length}`;
      } else {
        query += ` AND e.date >= CURRENT_DATE`;
      }

      if (ship_id) {
        params.push(ship_id);
        query += ` AND e.ship_id = $${params.length}`;
      }

      query += ` ORDER BY e.date ASC, e.time ASC LIMIT 100`;

      const result = await pool.query(query, params);
      res.json({
        success: true,
        count: result.rowCount,
        data: result.rows.map(trip => ({
          trip_id: trip.id,
          title: trip.name,
          description: trip.description,
          program: trip.program_name,
          date: trip.date,
          departure_time: trip.time,
          prices: {
            standard: parseFloat(trip.price_standard),
            vip: parseFloat(trip.price_vip)
          },
          vessel: {
            id: trip.ship_id,
            name: trip.ship_name,
            total_capacity: trip.ship_capacity,
            image_url: trip.image_url,
            pier_coordinates: trip.coordinates
          }
        }))
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Real-time Trip Availability Check (Strictly sub-100ms)
  app.get('/api/v1/partner/trips/:id/availability', async (req, res) => {
    const { id } = req.params;
    try {
      const capacityInfo = await lockManager.getAvailableCapacity(pool, id);
      if (!capacityInfo) {
        return res.status(404).json({ success: false, message: 'Trip not found or inactive' });
      }

      const eventRes = await pool.query('SELECT price_standard, price_vip, date, time FROM events WHERE id = $1', [id]);
      const event = eventRes.rows[0];

      res.json({
        success: true,
        data: {
          trip_id: id,
          date: event.date,
          departure_time: event.time,
          total_capacity: capacityInfo.totalCapacity,
          booked_count: capacityInfo.bookedCount,
          held_count: capacityInfo.heldCount,
          available_capacity: capacityInfo.availableCapacity,
          is_sold_out: capacityInfo.availableCapacity <= 0,
          current_prices: {
            standard: parseFloat(event.price_standard),
            vip: parseFloat(event.price_vip)
          }
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Hold seats / capacity (Two-Phase Commit: Phase 1)
  // Used by Sputnik8 during customer checkout (15 min hold)
  app.post('/api/v1/partner/orders/hold', async (req, res) => {
    const { trip_id, seats_count = 1, external_order_id, ttl_minutes = 15 } = req.body;

    if (!trip_id || seats_count <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'trip_id and positive seats_count are required'
      });
    }

    const holdId = crypto.randomUUID();
    const expiresAt = await lockManager.holdCapacity(pool, trip_id, parseInt(seats_count, 10), holdId, ttl_minutes);

    if (!expiresAt) {
      return res.status(409).json({
        success: false,
        error_code: 'CAPACITY_EXCEEDED',
        message: 'Not enough available seats on this trip for the requested quantity'
      });
    }

    res.json({
      success: true,
      data: {
        hold_id: holdId,
        trip_id,
        seats_count: parseInt(seats_count, 10),
        external_order_id: external_order_id || null,
        expires_at: expiresAt.toISOString(),
        ttl_seconds: ttl_minutes * 60
      }
    });
  });

  // 4. Confirm Order / Issue Tickets (Two-Phase Commit: Phase 2)
  // Confirms sale, releases hold atomically, creates bookings & issues Ticket Codes / QR payloads
  app.post('/api/v1/partner/orders/confirm', async (req, res) => {
    const { 
      hold_id, 
      trip_id, 
      external_order_id, 
      customer_info = {}, 
      seats_count = 1,
      ticket_category = 'standard',
      agent_promo_code
    } = req.body;

    if (!hold_id || !trip_id) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'hold_id and trip_id are required'
      });
    }

    const count = parseInt(seats_count, 10) || 1;

    // Release the temporary hold
    const holdReleased = await lockManager.releaseHoldById(pool, trip_id, hold_id);
    if (!holdReleased) {
      return res.status(400).json({
        success: false,
        error_code: 'HOLD_EXPIRED_OR_INVALID',
        message: 'Hold has expired or does not exist. Please hold seats again.'
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const eventRes = await client.query('SELECT price_standard, price_vip FROM events WHERE id = $1', [trip_id]);
      if (eventRes.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }

      const unitPrice = ticket_category === 'vip' 
        ? parseFloat(eventRes.rows[0].price_vip) 
        : parseFloat(eventRes.rows[0].price_standard);
      const totalAmount = unitPrice * count;

      // Identify Agent (Sputnik8 or Promoter)
      let agentId = null;
      if (req.partner) {
        agentId = req.partner.id;
      } else if (agent_promo_code) {
        const agRes = await client.query('SELECT id FROM agents WHERE promo_code = $1', [agent_promo_code.toUpperCase()]);
        if (agRes.rowCount > 0) agentId = agRes.rows[0].id;
      }

      // Generate Ticket Codes for each ticket
      const issuedTickets = [];
      for (let i = 0; i < count; i++) {
        const ticketCode = generateTicketCode();
        issuedTickets.push({
          ticket_code: ticketCode,
          category: ticket_category,
          price: unitPrice
        });
      }

      const insertQuery = `
        INSERT INTO bookings (
          event_id, 
          customer_name, 
          customer_email, 
          customer_phone, 
          seat_category, 
          price_paid, 
          status, 
          agent_id, 
          tickets_count, 
          ticket_code, 
          external_order_id, 
          hold_id
        ) VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', $7, $8, $9, $10, $11)
        RETURNING id, created_at;
      `;

      const mainTicketCode = issuedTickets[0].ticket_code;
      const bookingRes = await client.query(insertQuery, [
        trip_id,
        customer_info.name || 'Партнерский клиент',
        customer_info.email || null,
        customer_info.phone || null,
        ticket_category,
        totalAmount,
        agentId,
        count,
        mainTicketCode,
        external_order_id || null,
        hold_id
      ]);

      await client.query('COMMIT');

      res.json({
        success: true,
        data: {
          booking_id: bookingRes.rows[0].id,
          trip_id,
          external_order_id: external_order_id || null,
          status: 'confirmed',
          total_price: totalAmount,
          seats_count: count,
          created_at: bookingRes.rows[0].created_at,
          tickets: issuedTickets.map(t => ({
            ...t,
            qr_payload: JSON.stringify({
              code: t.ticket_code,
              trip_id: trip_id,
              booking_id: bookingRes.rows[0].id
            })
          }))
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[Partner API Error] confirm failed:', err.message);
      res.status(500).json({ success: false, error: err.message });
    } finally {
      client.release();
    }
  });

  // 5. Cancel / Refund Booking
  app.post('/api/v1/partner/orders/cancel', async (req, res) => {
    const { booking_id, external_order_id, reason } = req.body;

    if (!booking_id && !external_order_id) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Either booking_id or external_order_id is required'
      });
    }

    try {
      let query = `UPDATE bookings SET status = 'cancelled' WHERE `;
      const params = [];
      if (booking_id) {
        params.push(booking_id);
        query += `id = $${params.length}`;
      } else {
        params.push(external_order_id);
        query += `external_order_id = $${params.length}`;
      }
      query += ` AND status = 'confirmed' RETURNING id, event_id, tickets_count;`;

      const result = await pool.query(query, params);
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error_code: 'NOT_FOUND',
          message: 'Active booking not found or already cancelled'
        });
      }

      res.json({
        success: true,
        message: 'Booking cancelled and seats returned to shared capacity',
        data: {
          booking_id: result.rows[0].id,
          returned_seats: result.rows[0].tickets_count,
          reason: reason || 'Partner cancellation request'
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Boarding pass validation (СКУД контролера / матроса на причале)
  app.post('/api/v1/boarding/validate', async (req, res) => {
    const { ticket_code, trip_id } = req.body;
    if (!ticket_code) {
      return res.status(400).json({ success: false, message: 'ticket_code is required' });
    }

    try {
      const query = `
        SELECT 
          b.id, 
          b.status, 
          b.customer_name, 
          b.seat_category, 
          b.tickets_count, 
          b.checked_in_at,
          e.id AS event_id,
          e.name AS trip_name,
          e.date,
          e.time,
          s.name AS ship_name
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        LEFT JOIN ships s ON e.ship_id = s.id
        WHERE b.ticket_code = $1;
      `;
      const resCheck = await pool.query(query, [ticket_code.trim().toUpperCase()]);

      if (resCheck.rowCount === 0) {
        return res.status(404).json({
          success: false,
          valid: false,
          error_code: 'INVALID_TICKET',
          message: 'Билет не найден в единой базе!'
        });
      }

      const booking = resCheck.rows[0];

      if (booking.status !== 'confirmed') {
        return res.status(400).json({
          success: false,
          valid: false,
          error_code: 'TICKET_CANCELLED',
          message: `Билет аннулирован или возвращен! Статус: ${booking.status}`
        });
      }

      if (trip_id && booking.event_id !== trip_id) {
        return res.status(400).json({
          success: false,
          valid: false,
          error_code: 'WRONG_TRIP',
          message: `Билет на другой рейс: ${booking.trip_name} (${booking.date} в ${booking.time})`
        });
      }

      if (booking.checked_in_at) {
        return res.status(409).json({
          success: false,
          valid: false,
          error_code: 'ALREADY_USED',
          message: `Внимание! Билет уже погашен в ${new Date(booking.checked_in_at).toLocaleTimeString('ru-RU')}! Повторный проход запрещен!`,
          checked_in_at: booking.checked_in_at
        });
      }

      // Mark as checked in
      const checkinTime = new Date();
      await pool.query('UPDATE bookings SET checked_in_at = $1 WHERE id = $2', [checkinTime, booking.id]);

      res.json({
        success: true,
        valid: true,
        message: 'Проход разрешен! Билет успешно погашен.',
        data: {
          customer_name: booking.customer_name,
          category: booking.seat_category,
          passengers_count: booking.tickets_count,
          ship_name: booking.ship_name,
          trip_name: booking.trip_name,
          checked_in_at: checkinTime.toISOString()
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
}
