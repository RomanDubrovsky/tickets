const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('./db');

// Load all fleet ship seating layouts
const fleetLayouts = {};
const schemesDir = path.join(__dirname, 'schemes');
try {
    if (fs.existsSync(schemesDir)) {
        fs.readdirSync(schemesDir).forEach(file => {
            if (file.endsWith('.json')) {
                fleetLayouts[file] = JSON.parse(fs.readFileSync(path.join(schemesDir, file), 'utf8'));
            }
        });
    }
} catch (e) {
    console.error('Error loading schemes directory:', e);
}

let defaultSeatsLayout = fleetLayouts['moskva_125.json'] || [];
try {
    const layoutPath = path.join(__dirname, 'seats_layout.json');
    if (fs.existsSync(layoutPath)) {
        defaultSeatsLayout = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
    }
} catch (e) {
    console.error('Error loading seats_layout.json:', e);
}

function getVenueLayout(schemeFileOrVenueId) {
    if (!schemeFileOrVenueId) return defaultSeatsLayout;
    if (fleetLayouts[schemeFileOrVenueId]) return fleetLayouts[schemeFileOrVenueId];
    const str = String(schemeFileOrVenueId);
    if (str === '1' || str.includes('vhodnye') || str.includes('Входные')) return fleetLayouts['vhodnye_60.json'] || defaultSeatsLayout;
    if (str === '2' || str.includes('125')) return fleetLayouts['moskva_125.json'] || defaultSeatsLayout;
    if (str === '3' || str.includes('177')) return fleetLayouts['moskva_177.json'] || defaultSeatsLayout;
    if (str === '4' || str.includes('201')) return fleetLayouts['moskva_201.json'] || defaultSeatsLayout;
    return defaultSeatsLayout;
}

// Basic Authentication configuration
const TL_AUTH = {
    username: process.env.TL_API_USER || 'ticketland_partner',
    password: process.env.TL_API_PASSWORD || 'neva_ships_2026_tl'
};

// Authentication Middleware per Ticketland standard:
// HTTP 401 if missing header, HTTP 403 if invalid credentials
function authenticateTL(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Ticketland Gateway"');
        return res.status(401).json({ code: 401, message: 'Authorization header required' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Basic') {
        return res.status(403).json({ code: 403, message: 'Invalid authorization format. Basic auth required.' });
    }

    const credentials = Buffer.from(parts[1], 'base64').toString('utf8').split(':');
    const user = credentials[0];
    const pass = credentials[1];

    if (user !== TL_AUTH.username || pass !== TL_AUTH.password) {
        return res.status(403).json({ code: 403, message: 'Access denied: invalid credentials.' });
    }

    next();
}

// Ensure response header Content-Type is always application/json
router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Apply auth to all gateway routes
router.use(authenticateTL);

/**
 * Helper: Format Date object to Ticketland protocol format: yyyy-MM-ddTHH-mm-ss
 */
function formatTLDate(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}-${min}-${ss}`;
}

/**
 * Helper: Parse Ticketland date format (yyyy-MM-ddTHH-mm-ss or ISO) into JS Date
 */
function parseTLDate(str) {
    if (!str) return null;
    // Format: 2015-03-23T18-45-00 -> 2015-03-23T18:45:00
    const normalized = str.replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3');
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Helper: Format decimal numbers to strict string with 2 decimals
 */
function formatTLPrice(val) {
    const num = parseFloat(val) || 0;
    return num.toFixed(2);
}

/**
 * Ensure database tables for Ticketland operations exist
 */
db.serialize(() => {
    db.run("ALTER TABLE sessions ADD COLUMN ticketland_quota INTEGER DEFAULT NULL", () => {});

    // Ticketland Baskets (Locks)
    db.run(`CREATE TABLE IF NOT EXISTS tl_baskets (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL
    )`);

    // Ticketland Locked Items
    db.run(`CREATE TABLE IF NOT EXISTS tl_locked_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        basket_id TEXT NOT NULL,
        performance_id TEXT NOT NULL,
        place_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(performance_id, place_id)
    )`);

    // Ticketland Orders
    db.run(`CREATE TABLE IF NOT EXISTS tl_orders (
        id TEXT PRIMARY KEY,
        basket_id TEXT,
        customer_id TEXT,
        customer_name TEXT,
        customer_surname TEXT,
        customer_patronymic TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        status TEXT DEFAULT 'created',
        payment_pushkin INTEGER DEFAULT 0,
        sale_on_frame INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        confirmed_at DATETIME,
        expires_at DATETIME NOT NULL
    )`);

    // Ticketland Order Items
    db.run(`CREATE TABLE IF NOT EXISTS tl_order_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        performance_id TEXT NOT NULL,
        place_id TEXT NOT NULL,
        price REAL NOT NULL,
        barcode TEXT NOT NULL,
        barcode_type TEXT DEFAULT 'interleaved_2_of_5',
        spectator_dit_id TEXT,
        spectator_surname TEXT,
        spectator_name TEXT,
        spectator_patronymic TEXT,
        status TEXT DEFAULT 'ordered', -- ordered, confirmed, returned
        returned_price REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(order_id, performance_id, place_id)
    )`);

    // Sales audit log for salesReport
    db.run(`CREATE TABLE IF NOT EXISTS tl_sales_audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        performance_id TEXT NOT NULL,
        place_id TEXT NOT NULL,
        operation_type TEXT NOT NULL, -- 'sale' or 'return'
        price REAL NOT NULL,
        operation_time DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Periodic cleaner for expired locks and unconfirmed orders
setInterval(() => {
    const nowIso = new Date().toISOString();
    db.run(`DELETE FROM tl_locked_tickets WHERE basket_id IN (
        SELECT id FROM tl_baskets WHERE expires_at < ?
    )`, [nowIso]);
    db.run(`DELETE FROM tl_baskets WHERE expires_at < ?`, [nowIso]);
    db.run(`UPDATE tl_orders SET status = 'expired' WHERE status = 'created' AND expires_at < ?`, [nowIso]);
}, 60000);

// =========================================================================
// 1. КОНСТРУКТИВ: GET /constructive
// =========================================================================
router.get('/constructive', (req, res) => {
    let segments = req.query.segment || req.query['segment[]'];
    if (!segments) {
        return res.status(500).json({ code: 101, message: 'Parameter segment[] is required' });
    }
    if (!Array.isArray(segments)) {
        segments = [segments];
    }

    const hallId = req.query.hallId ? String(req.query.hallId) : null;
    const hallVersion = req.query.hallVersion ? String(req.query.hallVersion) : null;

    let query = `SELECT v.*, d.name as domain_name FROM venues v LEFT JOIN domains d ON v.domain_id = d.id`;
    const params = [];
    if (hallId) {
        query += ` WHERE v.id = ?`;
        params.push(hallId);
    }

    db.all(query, params, (err, venues) => {
        if (err) {
            return res.status(500).json({ code: 500, message: 'Database error: ' + err.message });
        }

        const response = {};

        // 1. buildings: Причалы / Здания
        if (segments.includes('building')) {
            const buildingMap = {};
            venues.forEach(v => {
                const bId = 'pier-1';
                if (!buildingMap[bId]) {
                    buildingMap[bId] = {
                        id: bId,
                        name: 'Причал Английская наб., 28 (Сенатская пристань / Медный всадник)'
                    };
                }
            });
            response.buildings = Object.values(buildingMap);
        }

        // 2. halls: Теплоходы (Залы)
        if (segments.includes('hall')) {
            response.halls = venues.map(v => ({
                id: String(v.id),
                name: v.name,
                printName: v.name,
                buildingId: 'pier-1'
            }));
        }

        // 3. sections: Секции / Зоны палуб (2-палубный теплоход «Рок Хит Нева» и аналогичные)
        if (segments.includes('section')) {
            response.sections = [
                {
                    id: '1',
                    name: 'Главная палуба — VIP Нос (Панорама)',
                    printName: 'VIP Нос',
                    coordinates: [
                        { x: 670, y: 120 },
                        { x: 840, y: 120 },
                        { x: 840, y: 280 },
                        { x: 670, y: 280 }
                    ]
                },
                {
                    id: '2',
                    name: 'Главная палуба — VIP Салон у сцены',
                    printName: 'VIP Салон (Сцена)',
                    coordinates: [
                        { x: 490, y: 120 },
                        { x: 660, y: 120 },
                        { x: 660, y: 280 },
                        { x: 490, y: 280 }
                    ]
                },
                {
                    id: '3',
                    name: 'Главная палуба — Салон (Танцпол и Бар)',
                    printName: 'Салон (Танцпол)',
                    coordinates: [
                        { x: 320, y: 120 },
                        { x: 480, y: 120 },
                        { x: 480, y: 280 },
                        { x: 320, y: 280 }
                    ]
                },
                {
                    id: '4',
                    name: 'Верхняя палуба — Закрытый салон (DJ/Гид)',
                    printName: 'Верхняя палуба (Закрытая)',
                    coordinates: [
                        { x: 340, y: 460 },
                        { x: 660, y: 460 },
                        { x: 660, y: 640 },
                        { x: 340, y: 640 }
                    ]
                },
                {
                    id: '5',
                    name: 'Верхняя палуба — Открытая палуба (Корма)',
                    printName: 'Верхняя палуба (Открытая)',
                    coordinates: [
                        { x: 80, y: 460 },
                        { x: 330, y: 460 },
                        { x: 330, y: 640 },
                        { x: 80, y: 640 }
                    ]
                }
            ];
        }

        // Auxiliary hallVersions if hallId and hallVersion were supplied
        if (hallId && hallVersion) {
            response.hallVersions = [
                {
                    hallId: String(hallId),
                    hallVersion: String(hallVersion),
                    sectionIds: ['1', '2', '3', '4', '5']
                }
            ];
        }

        // 4. places: Места на схеме
        if (segments.includes('place')) {
            const seats = getVenueLayout(hallId);
            response.places = seats.map(s => ({
                id: String(s.id),
                sectionId: String(s.sectionId),
                row: String(s.row),
                rowMetric: s.rowMetric || 'Ряд',
                seat: String(s.seat),
                seatMetric: s.seatMetric || 'Место',
                coordinate: s.coordinate
            }));
        }

        res.json(response);
    });
});

// =========================================================================
// 2. РЕПЕРТУАР: GET /repertoire
// =========================================================================
router.get('/repertoire', (req, res) => {
    const fromInclusive = req.query.fromInclusive ? parseTLDate(req.query.fromInclusive) : null;
    const tillExclusive = req.query.tillExclusive ? parseTLDate(req.query.tillExclusive) : null;

    let query = `
        SELECT 
            s.id as session_id, s.start_time, s.venue_id,
            e.id as event_id, e.title as event_title, e.age_restriction, e.duration_minutes, e.music_genre,
            e.image_url, e.short_desc, e.full_desc,
            v.name as venue_name
        FROM sessions s
        JOIN events e ON s.event_id = e.id
        LEFT JOIN venues v ON s.venue_id = v.id
        WHERE s.status = 'active' AND s.sync_ticketland = 1
    `;
    const params = [];

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ code: 500, message: 'Database error: ' + err.message });
        }

        // Filter dates in JS to support varied format inputs cleanly
        let filtered = rows;
        if (fromInclusive || tillExclusive) {
            filtered = rows.filter(r => {
                const sDate = new Date(r.start_time);
                if (fromInclusive && sDate < fromInclusive) return false;
                if (tillExclusive && sDate >= tillExclusive) return false;
                return true;
            });
        }

        // 1. Organizers
        const organizers = [
            {
                id: '1',
                name: 'ООО «Морские корабли»'
            },
            {
                id: '2',
                name: 'ИП Юницына Валерия Николаевна'
            }
        ];

        // 2. Shows
        const showMap = {};
        filtered.forEach(r => {
            if (!showMap[r.event_id]) {
                let minAge = 18;
                if (r.age_restriction) {
                    const match = r.age_restriction.match(/\d+/);
                    if (match) minAge = parseInt(match[0], 10);
                }
                showMap[r.event_id] = {
                    id: String(r.event_id),
                    name: r.event_title,
                    type: r.music_genre ? `Концерт / ${r.music_genre}` : 'Музыкальный круиз',
                    minAge: minAge,
                    durationInMinutes: r.duration_minutes || 120,
                    image: r.image_url || 'https://rockhitneva.ru/wp-content/uploads/2024/03/logo1.png',
                    description: r.short_desc || r.full_desc || 'Музыкальный круиз по Неве и Финскому заливу с живой программой на борту теплохода.',
                    organizerId: '1'
                };
            }
        });

        // 3. Performances (sessions)
        const performances = filtered.map(r => ({
            id: String(r.session_id),
            hallId: String(r.venue_id || 2),
            hallVersion: '1',
            showId: String(r.event_id),
            beginTime: formatTLDate(r.start_time),
            spectatorPersonalDataRequired: false
        }));

        res.json({
            organizers: organizers,
            shows: Object.values(showMap),
            performances: performances
        });
    });
});

// =========================================================================
// 3. МОДИФИЦИРОВАННЫЙ РЕПЕРТУАР: GET /modifiedRepertoire
// =========================================================================
router.get('/modifiedRepertoire', (req, res) => {
    const currentTag = formatTLDate(new Date()).replace(/[-T:]/g, '_');
    
    // Return ONLY approved sessions that have sync_ticketland = 1
    db.all(`SELECT id FROM sessions WHERE status = 'active' AND sync_ticketland = 1`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ code: 500, message: err.message });
        }
        res.json({
            modificationTag: currentTag,
            performances: rows.map(r => String(r.id))
        });
    });
});

// =========================================================================
// 4. СПИСОК ДОСТУПНЫХ БИЛЕТОВ: GET /tickets
// =========================================================================
router.get('/tickets', (req, res) => {
    const performanceId = req.query.performanceId;
    if (!performanceId) {
        return res.status(500).json({ code: 101, message: 'performanceId parameter required' });
    }

    // Check if session is approved for Ticketland sync
    db.get(`
        SELECT s.id, s.min_price as session_price, s.sync_ticketland, s.ticketland_quota, s.venue_id, v.scheme_file, v.ship_model
        FROM sessions s
        LEFT JOIN venues v ON s.venue_id = v.id
        WHERE s.id = ? AND s.status = 'active'
    `, [performanceId], (err, sess) => {
        if (err || !sess || sess.sync_ticketland !== 1) {
            return res.status(500).json({ code: 102, message: 'Performance not found or not published to Ticketland' });
        }

        const basePrice = sess.session_price || 1750;

        // Fetch custom zone price tiers for this session if configured
        db.all(`SELECT section_id, price FROM ticket_tiers WHERE session_id = ?`, [performanceId], (tierErr, tiers) => {
            const zonePriceMap = {};
            if (tiers && tiers.length > 0) {
                tiers.forEach(t => {
                    if (t.section_id) {
                        zonePriceMap[String(t.section_id)] = parseFloat(t.price);
                    }
                });
            }

            // Query occupied places (locks + orders)
            const nowIso = new Date().toISOString();
            const busyQuery = `
                SELECT place_id FROM tl_locked_tickets lt
                JOIN tl_baskets b ON lt.basket_id = b.id
                WHERE lt.performance_id = ? AND b.expires_at > ?
                UNION
                SELECT place_id FROM tl_order_tickets ot
                JOIN tl_orders o ON ot.order_id = o.id
                WHERE ot.performance_id = ? AND ot.status IN ('ordered', 'confirmed') AND (o.status = 'confirmed' OR o.expires_at > ?)
            `;

            db.all(busyQuery, [performanceId, nowIso, performanceId, nowIso], (bErr, busyRows) => {
                if (bErr) {
                    return res.status(500).json({ code: 500, message: bErr.message });
                }

                const busySet = new Set(busyRows.map(r => String(r.place_id)));
                const availableTickets = [];

                const venueSeats = getVenueLayout(sess.scheme_file || sess.venue_id);
                venueSeats.forEach(seat => {
                    const pId = String(seat.id);
                    if (!busySet.has(pId)) {
                        const secId = String(seat.sectionId || '5');
                        // 1) Zone-specific price from ticket_tiers (if manager customized it)
                        // 2) Fallback to 5-zone graduated pricing:
                        let seatPrice = zonePriceMap[secId];
                        if (seatPrice === undefined) {
                            if (sess.ship_model === 'Входные 60' || sess.scheme_file === 'vhodnye_60.json') {
                                seatPrice = basePrice;
                            } else {
                                if (secId === '1') seatPrice = basePrice + 3000; // VIP Нос ~ 4750-5000
                                else if (secId === '2') seatPrice = basePrice + 1250; // VIP Салон/Сцена ~ 3000
                                else if (secId === '3') seatPrice = basePrice + 750;  // Салон Танцпол/Бар ~ 2500
                                else if (secId === '4') seatPrice = basePrice + 200;  // Верхняя закрытая ~ 1950
                                else seatPrice = basePrice;                          // Верхняя открытая ~ 1750
                            }
                        }

                        availableTickets.push({
                            placeId: pId,
                            performanceId: String(performanceId),
                            price: formatTLPrice(seatPrice)
                        });
                    }
                });

                let resultTickets = availableTickets;
                if (sess.ticketland_quota && Number(sess.ticketland_quota) > 0) {
                    resultTickets = resultTickets.slice(0, Number(sess.ticketland_quota));
                }

                res.json({ tickets: resultTickets });
            });
        });
    });
});

// =========================================================================
// 5. БЛОКИРОВКА МЕСТА (В КОРЗИНУ): POST /lockTicket
// =========================================================================
router.post('/lockTicket', (req, res) => {
    const { performanceId, placeId, basketId: reqBasketId } = req.body;

    if (!performanceId || !placeId) {
        return res.status(500).json({ code: 101, message: 'performanceId and placeId are required' });
    }

    const TTL_SECONDS = 900; // 15 minutes lock
    const basketId = reqBasketId || ('bkt_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6));
    const expiresAt = new Date(Date.now() + TTL_SECONDS * 1000).toISOString();
    const nowIso = new Date().toISOString();

    // Check if ticket is already locked or ordered
    const checkQuery = `
        SELECT lt.basket_id FROM tl_locked_tickets lt
        JOIN tl_baskets b ON lt.basket_id = b.id
        WHERE lt.performance_id = ? AND lt.place_id = ? AND b.expires_at > ?
        UNION
        SELECT ot.order_id FROM tl_order_tickets ot
        JOIN tl_orders o ON ot.order_id = o.id
        WHERE ot.performance_id = ? AND ot.place_id = ? AND ot.status IN ('ordered', 'confirmed') AND (o.status = 'confirmed' OR o.expires_at > ?)
    `;

    db.get(checkQuery, [performanceId, placeId, nowIso, performanceId, placeId, nowIso], (err, busy) => {
        if (err) return res.status(500).json({ code: 500, message: err.message });
        if (busy) {
            return res.status(500).json({ code: 201, message: 'Билет уже находится в корзине или продан' });
        }

        // Upsert basket
        db.run(`INSERT OR REPLACE INTO tl_baskets (id, expires_at) VALUES (?, ?)`, [basketId, expiresAt], (bErr) => {
            if (bErr) return res.status(500).json({ code: 500, message: bErr.message });

            // Insert locked ticket
            db.run(`INSERT OR REPLACE INTO tl_locked_tickets (basket_id, performance_id, place_id) VALUES (?, ?, ?)`,
                [basketId, String(performanceId), String(placeId)], (lErr) => {
                    if (lErr) return res.status(500).json({ code: 500, message: lErr.message });

                    res.json({
                        basketId: basketId,
                        ttlInSeconds: TTL_SECONDS
                    });
                }
            );
        });
    });
});

// =========================================================================
// 6. РАЗБЛОКИРОВКА МЕСТА: POST /unlockTicket (идемпотентный)
// =========================================================================
router.post('/unlockTicket', (req, res) => {
    const { performanceId, placeId, basketId } = req.body;
    if (!performanceId || !placeId || !basketId) {
        return res.status(500).json({ code: 101, message: 'performanceId, placeId, basketId required' });
    }

    db.run(`DELETE FROM tl_locked_tickets WHERE basket_id = ? AND performance_id = ? AND place_id = ?`,
        [basketId, String(performanceId), String(placeId)], () => {
            // Must return empty JSON per protocol
            res.json({});
        }
    );
});

// =========================================================================
// 7. СПИСОК БИЛЕТОВ В КОРЗИНЕ: GET /lockedTickets
// =========================================================================
router.get('/lockedTickets', (req, res) => {
    const basketId = req.query.basketId;
    if (!basketId) {
        return res.status(500).json({ code: 101, message: 'basketId parameter required' });
    }

    const nowIso = new Date().toISOString();
    db.get(`SELECT * FROM tl_baskets WHERE id = ? AND expires_at > ?`, [basketId, nowIso], (err, basket) => {
        if (err || !basket) {
            return res.status(500).json({ code: 202, message: 'Корзина не найдена или срок её действия истек' });
        }

        db.all(`SELECT performance_id, place_id FROM tl_locked_tickets WHERE basket_id = ?`, [basketId], (lErr, rows) => {
            if (lErr) return res.status(500).json({ code: 500, message: lErr.message });

            const tickets = rows.map(r => ({
                performanceId: String(r.performance_id),
                placeId: String(r.place_id),
                spectatorPersonalDataRequired: false
            }));

            res.json({ tickets: tickets });
        });
    });
});

// =========================================================================
// 8. СОЗДАНИЕ ЗАКАЗА: POST /createOrder
// =========================================================================
router.post('/createOrder', (req, res) => {
    const { basketId, customer, ticketExtras } = req.body;
    if (!basketId) {
        return res.status(500).json({ code: 300, message: 'basketId required' });
    }

    const nowIso = new Date().toISOString();
    db.get(`SELECT * FROM tl_baskets WHERE id = ? AND expires_at > ?`, [basketId, nowIso], (err, basket) => {
        if (err || !basket) {
            return res.status(500).json({ code: 300, message: 'Не удалось создать заказ: корзина не найдена или истекла' });
        }

        db.all(`SELECT performance_id, place_id FROM tl_locked_tickets WHERE basket_id = ?`, [basketId], (lErr, lockedRows) => {
            if (lErr || !lockedRows || lockedRows.length === 0) {
                return res.status(500).json({ code: 300, message: 'В указанной корзине нет заблокированных билетов' });
            }

            const orderId = String(Date.now()).slice(-8) + Math.floor(Math.random() * 90 + 10);
            const ORDER_TTL_SECONDS = 172800; // 48 hours to confirm
            const expiresAt = new Date(Date.now() + ORDER_TTL_SECONDS * 1000).toISOString();

            const c = customer || {};

            db.run(`INSERT INTO tl_orders (
                id, basket_id, customer_id, customer_name, customer_surname, 
                customer_patronymic, customer_phone, customer_email, expires_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [orderId, basketId, c.id || '', c.name || '', c.surname || '', c.patronymic || '', c.phone || '', c.email || '', expiresAt],
                (oErr) => {
                    if (oErr) return res.status(500).json({ code: 300, message: 'Ошибка сохранения заказа: ' + oErr.message });

                    const resultTickets = [];
                    const stmt = db.prepare(`
                        INSERT INTO tl_order_tickets (
                            order_id, performance_id, place_id, price, barcode,
                            spectator_dit_id, spectator_surname, spectator_name, spectator_patronymic
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    lockedRows.forEach(l => {
                        const extra = (ticketExtras || []).find(te => 
                            String(te.performanceId) === String(l.performance_id) && 
                            String(te.placeId) === String(l.place_id)
                        );

                        // Price validation or default
                        const price = extra && extra.price ? parseFloat(extra.price) : 1500;
                        const pData = (extra && extra.spectatorPersonalData) || {};

                        // Generate unique barcode (e.g., 29384742312032)
                        const barcode = '293' + Date.now().toString().slice(-9) + String(l.place_id).padStart(2, '0');

                        stmt.run([
                            orderId, String(l.performance_id), String(l.place_id), price, barcode,
                            pData.ditId || '', pData.surname || '', pData.name || '', pData.patronymic || ''
                        ]);

                        resultTickets.push({
                            performanceId: String(l.performance_id),
                            placeId: String(l.place_id)
                        });
                    });

                    stmt.finalize(() => {
                        // Free basket locks as they are now transferred to order
                        db.run(`DELETE FROM tl_locked_tickets WHERE basket_id = ?`, [basketId]);

                        res.json({
                            orderId: orderId,
                            ttlInSeconds: ORDER_TTL_SECONDS,
                            tickets: resultTickets
                        });
                    });
                }
            );
        });
    });
});

// =========================================================================
// 9. ДАННЫЕ ДЛЯ ПЕЧАТИ ЗАКАЗА: GET /printableOrderData
// =========================================================================
router.get('/printableOrderData', (req, res) => {
    const orderId = req.query.orderId;
    if (!orderId) {
        return res.status(500).json({ code: 101, message: 'orderId parameter required' });
    }

    db.all(`SELECT * FROM tl_order_tickets WHERE order_id = ?`, [orderId], (err, rows) => {
        if (err || !rows || rows.length === 0) {
            return res.status(500).json({ code: 150, message: 'Заказ не найден' });
        }

        const tickets = rows.map(r => ({
            performanceId: String(r.performance_id),
            placeId: String(r.place_id),
            barcode: {
                value: r.barcode,
                type: r.barcode_type || 'interleaved_2_of_5'
            }
        }));

        res.json({ tickets: tickets });
    });
});

// =========================================================================
// 10. ПОДТВЕРЖДЕНИЕ ЗАКАЗА (ВЫКУП): POST /confirmOrder
// =========================================================================
router.post('/confirmOrder', (req, res) => {
    const { orderId, time, paymentPushkinCard, saleOnYourFrame } = req.body;
    if (!orderId) {
        return res.status(500).json({ code: 101, message: 'orderId parameter required' });
    }

    db.get(`SELECT * FROM tl_orders WHERE id = ?`, [orderId], (err, order) => {
        if (err || !order) {
            return res.status(500).json({ code: 250, message: 'Заказ не найден' });
        }

        const now = new Date().toISOString();
        db.run(`UPDATE tl_orders SET 
            status = 'confirmed', 
            confirmed_at = ?,
            payment_pushkin = ?,
            sale_on_frame = ?
            WHERE id = ?`,
            [now, paymentPushkinCard ? 1 : 0, saleOnYourFrame ? 1 : 0, orderId],
            (uErr) => {
                if (uErr) return res.status(500).json({ code: 500, message: uErr.message });

                // Mark tickets confirmed and record to audit table
                db.all(`SELECT * FROM tl_order_tickets WHERE order_id = ?`, [orderId], (tErr, tickets) => {
                    if (tErr) return res.status(500).json({ code: 500, message: tErr.message });

                    const opTime = time ? formatTLDate(parseTLDate(time) || new Date()) : formatTLDate(new Date());
                    const auditStmt = db.prepare(`
                        INSERT INTO tl_sales_audit (order_id, performance_id, place_id, operation_type, price, operation_time)
                        VALUES (?, ?, ?, 'sale', ?, ?)
                    `);

                    tickets.forEach(t => {
                        auditStmt.run([orderId, t.performance_id, t.place_id, t.price, opTime]);
                    });

                    auditStmt.finalize(() => {
                        db.run(`UPDATE tl_order_tickets SET status = 'confirmed' WHERE order_id = ?`, [orderId], () => {
                            // If all tickets confirmed without error, return tickets array
                            const result = tickets.map(t => ({
                                performanceId: String(t.performance_id),
                                placeId: String(t.place_id)
                            }));
                            res.json({ tickets: result });
                        });
                    });
                });
            }
        );
    });
});

// =========================================================================
// 11. БИЛЕТЫ В ЗАКАЗЕ: GET /orderedTickets
// =========================================================================
router.get('/orderedTickets', (req, res) => {
    const orderId = req.query.orderId;
    if (!orderId) {
        return res.status(500).json({ code: 101, message: 'orderId parameter required' });
    }

    db.all(`SELECT performance_id, place_id FROM tl_order_tickets WHERE order_id = ?`, [orderId], (err, rows) => {
        if (err || !rows || rows.length === 0) {
            return res.status(500).json({ code: 404, message: 'Заказ не найден' });
        }

        res.json({
            tickets: rows.map(r => ({
                performanceId: String(r.performance_id),
                placeId: String(r.place_id)
            }))
        });
    });
});

// =========================================================================
// 12. ОБНОВЛЕНИЕ ДАННЫХ ЗРИТЕЛЕЙ: PUT /changeOrder/spectators
// =========================================================================
router.put('/changeOrder/spectators', (req, res) => {
    const { orderId, ticketExtras } = req.body;
    if (!orderId || !ticketExtras || !Array.isArray(ticketExtras)) {
        return res.status(404).json({ error: { code: 404, message: 'Отсутствует указанный заказ или место в заказе' } });
    }

    db.get(`SELECT id FROM tl_orders WHERE id = ?`, [orderId], (err, order) => {
        if (err || !order) {
            return res.status(404).json({ error: { code: 404, message: 'Отсутствует указанный заказ или место в заказе' } });
        }

        const stmt = db.prepare(`
            UPDATE tl_order_tickets 
            SET spectator_dit_id = ?, spectator_surname = ?, spectator_name = ?, spectator_patronymic = ?
            WHERE order_id = ? AND performance_id = ? AND place_id = ?
        `);

        ticketExtras.forEach(te => {
            const sp = te.spectatorPersonalData || {};
            stmt.run([sp.ditId || '', sp.surname || '', sp.name || '', sp.patronymic || '', orderId, String(te.performanceId), String(te.placeId)]);
        });

        stmt.finalize(() => {
            // Success: empty json with status 200 per protocol specification
            res.json({});
        });
    });
});

// =========================================================================
// 13. АННУЛИРОВАНИЕ ЗАКАЗА: POST /removeOrder (идемпотентный)
// =========================================================================
router.post('/removeOrder', (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        return res.status(500).json({ code: 101, message: 'orderId parameter required' });
    }

    db.get(`SELECT * FROM tl_orders WHERE id = ?`, [orderId], (err, order) => {
        if (err || !order) {
            // Idempotent: return empty tickets if order does not exist
            return res.json({ tickets: [] });
        }

        db.run(`UPDATE tl_orders SET status = 'cancelled' WHERE id = ?`, [orderId], () => {
            db.run(`UPDATE tl_order_tickets SET status = 'cancelled' WHERE order_id = ?`, [orderId], () => {
                res.json({ tickets: [] });
            });
        });
    });
});

// =========================================================================
// 14. ВОЗВРАТ БИЛЕТОВ (193-ФЗ): POST /returnTickets
// =========================================================================
router.post('/returnTickets', (req, res) => {
    const { orderId, time, tickets } = req.body;
    if (!orderId || !tickets || !Array.isArray(tickets)) {
        return res.status(500).json({ code: 101, message: 'orderId and tickets array required' });
    }

    db.get(`SELECT * FROM tl_orders WHERE id = ?`, [orderId], (err, order) => {
        if (err || !order) {
            return res.status(500).json({ code: 350, message: 'Заказ не найден' });
        }

        const opTime = time ? formatTLDate(parseTLDate(time) || new Date()) : formatTLDate(new Date());
        const auditStmt = db.prepare(`
            INSERT INTO tl_sales_audit (order_id, performance_id, place_id, operation_type, price, operation_time)
            VALUES (?, ?, ?, 'return', ?, ?)
        `);

        const updateStmt = db.prepare(`
            UPDATE tl_order_tickets 
            SET status = 'returned', returned_price = ? 
            WHERE order_id = ? AND performance_id = ? AND place_id = ?
        `);

        tickets.forEach(t => {
            const rPrice = parseFloat(t.returnPrice || t.price || 0);
            updateStmt.run([rPrice, orderId, String(t.performanceId), String(t.placeId)]);
            auditStmt.run([orderId, String(t.performanceId), String(t.placeId), rPrice, opTime]);
        });

        auditStmt.finalize();
        updateStmt.finalize(() => {
            // If all tickets processed successfully without errors, tickets array is empty per protocol
            res.json({ tickets: [] });
        });
    });
});

// =========================================================================
// 15. ОТЧЕТ О ПРОДАЖАХ ДЛЯ СВЕРКИ: GET /salesReport
// =========================================================================
router.get('/salesReport', (req, res) => {
    const { fromInclusive, tillExclusive } = req.query;

    const fromDate = fromInclusive ? parseTLDate(fromInclusive) : null;
    const tillDate = tillExclusive ? parseTLDate(tillExclusive) : null;

    db.all(`SELECT * FROM tl_sales_audit ORDER BY id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ code: 500, message: err.message });

        let filtered = rows;
        if (fromDate || tillDate) {
            filtered = rows.filter(r => {
                const opD = parseTLDate(r.operation_time);
                if (fromDate && opD < fromDate) return false;
                if (tillDate && opD >= tillDate) return false;
                return true;
            });
        }

        const result = filtered.map(r => ({
            performanceId: String(r.performance_id),
            placeId: String(r.place_id),
            operationTime: r.operation_time,
            operationType: r.operation_type,
            price: formatTLPrice(r.price)
        }));

        res.json({ tickets: result });
    });
});

router.getVenueLayout = getVenueLayout;
router.fleetLayouts = fleetLayouts;
module.exports = router;
