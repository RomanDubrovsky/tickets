import express from 'express';
import cors from 'cors';
import pg from 'pg';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swaggerConfig.js';
import lockManager from './lockManager.js';
import { calculateDynamicPrice } from './dynamicPricing.js';
import webhookManager from './webhooks.js';
import { startQuotaReleaseWorker } from './quotaWorker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Start background workers
startQuotaReleaseWorker(pool, 300000); // Check every 5 minutes

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Documentation via Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint for Dynamic Price calculation & forecast
app.get('/api/v1/events/:id/dynamic-price', async (req, res) => {
  try {
    const { id } = req.params;
    const { weather } = req.query;

    const eventRes = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventRes.rowCount === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    const event = eventRes.rows[0];

    const bookingsRes = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE event_id = $1 AND status = $2',
      [id, 'confirmed']
    );
    const bookedCount = parseInt(bookingsRes.rows[0].count, 10) || 0;

    const shipRes = await pool.query('SELECT capacity FROM ships WHERE id = $1', [event.ship_id]);
    const totalCapacity = shipRes.rowCount > 0 ? shipRes.rows[0].capacity : 80;

    const pricing = calculateDynamicPrice(
      parseFloat(event.price_standard),
      totalCapacity,
      bookedCount,
      event.date,
      event.time,
      weather || 'clear'
    );

    res.json({ success: true, data: pricing });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cancel cruise (e.g., severe weather / storm alert) with instant Webhook broadcast
app.post('/api/v1/events/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    await pool.query('UPDATE events SET status = $1 WHERE id = $2', ['inactive', id]);
    
    // Broadcast webhook to all external partner kassas
    await webhookManager.broadcastEvent('cruise.cancelled', {
      eventId: id,
      reason: reason || 'Отмена рейса по погодным условиям (Нева)',
      cancelledAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Cruise cancelled and webhooks broadcasted to all partners' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1. Get all events
app.get('/api/v1/events', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events WHERE status = $1', ['active']);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get availability for an event
app.get('/api/v1/tickets/availability', async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ success: false, message: 'eventId is required' });

  try {
    const eventRes = await pool.query('SELECT id, ship_id FROM events WHERE id = $1', [eventId]);
    if (eventRes.rowCount === 0) return res.status(404).json({ success: false, message: 'Event not found' });

    // Find confirmed bookings
    const bookingsRes = await pool.query(
      'SELECT seat_number FROM bookings WHERE event_id = $1 AND status = $2', 
      [eventId, 'confirmed']
    );
    const bookedSeats = bookingsRes.rows.map(b => b.seat_number);

    // Find currently locked (held) seats in memory
    const lockedSeats = lockManager.getLockedSeats(eventId);
    const unavailableSeats = [...new Set([...bookedSeats, ...lockedSeats])];

    res.json({
      success: true,
      data: { eventId, unavailableSeats }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Hold (lock) a seat
app.post('/api/v1/tickets/hold', async (req, res) => {
  const { eventId, seatId } = req.body;
  if (!eventId || !seatId) return res.status(400).json({ success: false, message: 'Missing params' });

  try {
    const bookingsRes = await pool.query(
      'SELECT 1 FROM bookings WHERE event_id = $1 AND seat_number = $2 AND status = $3', 
      [eventId, seatId, 'confirmed']
    );
    if (bookingsRes.rowCount > 0) return res.status(409).json({ success: false, message: 'Seat is booked' });

    const holdId = crypto.randomUUID();
    const expiresAt = lockManager.holdSeat(eventId, seatId, holdId, 15);

    if (!expiresAt) return res.status(409).json({ success: false, message: 'Seat is held by another user' });

    res.json({ success: true, data: { holdId, expiresAt } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Book a held seat
app.post('/api/v1/tickets/book', async (req, res) => {
  const { eventId, seatId, holdId, customerInfo, promoCode } = req.body;
  if (!eventId || !seatId || !holdId || !customerInfo) {
    return res.status(400).json({ success: false, message: 'Missing params' });
  }

  const lockReleased = lockManager.releaseHold(eventId, seatId, holdId);
  if (!lockReleased) return res.status(400).json({ success: false, message: 'Invalid or expired holdId' });

  try {
    // Begin Transaction
    await pool.query('BEGIN');
    
    // Lock check in DB
    const checkRes = await pool.query(
      'SELECT 1 FROM bookings WHERE event_id = $1 AND seat_number = $2 AND status = $3 FOR UPDATE',
      [eventId, seatId, 'confirmed']
    );
    
    if (checkRes.rowCount > 0) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ success: false, message: 'Seat already booked' });
    }

    const eventRes = await pool.query('SELECT price_standard FROM events WHERE id = $1', [eventId]);
    const finalPrice = eventRes.rowCount > 0 ? eventRes.rows[0].price_standard : 1200;

    let agentId = null;
    if (promoCode) {
      const agentRes = await pool.query('SELECT id FROM agents WHERE promo_code = $1', [promoCode.toUpperCase()]);
      if (agentRes.rowCount > 0) agentId = agentRes.rows[0].id;
    }

    const insertRes = await pool.query(
      `INSERT INTO bookings (event_id, customer_name, customer_email, customer_phone, seat_number, seat_category, price_paid, status, agent_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [eventId, customerInfo.name, customerInfo.email, customerInfo.phone, seatId, 'standard', finalPrice, 'confirmed', agentId]
    );

    // [INTEGRATION] YooKassa Split Payment (Сплитование)
    let paymentSplit = [];
    if (agentId) {
      const agentRes = await pool.query('SELECT commission_rate FROM agents WHERE id = $1', [agentId]);
      if (agentRes.rowCount > 0) {
        const commission = parseFloat(agentRes.rows[0].commission_rate);
        const agentShare = finalPrice * commission;
        const platformShare = finalPrice * 0.05; // 5% platform fee
        const ownerShare = finalPrice - agentShare - platformShare;
        
        paymentSplit = [
          { type: 'shop', shop_id: 'SHIP_OWNER_ID', amount: { value: ownerShare, currency: 'RUB' } },
          { type: 'shop', shop_id: 'AGENT_ID', amount: { value: agentShare, currency: 'RUB' } },
          { type: 'shop', shop_id: 'PLATFORM_ID', amount: { value: platformShare, currency: 'RUB' } }
        ];
        console.log(`Payment split calculated:`, paymentSplit);
      }
    }

    await pool.query('COMMIT');

    res.json({
      success: true,
      data: { 
        bookingId: insertRes.rows[0].id, 
        message: 'Booking confirmed',
        billingSplit: paymentSplit.length > 0 ? paymentSplit : undefined
      }
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Yandex Cloud API Gateway running on port ${PORT}`));
