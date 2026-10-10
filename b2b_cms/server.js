const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const builder = require('./builder');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded password for managers
const ADMIN_PASSWORD = 'password123';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS for API requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const fs = require('fs');
const http = require('http');

// Multi-tenant public domain serving middleware
app.use((req, res, next) => {
    const rawHost = (req.headers['x-forwarded-host'] || req.headers.host || '').split(':')[0].toLowerCase();
    
    // Pass API, admin & management domains to admin router
    if (req.path.startsWith('/api/') || rawHost.includes('admin') || rawHost.includes('cms') || rawHost === 'localhost' || rawHost === '127.0.0.1' || rawHost.includes('yandexcloud.net')) {
        return next();
    }
    
    // Map requested host to domain
    let matchedDomain = null;
    if (rawHost.includes('nevaconcert')) matchedDomain = 'nevaconcert.ru';
    else if (rawHost.includes('gradnaneve')) matchedDomain = 'gradnaneve.ru';
    else if (rawHost.includes('aquasound')) matchedDomain = 'aquasound.club';
    else if (rawHost.includes('rockhit')) matchedDomain = 'rockhitneva.ru';
    else if (rawHost.includes('gurvich')) matchedDomain = 'gurvich.in';
    
    if (matchedDomain) {
        const distDir = path.join(__dirname, 'dist', matchedDomain);
        let reqPath = decodeURIComponent(req.path).replace(/^\/+|\/+$/g, '');
        const ext = path.extname(reqPath).toLowerCase();
        const isAsset = ext || reqPath.startsWith('wp-content') || reqPath.startsWith('wp-includes') || reqPath.startsWith('static') || reqPath.startsWith('data');
        
        // 1. Check if direct file exists in dist/<matchedDomain>/
        if (reqPath) {
            const directFile = path.join(distDir, reqPath);
            if (fs.existsSync(directFile) && fs.statSync(directFile).isFile()) {
                return res.sendFile(directFile);
            }
            
            // Check direct .html extension
            const directHtml = path.join(distDir, reqPath + '.html');
            if (fs.existsSync(directHtml) && fs.statSync(directHtml).isFile()) {
                return res.sendFile(directHtml);
            }
            
            // Check in static_assets
            const sharedStatic = path.join(__dirname, 'static_assets', reqPath.replace(/^static\//, ''));
            if (fs.existsSync(sharedStatic) && fs.statSync(sharedStatic).isFile()) {
                return res.sendFile(sharedStatic);
            }

            // Check across all dist folders for standard wordpress/flatsome files
            for (const otherDom of ['nevaconcert.ru', 'gradnaneve.ru', 'rockhitneva.ru', 'aquasound.club']) {
                const otherFile = path.join(__dirname, 'dist', otherDom, reqPath);
                if (fs.existsSync(otherFile) && fs.statSync(otherFile).isFile()) {
                    return res.sendFile(otherFile);
                }
            }
            
            // If it's an asset (JS, CSS, font, image) and not found locally, return 404 immediately
            if (isAsset) {
                return res.status(404).end();
            }
            
            // 2. Subpage index.html (e.g. dist/nevaconcert.ru/оферта/index.html)
            const subpageFile = path.join(distDir, reqPath, 'index.html');
            if (fs.existsSync(subpageFile)) {
                return res.sendFile(subpageFile);
            }
        }
        
        // 3. Main home page (only if not an asset request!)
        if (!isAsset) {
            const indexFile = path.join(distDir, 'index.html');
            if (fs.existsSync(indexFile)) {
                return res.sendFile(indexFile);
            }
        }
    }
    
    next();
});

app.use(session({
    secret: 'b2b_cms_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Middleware для проверки авторизации
function requireAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

const STANDARD_TICKETLAND_GATEWAYS = [
    {
        id: 3,
        name: 'ИП Юницына Валерия Николаевна (Рок Хит Нева)',
        code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "389069140c1ca808d0da0b0007a4fe33",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
    },
    {
        id: 4,
        name: 'ИП Юницына Валерия Николаевна (Акватория)',
        code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
    },
    {
        id: 1,
        name: 'ООО «Морские корабли» (Рок Хит Нева)',
        code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "0b2b641d60f7f9443e566d47c89d208f",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
    },
    {
        id: 2,
        name: 'ООО «Морские корабли» (Акватория)',
        code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "8c8d43b735f10cc868462481cd0b51d5",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
    }
];

function ensureStandardGateways(gateways) {
    if (!Array.isArray(gateways) || gateways.length === 0) {
        return [...STANDARD_TICKETLAND_GATEWAYS];
    }
    const result = [...gateways];
    STANDARD_TICKETLAND_GATEWAYS.forEach(stdGw => {
        const idx = result.findIndex(g => g.id === stdGw.id);
        if (idx === -1) {
            result.push(stdGw);
        } else if (!result[idx].code || result[idx].code.trim() === '') {
            result[idx] = { ...result[idx], ...stdGw };
        }
    });
    return result;
}

// Helper to parse gateways for domains
function parseDomainGateways(domains) {
    if (!domains) return;
    domains.forEach(d => {
        try {
            d.gateways = typeof d.gateways_json === 'string' ? JSON.parse(d.gateways_json) : (d.gateways_json || []);
        } catch(e) {
            d.gateways = [];
        }
        d.gateways = ensureStandardGateways(d.gateways);
    });
}

// Routes
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Неверный пароль' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Dashboard
app.get('/', requireAuth, (req, res) => {
    db.all("SELECT * FROM domains ORDER BY id ASC", (err, domains) => {
        if (err) return res.status(500).send(err.message);
        if (!domains || domains.length === 0) {
            return res.render('dashboard', { 
                domains: [], 
                pages: [], 
                events: [], 
                venues: [], 
                sessions: [], 
                agents: [],
                agentSales: [],
                currentDomain: null, 
                domainCounts: {},
                activeTab: req.query.tab || 'events'
            });
        }

        parseDomainGateways(domains);

        const selectedDomainId = req.query.domain_id ? parseInt(req.query.domain_id) : domains[0].id;
        const currentDomain = domains.find(d => d.id === selectedDomainId) || domains[0];
        const activeTab = req.query.tab || 'events';

        db.all("SELECT domain_id, COUNT(*) as count FROM pages GROUP BY domain_id", (err, countRows) => {
            const domainCounts = {};
            if (countRows) {
                countRows.forEach(r => {
                    domainCounts[r.domain_id] = r.count;
                });
            }

            // Fetch Pages
            db.all(`
                SELECT pages.*, domains.name as domain_name, domains.gateways_json, domains.script_1_name, domains.script_2_name
                FROM pages 
                JOIN domains ON pages.domain_id = domains.id
                WHERE pages.domain_id = ?
                ORDER BY pages.created_at DESC
            `, [currentDomain.id], (err, pages) => {
                if (err) return res.status(500).send(err.message);

                // Fetch Venues
                db.all("SELECT * FROM venues WHERE domain_id = ? ORDER BY id ASC", [currentDomain.id], (err2, venues) => {
                    if (err2) venues = [];

                    // Fetch Events
                    db.all("SELECT * FROM events WHERE domain_id = ? ORDER BY is_featured DESC, id DESC", [currentDomain.id], (err3, events) => {
                        if (err3) events = [];

                        // Fetch Sessions
                        db.all(`
                            SELECT sessions.*, events.title as event_title, events.slug as event_slug, venues.name as venue_name, venues.pier_address
                            FROM sessions
                            JOIN events ON sessions.event_id = events.id
                            LEFT JOIN venues ON sessions.venue_id = venues.id
                            WHERE events.domain_id = ?
                            ORDER BY sessions.start_time ASC
                        `, [currentDomain.id], (err4, sessionsList) => {
                            if (err4) sessionsList = [];

                            // Fetch Agents & Agent Sales
                            db.all("SELECT * FROM agents WHERE domain_id = ? OR domain_id IS NULL ORDER BY id DESC", [currentDomain.id], (err5, agents) => {
                                if (err5) agents = [];

                                db.all(`
                                    SELECT agent_sales.*, agents.name as agent_name, agents.promo_code
                                    FROM agent_sales
                                    JOIN agents ON agent_sales.agent_id = agents.id
                                    WHERE agents.domain_id = ? OR agents.domain_id IS NULL
                                    ORDER BY agent_sales.created_at DESC
                                `, [currentDomain.id], (err6, agentSales) => {
                                    if (err6) agentSales = [];

                                    // Fetch Finance Transactions
                                    db.all(`
                                        SELECT * FROM finance_transactions 
                                        WHERE domain_id = ? 
                                        ORDER BY transaction_date DESC, id DESC
                                    `, [currentDomain.id], (errFt, transactions) => {
                                        if (errFt) transactions = [];

                                        // Fetch Calculator Settings
                                        db.get("SELECT * FROM rent_calculator_settings WHERE domain_id = ?", [currentDomain.id], (errCs, calcSettings) => {
                                            if (!calcSettings) {
                                                calcSettings = {
                                                    boat_name: currentDomain.name.includes('rock') ? 'Теплоход «Рок Хит Нева»' : 'Теплоход «Акватория Звука»',
                                                    capacity: 80,
                                                    hourly_rate_day: 15000,
                                                    hourly_rate_evening: 20000,
                                                    hourly_rate_night_bridges: 28000,
                                                    min_hours: 2,
                                                    banquet_price_per_person: 3500,
                                                    buffet_price_per_person: 2200,
                                                    dj_sound_price: 15000,
                                                    host_price: 25000,
                                                    live_band_price: 45000,
                                                    cleaning_fee: 5000
                                                };
                                            }

                                            // Fetch Rent Leads
                                            db.all(`
                                                SELECT * FROM rent_leads 
                                                WHERE domain_id = ? 
                                                ORDER BY created_at DESC
                                            `, [currentDomain.id], (errRl, rentLeads) => {
                                                if (errRl) rentLeads = [];

                                                // Financial Analysis & Decima Runway Calculation
                                                let totalIncome = 0;
                                                let totalExpense = 0;
                                                const categoryStats = { income: {}, expense: {} };
                                                const monthlyStats = {};
                                                const legalEntityStats = {};

                                                transactions.forEach(t => {
                                                    const amt = parseFloat(t.amount) || 0;
                                                    if (t.type === 'income') {
                                                        totalIncome += amt;
                                                        categoryStats.income[t.category] = (categoryStats.income[t.category] || 0) + amt;
                                                    } else {
                                                        totalExpense += amt;
                                                        categoryStats.expense[t.category] = (categoryStats.expense[t.category] || 0) + amt;
                                                    }

                                                    const mKey = t.transaction_date ? t.transaction_date.substring(0, 7) : '2026-08';
                                                    if (!monthlyStats[mKey]) monthlyStats[mKey] = { income: 0, expense: 0, balance: 0 };
                                                    if (t.type === 'income') monthlyStats[mKey].income += amt;
                                                    else monthlyStats[mKey].expense += amt;
                                                    monthlyStats[mKey].balance = monthlyStats[mKey].income - monthlyStats[mKey].expense;

                                                    const ent = t.legal_entity || 'Основное юрлицо';
                                                    if (!legalEntityStats[ent]) legalEntityStats[ent] = { income: 0, expense: 0, balance: 0 };
                                                    if (t.type === 'income') legalEntityStats[ent].income += amt;
                                                    else legalEntityStats[ent].expense += amt;
                                                    legalEntityStats[ent].balance = legalEntityStats[ent].income - legalEntityStats[ent].expense;
                                                });

                                                const netProfit = totalIncome - totalExpense;
                                                const profitMargin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;
                                                
                                                // Decima Winter Off-Season Model (6 months Nov-Apr at ~180k/mo)
                                                const winterNeededTotal = 1080000;
                                                const winterCoveredPercent = Math.min(100, Math.max(0, Math.round((netProfit / winterNeededTotal) * 100)));
                                                const winterRunwayMonths = (netProfit > 0) ? (netProfit / 180000).toFixed(1) : 0;

                                                const financeData = {
                                                    transactions,
                                                    totalIncome,
                                                    totalExpense,
                                                    netProfit,
                                                    profitMargin,
                                                    categoryStats,
                                                    monthlyStats,
                                                    legalEntityStats,
                                                    winterNeededTotal,
                                                    winterCoveredPercent,
                                                    winterRunwayMonths
                                                };

                                                res.render('dashboard', { 
                                                    domains, 
                                                    pages, 
                                                    venues, 
                                                    events, 
                                                    sessions: sessionsList, 
                                                    agents,
                                                    agentSales,
                                                    currentDomain, 
                                                    domainCounts,
                                                    activeTab,
                                                    financeData,
                                                    calcSettings,
                                                    rentLeads
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Domain Settings
app.post('/domain/edit', requireAuth, (req, res) => {
    const { domain_id, global_scripts, primary_color, logo_url, bg_image_url, footer_text } = req.body;
    
    let gateways = [];
    if (req.body.gateways_json) {
        try {
            gateways = typeof req.body.gateways_json === 'string' ? JSON.parse(req.body.gateways_json) : req.body.gateways_json;
        } catch(e) {}
    } else if (req.body.gateway_name) {
        const names = Array.isArray(req.body.gateway_name) ? req.body.gateway_name : [req.body.gateway_name];
        const codes = Array.isArray(req.body.gateway_code) ? req.body.gateway_code : [req.body.gateway_code];
        const ids = Array.isArray(req.body.gateway_id) ? req.body.gateway_id : [req.body.gateway_id];
        
        gateways = names.map((name, idx) => ({
            id: parseInt(ids[idx]) || (idx + 1),
            name: name || `Шлюз ${idx + 1}`,
            code: codes[idx] || ''
        }));
    }

    const script_1_name = gateways[0] ? gateways[0].name : '';
    const script_1_code = gateways[0] ? gateways[0].code : '';
    const script_2_name = gateways[1] ? gateways[1].name : '';
    const script_2_code = gateways[1] ? gateways[1].code : '';
    const gateways_json = JSON.stringify(gateways);

    db.run(
        "UPDATE domains SET global_scripts = ?, primary_color = ?, logo_url = ?, bg_image_url = ?, script_1_name = ?, script_1_code = ?, script_2_name = ?, script_2_code = ?, footer_text = ?, gateways_json = ? WHERE id = ?", 
        [global_scripts, primary_color, logo_url, bg_image_url, script_1_name, script_1_code, script_2_name, script_2_code, footer_text, gateways_json, domain_id], 
        async function(err) {
            if (err) return res.status(500).send(err.message);
            try {
                await builder.rebuildDomain(domain_id);
                res.redirect(`/?domain_id=${domain_id}&tab=settings`);
            } catch(e) {
                res.status(500).send(e.message);
            }
        }
    );
});

// VENUE CRUD
app.post('/venue/save', requireAuth, (req, res) => {
    const { id, domain_id, name, pier_address, capacity, description } = req.body;
    if (id) {
        db.run(
            "UPDATE venues SET name = ?, pier_address = ?, capacity = ?, description = ? WHERE id = ?",
            [name, pier_address, capacity || 100, description || '', id],
            async function(err) {
                if (err) return res.status(500).send(err.message);
                try {
                    await builder.rebuildDomain(domain_id);
                    res.redirect(`/?domain_id=${domain_id}&tab=venues`);
                } catch(e) {
                    res.status(500).send(e.message);
                }
            }
        );
    } else {
        db.run(
            "INSERT INTO venues (domain_id, name, pier_address, capacity, description) VALUES (?, ?, ?, ?, ?)",
            [domain_id, name, pier_address, capacity || 100, description || ''],
            async function(err) {
                if (err) return res.status(500).send(err.message);
                try {
                    await builder.rebuildDomain(domain_id);
                    res.redirect(`/?domain_id=${domain_id}&tab=venues`);
                } catch(e) {
                    res.status(500).send(e.message);
                }
            }
        );
    }
});

app.post('/venue/delete/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM venues WHERE id = ?", [req.params.id], (err, venue) => {
        if (err || !venue) return res.status(500).send("Площадка не найдена");
        const domainId = venue.domain_id;
        db.run("DELETE FROM venues WHERE id = ?", [req.params.id], async function(err2) {
            if (err2) return res.status(500).send(err2.message);
            try {
                await builder.rebuildDomain(domainId);
                res.redirect(`/?domain_id=${domainId}&tab=venues`);
            } catch(e) {
                res.status(500).send(e.message);
            }
        });
    });
});

// EVENT CRUD
app.post('/event/save', requireAuth, (req, res) => {
    const { 
        id, domain_id, title, slug, short_desc, full_desc, 
        image_url, age_restriction, duration_minutes, music_genre, 
        is_featured, iframe_code, default_gateway_id, min_price 
    } = req.body;

    const featuredVal = is_featured === '1' || is_featured === 'on' || is_featured === true ? 1 : 0;
    const cleanSlug = slug ? slug.replace(/^\/+|\/+$/g, '') : '';

    if (id) {
        db.run(`
            UPDATE events SET 
                title = ?, slug = ?, short_desc = ?, full_desc = ?, 
                image_url = ?, age_restriction = ?, duration_minutes = ?, 
                music_genre = ?, is_featured = ?, iframe_code = ?, 
                default_gateway_id = ?, min_price = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `, [
            title, cleanSlug, short_desc || '', full_desc || '', 
            image_url || '', age_restriction || '18+', duration_minutes || 120, 
            music_genre || '', featuredVal, iframe_code || '', 
            default_gateway_id || 1, min_price || 1500, id
        ], async function(err) {
            if (err) return res.status(500).send(err.message);
            
            db.run(`
                INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET title = ?, slug = ?, iframe_code = ?
            `, [domain_id, title, cleanSlug, iframe_code || '', default_gateway_id || 1, title, cleanSlug, iframe_code || '']);

            try {
                await builder.rebuildDomain(domain_id);
                res.redirect(`/?domain_id=${domain_id}&tab=events`);
            } catch(e) {
                res.status(500).send(e.message);
            }
        });
    } else {
        db.run(`
            INSERT INTO events (
                domain_id, title, slug, short_desc, full_desc, 
                image_url, age_restriction, duration_minutes, 
                music_genre, is_featured, iframe_code, default_gateway_id, min_price
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            domain_id, title, cleanSlug, short_desc || '', full_desc || '', 
            image_url || '', age_restriction || '18+', duration_minutes || 120, 
            music_genre || '', featuredVal, iframe_code || '', 
            default_gateway_id || 1, min_price || 1500
        ], function(err) {
            if (err) return res.status(500).send(err.message);
            
            db.run(
                "INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice) VALUES (?, ?, ?, ?, ?)",
                [domain_id, title, cleanSlug, iframe_code || '', default_gateway_id || 1],
                async () => {
                    try {
                        await builder.rebuildDomain(domain_id);
                        res.redirect(`/?domain_id=${domain_id}&tab=events`);
                    } catch(e) {
                        res.status(500).send(e.message);
                    }
                }
            );
        });
    }
});

app.post('/event/delete/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM events WHERE id = ?", [req.params.id], (err, ev) => {
        if (err || !ev) return res.status(500).send("Мероприятие не найдено");
        const domainId = ev.domain_id;
        
        db.run("DELETE FROM events WHERE id = ?", [req.params.id], async function(err2) {
            if (err2) return res.status(500).send(err2.message);
            try {
                await builder.rebuildDomain(domainId);
                res.redirect(`/?domain_id=${domainId}&tab=events`);
            } catch(e) {
                res.status(500).send(e.message);
            }
        });
    });
});

// SESSIONS & MASS GENERATOR
app.post('/session/save', requireAuth, (req, res) => {
    const { id, domain_id, event_id, venue_id, start_time, end_time, status, gateway_id, ticket_url, min_price } = req.body;
    
    if (id) {
        db.run(`
            UPDATE sessions SET 
                event_id = ?, venue_id = ?, start_time = ?, end_time = ?, 
                status = ?, gateway_id = ?, ticket_url = ?, min_price = ? 
            WHERE id = ?
        `, [event_id, venue_id, start_time, end_time || null, status || 'active', gateway_id || 1, ticket_url || '', min_price || 0, id], 
        async function(err) {
            if (err) return res.status(500).send(err.message);
            try {
                await builder.rebuildDomain(domain_id);
                res.redirect(`/?domain_id=${domain_id}&tab=sessions`);
            } catch(e) {
                res.status(500).send(e.message);
            }
        });
    } else {
        db.run(`
            INSERT INTO sessions (event_id, venue_id, start_time, end_time, status, gateway_id, ticket_url, min_price) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [event_id, venue_id, start_time, end_time || null, status || 'active', gateway_id || 1, ticket_url || '', min_price || 0], 
        function(err) {
            if (err) return res.status(500).send(err.message);
            const sessId = this.lastID;
            
            db.run("INSERT INTO ticket_tiers (session_id, name, price, capacity, available) VALUES (?, 'Входной билет', ?, 100, 100)", [sessId, min_price || 1500], async () => {
                try {
                    await builder.rebuildDomain(domain_id);
                    res.redirect(`/?domain_id=${domain_id}&tab=sessions`);
                } catch(e) {
                    res.status(500).send(e.message);
                }
            });
        });
    }
});

app.post('/session/generate', requireAuth, async (req, res) => {
    const { domain_id, event_id, venue_id, date_from, date_to, days_of_week, times, gateway_id, min_price } = req.body;
    
    if (!event_id || !date_from || !date_to || !times) {
        return res.status(400).send("Заполните все обязательные поля");
    }

    const selectedDays = Array.isArray(days_of_week) ? days_of_week.map(Number) : (days_of_week ? [Number(days_of_week)] : [0,1,2,3,4,5,6]);
    const timeList = times.split(/[,;\n]+/).map(t => t.trim()).filter(Boolean);

    const startDate = new Date(date_from);
    const endDate = new Date(date_to);
    
    const sessionsToInsert = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (selectedDays.includes(dayOfWeek)) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            timeList.forEach(t => {
                const startTime = `${dateStr} ${t.length === 5 ? t : t.padStart(5, '0')}`;
                sessionsToInsert.push(startTime);
            });
        }
    }

    for (let startTime of sessionsToInsert) {
        await new Promise((resolve) => {
            db.run(
                "INSERT INTO sessions (event_id, venue_id, start_time, status, gateway_id, min_price) VALUES (?, ?, ?, 'active', ?, ?)",
                [event_id, venue_id, startTime, gateway_id || 1, min_price || 1500],
                function(err) {
                    if (!err && this.lastID) {
                        const sessId = this.lastID;
                        db.run("INSERT INTO ticket_tiers (session_id, name, price, capacity, available) VALUES (?, 'Входной билет', ?, 100, 100)", [sessId, min_price || 1500], () => resolve());
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    try {
        await builder.rebuildDomain(domain_id);
        res.redirect(`/?domain_id=${domain_id}&tab=sessions`);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

app.post('/session/delete/:id', requireAuth, (req, res) => {
    const domainId = req.query.domain_id || req.body.domain_id;
    db.run("DELETE FROM sessions WHERE id = ?", [req.params.id], async function(err) {
        if (err) return res.status(500).send(err.message);
        try {
            if (domainId) await builder.rebuildDomain(domainId);
            res.redirect(`/?domain_id=${domainId || 1}&tab=sessions`);
        } catch(e) {
            res.status(500).send(e.message);
        }
    });
});

// AGENTS CRUD
app.post('/agent/save', requireAuth, (req, res) => {
    const { id, domain_id, name, role, promo_code, commission_rate, discount_rate, phone, email, notes } = req.body;
    
    const commRate = parseFloat(commission_rate) > 1 ? (parseFloat(commission_rate) / 100) : (parseFloat(commission_rate) || 0.15);
    const discRate = parseFloat(discount_rate) > 1 ? (parseFloat(discount_rate) / 100) : (parseFloat(discount_rate) || 0.05);
    const cleanPromo = (promo_code || '').trim().toUpperCase();

    if (id) {
        db.run(`
            UPDATE agents SET 
                domain_id = ?, name = ?, role = ?, promo_code = ?, 
                commission_rate = ?, discount_rate = ?, phone = ?, email = ?, notes = ? 
            WHERE id = ?
        `, [domain_id || null, name, role || 'Партнер', cleanPromo, commRate, discRate, phone || '', email || '', notes || '', id],
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.redirect(`/?domain_id=${domain_id || 1}&tab=agents`);
        });
    } else {
        db.run(`
            INSERT INTO agents (domain_id, name, role, promo_code, commission_rate, discount_rate, phone, email, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [domain_id || null, name, role || 'Партнер', cleanPromo, commRate, discRate, phone || '', email || '', notes || ''],
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.redirect(`/?domain_id=${domain_id || 1}&tab=agents`);
        });
    }
});

app.post('/agent/delete/:id', requireAuth, (req, res) => {
    const domainId = req.query.domain_id || req.body.domain_id;
    db.run("DELETE FROM agents WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).send(err.message);
        res.redirect(`/?domain_id=${domainId || 1}&tab=agents`);
    });
});

// Personal Agent Cabinet
app.get('/agent/cabinet/:promo_code', (req, res) => {
    const promo = (req.params.promo_code || '').toUpperCase();
    db.get("SELECT * FROM agents WHERE promo_code = ?", [promo], (err, agent) => {
        if (err || !agent) return res.status(404).send('Партнер с таким промокодом не найден');

        const domainId = agent.domain_id || 2; // Default to rockhitneva.ru
        db.get("SELECT name FROM domains WHERE id = ?", [domainId], (err2, domain) => {
            const domainName = domain ? domain.name : 'rockhitneva.ru';

            db.all("SELECT * FROM agent_sales WHERE agent_id = ? ORDER BY created_at DESC", [agent.id], (err3, sales) => {
                if (err3) sales = [];

                db.all("SELECT * FROM events WHERE domain_id = ? ORDER BY is_featured DESC", [domainId], (err4, events) => {
                    if (err4) events = [];

                    const totalRevenue = sales.reduce((acc, s) => acc + (s.amount || 0), 0);
                    const totalCommission = sales.reduce((acc, s) => acc + (s.commission_amount || 0), 0);

                    res.render('agent_cabinet', {
                        agent,
                        domainName,
                        sales,
                        events,
                        totalRevenue,
                        totalCommission
                    });
                });
            });
        });
    });
});

// API: Record sale attributed to agent
app.post('/api/record-sale', (req, res) => {
    const { promo_code, event_title, customer_name, amount } = req.body;
    if (!promo_code || !amount) return res.status(400).json({ error: 'Missing promo_code or amount' });

    db.get("SELECT * FROM agents WHERE promo_code = ?", [promo_code.toUpperCase()], (err, agent) => {
        if (err || !agent) return res.status(404).json({ error: 'Agent not found' });

        const commAmount = Number(amount) * (agent.commission_rate || 0.15);
        db.run(
            "INSERT INTO agent_sales (agent_id, event_title, customer_name, amount, commission_amount) VALUES (?, ?, ?, ?, ?)",
            [agent.id, event_title || 'Билеты на концерт', customer_name || 'Покупатель', amount, commAmount],
            function(err2) {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ success: true, sale_id: this.lastID, commission: commAmount });
            }
        );
    });
});

// Rebuild All Trigger
app.post('/domain/rebuild', requireAuth, async (req, res) => {
    const domainId = req.body.domain_id;
    try {
        await builder.rebuildDomain(domainId);
        res.redirect(`/?domain_id=${domainId}&tab=events`);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// PAGE CRUD
app.get('/page/add', requireAuth, (req, res) => {
    const selectedDomainId = req.query.domain_id ? parseInt(req.query.domain_id) : null;
    db.all("SELECT * FROM domains ORDER BY id ASC", (err, domains) => {
        if (err) return res.status(500).send(err.message);
        parseDomainGateways(domains);
        res.render('edit_page', { page: null, domains, selectedDomainId });
    });
});

app.get('/page/edit/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM pages WHERE id = ?", [req.params.id], (err, page) => {
        if (err) return res.status(500).send(err.message);
        if (!page) return res.status(404).send('Страница не найдена');
        
        db.all("SELECT * FROM domains ORDER BY id ASC", (err, domains) => {
            if (err) return res.status(500).send(err.message);
            parseDomainGateways(domains);
            res.render('edit_page', { page, domains, selectedDomainId: page.domain_id });
        });
    });
});

app.post('/page/save', requireAuth, (req, res) => {
    const { id, domain_id, title, slug, iframe_code, script_choice } = req.body;
    
    if (id) {
        db.get("SELECT * FROM pages WHERE id = ?", [id], async (err, oldPage) => {
            if (err) return res.status(500).send(err.message);
            
            db.run(
                "UPDATE pages SET domain_id = ?, title = ?, slug = ?, iframe_code = ?, script_choice = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", 
                [domain_id, title, slug, iframe_code, script_choice || 1, id], 
                async function(err) {
                    if (err) return res.status(500).send(err.message);
                    
                    try {
                        if (oldPage && oldPage.slug !== slug) {
                            await builder.deletePage(oldPage);
                        }
                        db.get("SELECT * FROM pages WHERE id = ?", [id], async (err, newPage) => {
                            await builder.buildPage(newPage);
                            res.redirect(`/?domain_id=${domain_id}&tab=pages`);
                        });
                    } catch(e) {
                        res.status(500).send(e.message);
                    }
                }
            );
        });
    } else {
        db.run(
            "INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice) VALUES (?, ?, ?, ?, ?)",
            [domain_id, title, slug, iframe_code, script_choice || 1],
            function(err) {
                if (err) return res.status(500).send(err.message);
                
                db.get("SELECT * FROM pages WHERE id = ?", [this.lastID], async (err, newPage) => {
                    try {
                        await builder.buildPage(newPage);
                        res.redirect(`/?domain_id=${domain_id}&tab=pages`);
                    } catch(e) {
                        res.status(500).send(e.message);
                    }
                });
            }
        );
    }
});

app.post('/page/delete/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM pages WHERE id = ?", [req.params.id], (err, page) => {
        if (err || !page) return res.status(500).send("Ошибка");
        const domainId = page.domain_id;
        
        db.run("DELETE FROM pages WHERE id = ?", [req.params.id], async function(err) {
            if (err) return res.status(500).send(err.message);
            try {
                await builder.deletePage(page);
                res.redirect(`/?domain_id=${domainId}&tab=pages`);
            } catch(e) {
                res.status(500).send(e.message);
            }
        });
    });
});

// -------------------------------------------------------------
// REST API FOR REACT ADMIN PANEL (#sites)
// -------------------------------------------------------------

// 1. Get all domains with pages
app.get('/api/cms/domains', (req, res) => {
    db.all("SELECT * FROM domains ORDER BY id ASC", (err, domains) => {
        if (err) return res.status(500).json({ error: err.message });
        parseDomainGateways(domains);

        db.all("SELECT * FROM pages ORDER BY CASE WHEN slug = '/' OR slug = '' OR slug IS NULL THEN 0 ELSE 1 END ASC, id DESC", (err2, pages) => {
            if (err2) return res.status(500).json({ error: err2.message });

            const domainsWithPages = domains.map(dom => {
                let domPages = pages.filter(p => p.domain_id === dom.id).map(p => {
                    const cleanSlug = (p.slug || '').replace(/^\/+|\/+$/g, '');
                    const isHome = (!cleanSlug || cleanSlug === '/' || p.slug === '/');
                    const pageUrl = isHome ? `https://${dom.name}/` : `https://${dom.name}/${cleanSlug}/`;
                    return {
                        id: p.id,
                        title: p.title,
                        slug: isHome ? '/' : cleanSlug,
                        iframe_code: p.iframe_code,
                        script_choice: p.script_choice || 1,
                        url: pageUrl
                    };
                });

                // Гарантируем, что главная страница всегда есть и всегда стоит на 1-м месте в списке
                const homeIdx = domPages.findIndex(p => p.slug === '/' || !p.slug);
                if (homeIdx > 0) {
                    const [hp] = domPages.splice(homeIdx, 1);
                    domPages.unshift(hp);
                } else if (homeIdx === -1) {
                    domPages.unshift({
                        id: dom.id === 2 ? 3 : (dom.id === 1 ? 23 : (dom.id === 6 ? 27 : (dom.id === 7 ? 32 : Date.now()))),
                        title: dom.title || `Главная страница (${dom.name})`,
                        slug: '/',
                        iframe_code: '',
                        script_choice: 1,
                        url: `https://${dom.name}/`
                    });
                }

                return {
                    id: dom.id,
                    name: dom.name,
                    title: dom.title || dom.name,
                    primary_color: dom.primary_color || '#446084',
                    logo_url: dom.logo_url || '',
                    bg_image_url: dom.bg_image_url || '',
                    global_scripts: dom.global_scripts || '',
                    footer_text: dom.footer_text || '',
                    cloud_url: `https://${dom.name}/`,
                    gateways: dom.gateways || [],
                    pages: domPages
                };
            });

            res.json({ success: true, domains: domainsWithPages });
        });
    });
});

// 2. Save / Create page and immediately build HTML
app.post('/api/cms/pages/save', async (req, res) => {
    try {
        const body = req.body || {};
        let { id, domain_id, domain_name, title, slug, iframe_code, script_choice } = body;

        if (!title) {
            return res.status(400).json({ success: false, error: 'Введите название страницы' });
        }

        let cleanSlug = (slug || '').trim();
        const isHomePage = (!cleanSlug || cleanSlug === '/');
        if (isHomePage) {
            cleanSlug = '/';
        } else {
            cleanSlug = cleanSlug.replace(/^\/+|\/+$/g, '').toLowerCase();
        }

        // Resolve domain_id if only domain_name provided
        if (!domain_id && domain_name) {
            const dom = await new Promise((resolve, reject) => {
                db.get("SELECT * FROM domains WHERE name = ? OR name LIKE ?", [domain_name, `%${domain_name}%`], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
            if (dom) domain_id = dom.id;
        }

        if (!domain_id) domain_id = 2; // Default to rockhitneva.ru

        // Check if page with same domain & slug or id exists
        const existingPage = await new Promise((resolve) => {
            if (id && Number(id) < 1000000000 && !isNaN(Number(id))) {
                db.get("SELECT * FROM pages WHERE id = ?", [Number(id)], (err, row) => resolve(row || null));
            } else if (isHomePage) {
                db.get("SELECT * FROM pages WHERE domain_id = ? AND (slug = '/' OR slug = '' OR slug IS NULL)", [domain_id], (err, row) => resolve(row || null));
            } else {
                db.get("SELECT * FROM pages WHERE domain_id = ? AND slug = ?", [domain_id, cleanSlug], (err, row) => resolve(row || null));
            }
        });

        let targetPageId = existingPage ? existingPage.id : null;

        if (targetPageId) {
            await new Promise((resolve, reject) => {
                db.run(
                    "UPDATE pages SET domain_id = ?, title = ?, slug = ?, iframe_code = ?, script_choice = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                    [domain_id, title, cleanSlug, iframe_code || '', script_choice || 1, targetPageId],
                    (err) => err ? reject(err) : resolve()
                );
            });
            const wasHome = !existingPage.slug || existingPage.slug === '/';
            if (existingPage.slug !== cleanSlug && !(wasHome && isHomePage)) {
                await builder.deletePage(existingPage);
            }
        } else {
            targetPageId = await new Promise((resolve, reject) => {
                db.run(
                    "INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice) VALUES (?, ?, ?, ?, ?)",
                    [domain_id, title, cleanSlug, iframe_code || '', script_choice || 1],
                    function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    }
                );
            });
        }

        const newPage = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM pages WHERE id = ?", [targetPageId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        // Immediately compile HTML file on disk!
        await builder.buildPage(newPage);

        const domain = await builder.getDomainData(domain_id);
        const finalUrl = cleanSlug === '/' ? `https://${domain.name}/` : `https://${domain.name}/${cleanSlug}/`;

        res.json({
            success: true,
            page: {
                id: newPage.id,
                domain_id: newPage.domain_id,
                title: newPage.title,
                slug: newPage.slug,
                iframe_code: newPage.iframe_code,
                script_choice: newPage.script_choice,
                url: finalUrl
            },
            url: finalUrl
        });
    } catch(err) {
        console.error('API Save Page Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. Delete page
app.post('/api/cms/pages/delete', async (req, res) => {
    try {
        const { id, domain_id, slug } = req.body;
        const page = await new Promise((resolve) => {
            if (id && Number(id) < 1000000000 && !isNaN(Number(id))) {
                db.get("SELECT * FROM pages WHERE id = ?", [Number(id)], (err, row) => resolve(row || null));
            } else if (domain_id && slug) {
                db.get("SELECT * FROM pages WHERE domain_id = ? AND slug = ?", [domain_id, slug], (err, row) => resolve(row || null));
            } else {
                resolve(null);
            }
        });

        if (page) {
            if (page.slug === '/' || !page.slug) {
                return res.status(400).json({ success: false, error: 'Главную страницу нельзя удалить' });
            }
            await builder.deletePage(page);
            await new Promise((resolve) => db.run("DELETE FROM pages WHERE id = ?", [page.id], resolve));
        }

        res.json({ success: true });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// SBERBANK ACQUIRING API ENDPOINTS
// ==========================================
const sberbankService = require('./sberbank_service');

// 1. Создание платежной сессии в Сбербанке
app.post('/api/payment/sberbank/create', async (req, res) => {
    try {
        const { orderNumber, amount, returnUrl, failUrl, description, email, phone, merchantKey } = req.body;
        
        if (!orderNumber || !amount) {
            return res.status(400).json({ success: false, error: 'orderNumber and amount are required' });
        }

        const result = await sberbankService.registerOrder({
            orderNumber,
            amountInRubles: amount,
            returnUrl,
            failUrl,
            description,
            email,
            phone,
            merchantKey: merchantKey || 'rockhitneva'
        });

        if (result.formUrl) {
            res.json({
                success: true,
                orderId: result.orderId,
                formUrl: result.formUrl
            });
        } else {
            res.json({
                success: false,
                errorCode: result.errorCode,
                errorMessage: result.errorMessage || 'Ошибка регистрации в Сбербанке',
                raw: result
            });
        }
    } catch (e) {
        console.error('Sberbank create payment error:', e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// 2. Проверка статуса оплаты по заказу
app.get('/api/payment/sberbank/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const merchantKey = req.query.merchantKey || 'rockhitneva';

        const result = await sberbankService.getOrderStatus(orderId, merchantKey);
        const isPaid = result.orderStatus === 2;

        res.json({
            success: true,
            isPaid,
            orderStatus: result.orderStatus,
            description: result.actionCodeDescription,
            raw: result
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// ==========================================
// FINANCE & RENT CALCULATOR API ENDPOINTS (ПОД ПАРОЛЕМ АДМИНИСТРАТОРА)
// ==========================================

// 1. Добавление финансовой проводки
app.post('/api/finance/transaction', requireAuth, (req, res) => {
    const { domain_id, legal_entity, type, category, amount, transaction_date, description } = req.body;
    db.run(
        `INSERT INTO finance_transactions (domain_id, legal_entity, type, category, amount, transaction_date, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [domain_id, legal_entity, type, category, parseFloat(amount) || 0, transaction_date, description || ''],
        (err) => {
            if (err) console.error("Error adding transaction:", err);
            res.redirect(`/?domain_id=${domain_id}&tab=finance`);
        }
    );
});

// 2. Удаление финансовой проводки
app.post('/api/finance/transaction/delete/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { domain_id } = req.body;
    db.run("DELETE FROM finance_transactions WHERE id = ?", [id], (err) => {
        if (err) console.error("Error deleting transaction:", err);
        res.redirect(`/?domain_id=${domain_id || ''}&tab=finance`);
    });
});

// 3. Сохранение настроек калькулятора аренды
app.post('/api/calc/settings', requireAuth, (req, res) => {
    const {
        domain_id, boat_name, capacity, hourly_rate_day, hourly_rate_evening,
        hourly_rate_night_bridges, min_hours, banquet_price_per_person,
        buffet_price_per_person, dj_sound_price, host_price, live_band_price, cleaning_fee
    } = req.body;

    db.run(
        `INSERT INTO rent_calculator_settings (
            domain_id, boat_name, capacity, hourly_rate_day, hourly_rate_evening,
            hourly_rate_night_bridges, min_hours, banquet_price_per_person,
            buffet_price_per_person, dj_sound_price, host_price, live_band_price, cleaning_fee, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(domain_id) DO UPDATE SET
            boat_name = excluded.boat_name,
            capacity = excluded.capacity,
            hourly_rate_day = excluded.hourly_rate_day,
            hourly_rate_evening = excluded.hourly_rate_evening,
            hourly_rate_night_bridges = excluded.hourly_rate_night_bridges,
            min_hours = excluded.min_hours,
            banquet_price_per_person = excluded.banquet_price_per_person,
            buffet_price_per_person = excluded.buffet_price_per_person,
            dj_sound_price = excluded.dj_sound_price,
            host_price = excluded.host_price,
            live_band_price = excluded.live_band_price,
            cleaning_fee = excluded.cleaning_fee,
            updated_at = CURRENT_TIMESTAMP`,
        [
            domain_id, boat_name, parseInt(capacity) || 80, parseFloat(hourly_rate_day) || 15000,
            parseFloat(hourly_rate_evening) || 20000, parseFloat(hourly_rate_night_bridges) || 28000,
            parseInt(min_hours) || 2, parseFloat(banquet_price_per_person) || 3500,
            parseFloat(buffet_price_per_person) || 2200, parseFloat(dj_sound_price) || 15000,
            parseFloat(host_price) || 25000, parseFloat(live_band_price) || 45000,
            parseFloat(cleaning_fee) || 5000
        ],
        (err) => {
            if (err) console.error("Error updating calc settings:", err);
            res.redirect(`/?domain_id=${domain_id}&tab=calc`);
        }
    );
});

// 4. Обновление статуса заявки на аренду
app.post('/api/calc/lead/status/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { status, domain_id, notes } = req.body;
    db.run("UPDATE rent_leads SET status = ?, notes = COALESCE(?, notes) WHERE id = ?", [status, notes || null, id], (err) => {
        if (err) console.error("Error updating lead status:", err);
        res.redirect(`/?domain_id=${domain_id || ''}&tab=calc`);
    });
});

// 5. Публичный прием заявок с виджета калькулятора
app.post('/api/calc/lead', (req, res) => {
    const {
        domain_id, customer_name, customer_phone, customer_email, boat_name,
        event_date, start_time, duration_hours, guests_count,
        catering_type, options_json, total_estimated_price, notes
    } = req.body;

    if (!customer_name || !customer_phone) {
        return res.status(400).json({ success: false, error: 'Имя и телефон обязательны' });
    }

    db.run(
        `INSERT INTO rent_leads (
            domain_id, customer_name, customer_phone, customer_email, boat_name,
            event_date, start_time, duration_hours, guests_count,
            catering_type, options_json, total_estimated_price, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
        [
            domain_id || 2, customer_name, customer_phone, customer_email || '',
            boat_name || 'Теплоход', event_date || '', start_time || '',
            parseInt(duration_hours) || 2, parseInt(guests_count) || 20,
            catering_type || 'Без кейтеринга', typeof options_json === 'object' ? JSON.stringify(options_json) : (options_json || '{}'),
            parseFloat(total_estimated_price) || 0, notes || ''
        ],
        function(err) {
            if (err) {
                console.error("Error saving rent lead:", err);
                return res.status(500).json({ success: false, error: err.message });
            }
            res.json({ success: true, lead_id: this.lastID, message: 'Заявка успешно принята! Менеджер свяжется с вами в ближайшее время.' });
        }
    );
});

// 6. Публичный GET для получения тарифов калькулятора
app.get('/api/calc/settings/:domain_id', (req, res) => {
    const domainId = req.params.domain_id;
    db.get("SELECT * FROM rent_calculator_settings WHERE domain_id = ?", [domainId], (err, row) => {
        if (err || !row) {
            return res.json({
                boat_name: 'Теплоход «Рок Хит Нева»',
                capacity: 80,
                hourly_rate_day: 15000,
                hourly_rate_evening: 20000,
                hourly_rate_night_bridges: 28000,
                min_hours: 2,
                banquet_price_per_person: 3500,
                buffet_price_per_person: 2200,
                dj_sound_price: 15000,
                host_price: 25000,
                live_band_price: 45000,
                cleaning_fee: 5000
            });
        }
        res.json(row);
    });
});

// 7. Публичная страница онлайн-калькулятора аренды
app.get(['/rent', '/calc'], (req, res) => {
    const host = (req.headers.host || '').toLowerCase();
    const domainName = host.includes('aqua') ? 'aquasound.club' : 'rockhitneva.ru';
    
    db.get("SELECT * FROM domains WHERE name = ?", [domainName], (err, domain) => {
        if (!domain) {
            domain = { id: 2, name: 'rockhitneva.ru', primary_color: '#0d6efd' };
        }
        db.get("SELECT * FROM rent_calculator_settings WHERE domain_id = ?", [domain.id], (err2, calcSettings) => {
            if (!calcSettings) {
                calcSettings = {
                    boat_name: domain.name.includes('rock') ? 'Теплоход «Рок Хит Нева»' : 'Теплоход «Акватория Звука»',
                    capacity: 80,
                    hourly_rate_day: 15000,
                    hourly_rate_evening: 20000,
                    hourly_rate_night_bridges: 28000,
                    min_hours: 2,
                    banquet_price_per_person: 3500,
                    buffet_price_per_person: 2200,
                    dj_sound_price: 15000,
                    host_price: 25000,
                    live_band_price: 45000,
                    cleaning_fee: 5000
                };
            }
            res.render('rent_calculator', { domain, calcSettings });
        });
    });
});

app.listen(PORT, () => {
    console.log(`B2B CMS работает на http://localhost:${PORT}`);
});

