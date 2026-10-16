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
    
    // Pass API, Ticketland gateway, admin & management domains to router
    if (
        req.path.startsWith('/api/') || 
        req.path.startsWith('/constructive') ||
        req.path.startsWith('/repertoire') ||
        req.path.startsWith('/modifiedRepertoire') ||
        req.path.startsWith('/tickets') ||
        req.path.startsWith('/lockTicket') ||
        req.path.startsWith('/unlockTicket') ||
        req.path.startsWith('/lockedTickets') ||
        req.path.startsWith('/createOrder') ||
        req.path.startsWith('/printableOrderData') ||
        req.path.startsWith('/confirmOrder') ||
        req.path.startsWith('/orderedTickets') ||
        req.path.startsWith('/changeOrder') ||
        req.path.startsWith('/removeOrder') ||
        req.path.startsWith('/returnTickets') ||
        req.path.startsWith('/salesReport') ||
        rawHost.includes('admin') || 
        rawHost.includes('cms') || 
        rawHost === 'localhost' || 
        rawHost === '127.0.0.1' || 
        rawHost.includes('yandexcloud.net')
    ) {
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

// Ticketland Official Gateway Router (Standard protocol MTS-Live)
const ticketlandGateway = require('./ticketland_gateway');
app.use('/api/ticketland', ticketlandGateway);
const tlRootPaths = [
    '/constructive', '/repertoire', '/modifiedRepertoire', '/shows', 
    '/tickets', '/lockTicket', '/unlockTicket', '/lockedTickets',
    '/createOrder', '/confirmOrder', '/cancelOrder', '/returnTickets', 
    '/salesReport', '/ticketStatus', '/printableOrderData', '/orderedTickets',
    '/changeOrder/spectators', '/removeOrder', '/ping'
];
app.use((req, res, next) => {
    if (tlRootPaths.some(p => req.path === p || req.path.startsWith(p + '/'))) {
        return ticketlandGateway(req, res, next);
    }
    next();
});

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
                priceTemplates: [],
                currentDomain: null, 
                domainCounts: {},
                activeTab: req.query.tab || 'events',
                marketingData: null
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

                        // Fetch Sessions with zone prices
                        db.all(`
                            SELECT sessions.*, events.title as event_title, events.slug as event_slug, venues.name as venue_name, venues.pier_address,
                                   (SELECT price FROM ticket_tiers WHERE session_id = sessions.id AND section_id = '1' LIMIT 1) as price_vip_nose,
                                   (SELECT price FROM ticket_tiers WHERE session_id = sessions.id AND section_id = '2' LIMIT 1) as price_vip_scene,
                                   (SELECT price FROM ticket_tiers WHERE session_id = sessions.id AND section_id = '3' LIMIT 1) as price_main_salon,
                                   (SELECT price FROM ticket_tiers WHERE session_id = sessions.id AND section_id = '4' LIMIT 1) as price_upper_closed,
                                   (SELECT price FROM ticket_tiers WHERE session_id = sessions.id AND section_id = '5' LIMIT 1) as price_upper_open
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

                                                // Fetch Price Templates
                                                db.all(`
                                                    SELECT pt.*, v.name as venue_name, v.capacity as venue_capacity, v.ship_model as venue_ship_model 
                                                    FROM price_templates pt 
                                                    LEFT JOIN venues v ON pt.venue_id = v.id 
                                                    ORDER BY pt.id ASC
                                                `, [], (errPt, priceTemplates) => {
                                                    if (errPt) priceTemplates = [];

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

                                                    // Fetch Marketing Campaigns & Events
                                                    db.all(`SELECT * FROM marketing_campaigns WHERE domain_id = ? ORDER BY id DESC`, [currentDomain.id], (errMc, campaigns) => {
                                                        if (errMc) campaigns = [];

                                                        db.all(`SELECT * FROM marketing_events WHERE domain_id = ? ORDER BY id DESC`, [currentDomain.id], (errMe, mEvents) => {
                                                            if (errMe) mEvents = [];

                                                            let visitsCount = 0;
                                                            let viewEventCount = 0;
                                                            let clickBuyCount = 0;
                                                            let selectSeatCount = 0;
                                                            let purchaseCount = 0;
                                                            let totalRevenue = 0;

                                                            const sourcesMap = {};
                                                            const devicesMap = {};
                                                            const dropReasonsMap = {};
                                                            const zonesMap = {};
                                                            const topEventsMap = {};

                                                            mEvents.forEach(ev => {
                                                                if (ev.event_type === 'visit') {
                                                                    visitsCount++;
                                                                    const src = ev.source || 'direct';
                                                                    sourcesMap[src] = (sourcesMap[src] || 0) + 1;
                                                                    const dev = ev.device || 'mobile';
                                                                    devicesMap[dev] = (devicesMap[dev] || 0) + 1;
                                                                } else if (ev.event_type === 'view_event') {
                                                                    viewEventCount++;
                                                                } else if (ev.event_type === 'click_buy') {
                                                                    clickBuyCount++;
                                                                } else if (ev.event_type === 'select_seat') {
                                                                    selectSeatCount++;
                                                                } else if (ev.event_type === 'purchase') {
                                                                    purchaseCount++;
                                                                    const amt = parseFloat(ev.amount) || 0;
                                                                    totalRevenue += amt;
                                                                    if (ev.zone_name) zonesMap[ev.zone_name] = (zonesMap[ev.zone_name] || 0) + 1;
                                                                    if (ev.event_title) {
                                                                        if (!topEventsMap[ev.event_title]) topEventsMap[ev.event_title] = { count: 0, revenue: 0 };
                                                                        topEventsMap[ev.event_title].count += 1;
                                                                        topEventsMap[ev.event_title].revenue += amt;
                                                                    }
                                                                } else if (ev.event_type === 'drop_off') {
                                                                    const r = ev.drop_reason || 'unknown';
                                                                    dropReasonsMap[r] = (dropReasonsMap[r] || 0) + 1;
                                                                }
                                                            });

                                                            // Если событий пока мало, дополняем репрезентативными базовыми данными
                                                            if (visitsCount === 0 && mEvents.length === 0) {
                                                                visitsCount = 12450;
                                                                viewEventCount = 6850;
                                                                clickBuyCount = 3120;
                                                                selectSeatCount = 1240;
                                                                purchaseCount = 485;
                                                                totalRevenue = 1455000;
                                                                sourcesMap['yandex'] = 5200;
                                                                sourcesMap['vk'] = 3100;
                                                                sourcesMap['organic'] = 2250;
                                                                sourcesMap['hotels'] = 1100;
                                                                sourcesMap['direct'] = 800;
                                                                devicesMap['mobile'] = 8466;
                                                                devicesMap['desktop'] = 3486;
                                                                devicesMap['tablet'] = 498;
                                                                dropReasonsMap['price_too_high'] = 420;
                                                                dropReasonsMap['no_seats_together'] = 290;
                                                                dropReasonsMap['date_not_suitable'] = 210;
                                                                dropReasonsMap['mobile_ux'] = 135;
                                                                dropReasonsMap['payment_failed'] = 65;
                                                                zonesMap['Главный салон'] = 255;
                                                                zonesMap['VIP Нос'] = 110;
                                                                zonesMap['VIP Сцена'] = 95;
                                                                zonesMap['Открытая корма'] = 60;
                                                                topEventsMap['Концерт «Цой, Горшок, Егор и Хой» на Неве!'] = { count: 255, revenue: 765000 };
                                                                topEventsMap['Рок и мосты'] = { count: 110, revenue: 495000 };
                                                                topEventsMap['Smoke on the water'] = { count: 95, revenue: 285000 };
                                                            }

                                                            const crTotal = visitsCount > 0 ? ((purchaseCount / visitsCount) * 100).toFixed(1) : 0;
                                                            const avgCheck = purchaseCount > 0 ? Math.round(totalRevenue / purchaseCount) : 0;

                                                            const marketingData = {
                                                                campaigns,
                                                                funnel: {
                                                                    visits: visitsCount,
                                                                    viewEvent: viewEventCount,
                                                                    clickBuy: clickBuyCount,
                                                                    selectSeat: selectSeatCount,
                                                                    purchase: purchaseCount,
                                                                    revenue: totalRevenue,
                                                                    avgCheck: avgCheck,
                                                                    crTotal: crTotal,
                                                                    step1to2: visitsCount > 0 ? Math.round((viewEventCount / visitsCount) * 100) : 0,
                                                                    step2to3: viewEventCount > 0 ? Math.round((clickBuyCount / viewEventCount) * 100) : 0,
                                                                    step3to4: clickBuyCount > 0 ? Math.round((selectSeatCount / clickBuyCount) * 100) : 0,
                                                                    step4to5: selectSeatCount > 0 ? Math.round((purchaseCount / selectSeatCount) * 100) : 0
                                                                },
                                                                sources: sourcesMap,
                                                                devices: devicesMap,
                                                                dropReasons: dropReasonsMap,
                                                                zones: zonesMap,
                                                                topEvents: topEventsMap
                                                            };

                                                            res.render('dashboard', { 
                                                                domains, 
                                                                pages, 
                                                                venues, 
                                                                events, 
                                                                sessions: sessionsList, 
                                                                agents,
                                                                agentSales,
                                                                priceTemplates,
                                                                currentDomain, 
                                                                domainCounts,
                                                                activeTab,
                                                                financeData,
                                                                calcSettings,
                                                                rentLeads,
                                                                marketingData
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
    const { 
        id, domain_id, event_id, venue_id, template_id, start_time, end_time, 
        status, gateway_id, ticket_url, min_price, sync_ticketland, ticketland_quota,
        price_vip_nose, price_vip_scene, price_main_salon, price_upper_closed, price_upper_open
    } = req.body;
    
    const syncVal = (sync_ticketland === '1' || sync_ticketland === 1 || sync_ticketland === 'on') ? 1 : 0;
    const quotaVal = (ticketland_quota && parseInt(ticketland_quota, 10) > 0) ? parseInt(ticketland_quota, 10) : null;
    const tmplVal = (template_id && parseInt(template_id, 10) > 0) ? parseInt(template_id, 10) : null;
    const basePrice = parseFloat(min_price) || 1750;
    const pVipNose = parseFloat(price_vip_nose) || (basePrice + 3000);
    const pVipScene = parseFloat(price_vip_scene) || (basePrice + 1250);
    const pMainSalon = parseFloat(price_main_salon) || (basePrice + 750);
    const pUpperClosed = parseFloat(price_upper_closed) || (basePrice + 200);
    const pUpperOpen = parseFloat(price_upper_open) || basePrice;

    const insertTiers = (sessId, venueId, callback) => {
        db.get("SELECT ship_model, capacity FROM venues WHERE id = ?", [venueId], (vErr, vRow) => {
            const isSingleZone = vRow && (vRow.ship_model === 'Входные 60' || vRow.capacity <= 60);
            const stmt = db.prepare("INSERT INTO ticket_tiers (session_id, section_id, name, price, capacity, available) VALUES (?, ?, ?, ?, ?, ?)");
            if (isSingleZone) {
                stmt.run([sessId, '1', 'Салон теплохода (Свободная посадка)', pUpperOpen, 60, 60]);
            } else {
                stmt.run([sessId, '1', 'Главная палуба — VIP Нос (Панорама)', pVipNose, 20, 20]);
                stmt.run([sessId, '2', 'Главная палуба — VIP Салон у сцены', pVipScene, 20, 20]);
                stmt.run([sessId, '3', 'Главная палуба — Салон (Танцпол и Бар)', pMainSalon, 20, 20]);
                stmt.run([sessId, '4', 'Верхняя палуба — Закрытый салон (DJ/Гид)', pUpperClosed, 48, 48]);
                stmt.run([sessId, '5', 'Верхняя палуба — Открытая палуба (Корма)', pUpperOpen, 32, 32]);
            }
            stmt.finalize(callback);
        });
    };

    if (id) {
        db.run(`
            UPDATE sessions SET 
                event_id = ?, venue_id = ?, template_id = ?, start_time = ?, end_time = ?, 
                status = ?, gateway_id = ?, ticket_url = ?, min_price = ?, sync_ticketland = ?, ticketland_quota = ? 
            WHERE id = ?
        `, [event_id, venue_id, tmplVal, start_time, end_time || null, status || 'active', gateway_id || 1, ticket_url || '', basePrice, syncVal, quotaVal, id], 
        async function(err) {
            if (err) return res.status(500).send(err.message);

            // Update or recreate zone tiers
            db.run("DELETE FROM ticket_tiers WHERE session_id = ?", [id], () => {
                insertTiers(id, venue_id, async () => {
                    try {
                        await builder.rebuildDomain(domain_id);
                        res.redirect(`/?domain_id=${domain_id}&tab=sessions`);
                    } catch(e) {
                        res.status(500).send(e.message);
                    }
                });
            });
        });
    } else {
        db.run(`
            INSERT INTO sessions (event_id, venue_id, template_id, start_time, end_time, status, gateway_id, ticket_url, min_price, sync_ticketland, ticketland_quota) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [event_id, venue_id, tmplVal, start_time, end_time || null, status || 'active', gateway_id || 1, ticket_url || '', basePrice, syncVal, quotaVal], 
        function(err) {
            if (err) return res.status(500).send(err.message);
            const sessId = this.lastID;
            
            insertTiers(sessId, venue_id, async () => {
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
    const { 
        domain_id, event_id, venue_id, template_id, date_from, date_to, days_of_week, 
        times, gateway_id, min_price, sync_ticketland, ticketland_quota,
        price_vip_nose, price_vip_scene, price_main_salon, price_upper_closed, price_upper_open 
    } = req.body;
    
    if (!event_id || !date_from || !date_to || !times) {
        return res.status(400).send("Заполните все обязательные поля");
    }

    const syncVal = (sync_ticketland === '1' || sync_ticketland === 1 || sync_ticketland === 'on') ? 1 : 0;
    const quotaVal = (ticketland_quota && parseInt(ticketland_quota, 10) > 0) ? parseInt(ticketland_quota, 10) : null;
    const tmplVal = (template_id && parseInt(template_id, 10) > 0) ? parseInt(template_id, 10) : null;
    const basePrice = parseFloat(min_price) || 1750;
    const pVipNose = parseFloat(price_vip_nose) || (basePrice + 3000);
    const pVipScene = parseFloat(price_vip_scene) || (basePrice + 1250);
    const pMainSalon = parseFloat(price_main_salon) || (basePrice + 750);
    const pUpperClosed = parseFloat(price_upper_closed) || (basePrice + 200);
    const pUpperOpen = parseFloat(price_upper_open) || basePrice;

    // Check if venue is single-zone
    const venueRow = await new Promise((resolve) => {
        db.get("SELECT ship_model, capacity FROM venues WHERE id = ?", [venue_id], (err, row) => resolve(row));
    });
    const isSingleZone = venueRow && (venueRow.ship_model === 'Входные 60' || venueRow.capacity <= 60);

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
                "INSERT INTO sessions (event_id, venue_id, template_id, start_time, status, gateway_id, min_price, sync_ticketland, ticketland_quota) VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?)",
                [event_id, venue_id, tmplVal, startTime, gateway_id || 1, basePrice, syncVal, quotaVal],
                function(err) {
                    if (!err && this.lastID) {
                        const sessId = this.lastID;
                        const stmt = db.prepare("INSERT INTO ticket_tiers (session_id, section_id, name, price, capacity, available) VALUES (?, ?, ?, ?, ?, ?)");
                        if (isSingleZone) {
                            stmt.run([sessId, '1', 'Салон теплохода (Свободная посадка)', pUpperOpen, 60, 60]);
                        } else {
                            stmt.run([sessId, '1', 'Главная палуба — VIP Нос (Панорама)', pVipNose, 20, 20]);
                            stmt.run([sessId, '2', 'Главная палуба — VIP Салон у сцены', pVipScene, 20, 20]);
                            stmt.run([sessId, '3', 'Главная палуба — Салон (Танцпол и Бар)', pMainSalon, 20, 20]);
                            stmt.run([sessId, '4', 'Верхняя палуба — Закрытый салон (DJ/Гид)', pUpperClosed, 48, 48]);
                            stmt.run([sessId, '5', 'Верхняя палуба — Открытая палуба (Корма)', pUpperOpen, 32, 32]);
                        }
                        stmt.finalize(() => resolve());
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

// Explicit action: Publish / Unpublish session to Ticketland by manager command
app.post('/session/toggle-sync/:id', requireAuth, (req, res) => {
    const domainId = req.query.domain_id || req.body.domain_id || 1;
    db.get("SELECT sync_ticketland FROM sessions WHERE id = ?", [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).send("Рейс не найден");
        const nextState = row.sync_ticketland === 1 ? 0 : 1;
        db.run("UPDATE sessions SET sync_ticketland = ? WHERE id = ?", [nextState, req.params.id], () => {
            res.redirect(`/?domain_id=${domainId}&tab=sessions`);
        });
    });
});

// Explicit bulk action: Publish ALL active sessions to Ticketland
app.post('/session/bulk-sync-ticketland', requireAuth, (req, res) => {
    const domainId = req.body.domain_id || 1;
    const targetState = (req.body.action === 'unpublish' || req.body.sync_action === 'unpublish') ? 0 : 1;
    db.run("UPDATE sessions SET sync_ticketland = ?", [targetState], () => {
        res.redirect(`/?domain_id=${domainId}&tab=sessions`);
    });
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

// PRICE TEMPLATES & ZONING CRUD
app.post('/price-template/save', requireAuth, (req, res) => {
    const {
        id, domain_id, venue_id, name, ship_model,
        price_vip_nose, price_vip_scene, price_main_salon, price_upper_closed, price_upper_open,
        ticketland_quota, apply_future
    } = req.body;

    const pVipNose = parseFloat(price_vip_nose) || 4500;
    const pVipScene = parseFloat(price_vip_scene) || 3000;
    const pMainSalon = parseFloat(price_main_salon) || 2500;
    const pUpperClosed = parseFloat(price_upper_closed) || 1950;
    const pUpperOpen = parseFloat(price_upper_open) || 1750;
    const quota = parseInt(ticketland_quota, 10) || 50;
    const vId = venue_id ? parseInt(venue_id, 10) : null;
    const sModel = ship_model || 'Москва-125';
    const domId = domain_id || 1;

    const doApplyFuture = (templateId, callback) => {
        if (!apply_future || (apply_future !== '1' && apply_future !== 1 && apply_future !== 'on' && apply_future !== true)) {
            return callback();
        }
        const condition = vId ? "(template_id = ? OR venue_id = ?)" : "template_id = ?";
        const condParams = vId ? [templateId, vId] : [templateId];

        db.all(`SELECT id FROM sessions WHERE ${condition} AND status = 'active' AND (start_time >= datetime('now', '-2 hours') OR start_time >= date('now'))`, condParams, (sErr, sessRows) => {
            if (sErr || !sessRows || sessRows.length === 0) return callback();

            const sessIds = sessRows.map(r => r.id);
            const placeholders = sessIds.map(() => '?').join(',');
            db.run(`UPDATE sessions SET min_price = ?, ticketland_quota = ?, template_id = ? WHERE id IN (${placeholders})`, [pUpperOpen, quota, templateId, ...sessIds], (uErr) => {
                if (uErr) return callback(uErr);

                db.run(`DELETE FROM ticket_tiers WHERE session_id IN (${placeholders})`, sessIds, () => {
                    const stmt = db.prepare("INSERT INTO ticket_tiers (session_id, section_id, name, price, capacity, available) VALUES (?, ?, ?, ?, ?, ?)");
                    sessIds.forEach(sId => {
                        if (sModel === 'Входные 60') {
                            stmt.run([sId, '1', 'Салон теплохода (Свободная посадка)', pUpperOpen, 60, 60]);
                        } else {
                            stmt.run([sId, '1', 'Главная палуба — VIP Нос (Панорама)', pVipNose, 20, 20]);
                            stmt.run([sId, '2', 'Главная палуба — VIP Салон у сцены', pVipScene, 20, 20]);
                            stmt.run([sId, '3', 'Главная палуба — Салон (Танцпол и Бар)', pMainSalon, 20, 20]);
                            stmt.run([sId, '4', 'Верхняя палуба — Закрытый салон (DJ/Гид)', pUpperClosed, 48, 48]);
                            stmt.run([sId, '5', 'Верхняя палуба — Открытая палуба (Корма)', pUpperOpen, 32, 32]);
                        }
                    });
                    stmt.finalize(callback);
                });
            });
        });
    };

    if (id) {
        db.run(`
            UPDATE price_templates SET
                venue_id = ?, name = ?, ship_model = ?,
                price_vip_nose = ?, price_vip_scene = ?, price_main_salon = ?,
                price_upper_closed = ?, price_upper_open = ?, ticketland_quota = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [vId, name, sModel, pVipNose, pVipScene, pMainSalon, pUpperClosed, pUpperOpen, quota, id], function(err) {
            if (err) return res.status(500).send(err.message);
            doApplyFuture(id, async () => {
                try {
                    await builder.rebuildDomain(domId);
                } catch(e) {}
                res.redirect(`/?domain_id=${domId}&tab=pricing`);
            });
        });
    } else {
        db.run(`
            INSERT INTO price_templates (venue_id, name, ship_model, price_vip_nose, price_vip_scene, price_main_salon, price_upper_closed, price_upper_open, ticketland_quota)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [vId, name, sModel, pVipNose, pVipScene, pMainSalon, pUpperClosed, pUpperOpen, quota], function(err) {
            if (err) return res.status(500).send(err.message);
            const newId = this.lastID;
            doApplyFuture(newId, async () => {
                try {
                    await builder.rebuildDomain(domId);
                } catch(e) {}
                res.redirect(`/?domain_id=${domId}&tab=pricing`);
            });
        });
    }
});

app.post('/price-template/apply-future', requireAuth, (req, res) => {
    const templateId = req.body.template_id;
    const domId = req.body.domain_id || 1;

    db.get("SELECT * FROM price_templates WHERE id = ?", [templateId], (err, tmpl) => {
        if (err || !tmpl) return res.status(404).send("Шаблон не найден");

        const condition = tmpl.venue_id ? "(template_id = ? OR venue_id = ?)" : "template_id = ?";
        const condParams = tmpl.venue_id ? [tmpl.id, tmpl.venue_id] : [tmpl.id];

        db.all(`SELECT id FROM sessions WHERE ${condition} AND status = 'active' AND (start_time >= datetime('now', '-2 hours') OR start_time >= date('now'))`, condParams, (sErr, sessRows) => {
            if (sErr || !sessRows || sessRows.length === 0) {
                return res.redirect(`/?domain_id=${domId}&tab=pricing&msg=no_sessions`);
            }

            const sessIds = sessRows.map(r => r.id);
            const placeholders = sessIds.map(() => '?').join(',');

            db.run(`UPDATE sessions SET min_price = ?, ticketland_quota = ?, template_id = ? WHERE id IN (${placeholders})`, 
                [tmpl.price_upper_open, tmpl.ticketland_quota, tmpl.id, ...sessIds], (uErr) => {
                if (uErr) return res.status(500).send(uErr.message);

                db.run(`DELETE FROM ticket_tiers WHERE session_id IN (${placeholders})`, sessIds, () => {
                    const stmt = db.prepare("INSERT INTO ticket_tiers (session_id, section_id, name, price, capacity, available) VALUES (?, ?, ?, ?, ?, ?)");
                    sessIds.forEach(sId => {
                        if (tmpl.ship_model === 'Входные 60') {
                            stmt.run([sId, '1', 'Салон теплохода (Свободная посадка)', tmpl.price_upper_open, 60, 60]);
                        } else {
                            stmt.run([sId, '1', 'Главная палуба — VIP Нос (Панорама)', tmpl.price_vip_nose, 20, 20]);
                            stmt.run([sId, '2', 'Главная палуба — VIP Салон у сцены', tmpl.price_vip_scene, 20, 20]);
                            stmt.run([sId, '3', 'Главная палуба — Салон (Танцпол и Бар)', tmpl.price_main_salon, 20, 20]);
                            stmt.run([sId, '4', 'Верхняя палуба — Закрытый салон (DJ/Гид)', tmpl.price_upper_closed, 48, 48]);
                            stmt.run([sId, '5', 'Верхняя палуба — Открытая палуба (Корма)', tmpl.price_upper_open, 32, 32]);
                        }
                    });
                    stmt.finalize(async () => {
                        try {
                            await builder.rebuildDomain(domId);
                        } catch(e) {}
                        res.redirect(`/?domain_id=${domId}&tab=pricing&updated=${sessIds.length}`);
                    });
                });
            });
        });
    });
});

app.post('/price-template/delete/:id', requireAuth, (req, res) => {
    const domId = req.body.domain_id || req.query.domain_id || 1;
    db.run("DELETE FROM price_templates WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).send(err.message);
        res.redirect(`/?domain_id=${domId}&tab=pricing`);
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
        db.all("SELECT s.id, s.start_time, e.title as event_title, v.name as venue_name FROM sessions s JOIN events e ON s.event_id = e.id JOIN venues v ON s.venue_id = v.id WHERE s.status = 'active' ORDER BY s.start_time ASC", (sErr, sessions) => {
            res.render('edit_page', { page: null, domains, selectedDomainId, sessions: sessions || [] });
        });
    });
});

app.get('/page/edit/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM pages WHERE id = ?", [req.params.id], (err, page) => {
        if (err) return res.status(500).send(err.message);
        if (!page) return res.status(404).send('Страница не найдена');
        
        db.all("SELECT * FROM domains ORDER BY id ASC", (err, domains) => {
            if (err) return res.status(500).send(err.message);
            parseDomainGateways(domains);
            db.all("SELECT s.id, s.start_time, e.title as event_title, v.name as venue_name FROM sessions s JOIN events e ON s.event_id = e.id JOIN venues v ON s.venue_id = v.id WHERE s.status = 'active' ORDER BY s.start_time ASC", (sErr, sessions) => {
                res.render('edit_page', { page, domains, selectedDomainId: page.domain_id, sessions: sessions || [] });
            });
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

// ==========================================
// МАРКЕТИНГ, UTM-КАМПАНИИ И ВОРОНКА ПРОДАЖ
// ==========================================

// Сохранение / создание рекламной кампании
app.post('/marketing/campaign/save', requireAuth, (req, res) => {
    const { id, domain_id, title, utm_source, utm_medium, utm_campaign, utm_term, utm_content, promo_code, target_page, budget, notes } = req.body;
    if (id) {
        db.run(`UPDATE marketing_campaigns SET 
            title = ?, utm_source = ?, utm_medium = ?, utm_campaign = ?, 
            utm_term = ?, utm_content = ?, promo_code = ?, target_page = ?, 
            budget = ?, notes = ? 
            WHERE id = ?`,
            [title, utm_source, utm_medium, utm_campaign, utm_term || '', utm_content || '', promo_code || '', target_page || '/', parseFloat(budget) || 0, notes || '', id],
            (err) => {
                if (err) console.error("Error updating campaign:", err);
                res.redirect(`/?domain_id=${domain_id || 2}&tab=marketing`);
            }
        );
    } else {
        db.run(`INSERT INTO marketing_campaigns 
            (domain_id, title, utm_source, utm_medium, utm_campaign, utm_term, utm_content, promo_code, target_page, budget, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [domain_id || 2, title, utm_source, utm_medium, utm_campaign, utm_term || '', utm_content || '', promo_code || '', target_page || '/', parseFloat(budget) || 0, notes || ''],
            (err) => {
                if (err) console.error("Error creating campaign:", err);
                res.redirect(`/?domain_id=${domain_id || 2}&tab=marketing`);
            }
        );
    }
});

// Удаление рекламной кампании
app.post('/marketing/campaign/delete/:id', requireAuth, (req, res) => {
    const domain_id = req.body.domain_id || 2;
    db.run("DELETE FROM marketing_campaigns WHERE id = ?", [req.params.id], (err) => {
        if (err) console.error("Error deleting campaign:", err);
        res.redirect(`/?domain_id=${domain_id}&tab=marketing`);
    });
});

// Публичный API эндпоинт для фиксации шагов воронки с фронтенда / виджета
app.post('/api/track-event', (req, res) => {
    const { domain_id, event_type, source, medium, campaign, device, event_title, zone_name, amount, drop_reason, page_url } = req.body;
    if (!event_type) return res.status(400).json({ success: false, error: 'event_type required' });

    db.run(`INSERT INTO marketing_events 
        (domain_id, event_type, source, medium, campaign, device, event_title, zone_name, amount, drop_reason, page_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [domain_id || 2, event_type, source || 'direct', medium || '', campaign || '', device || 'mobile', event_title || '', zone_name || '', parseFloat(amount) || 0, drop_reason || '', page_url || ''],
        function(err) {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, event_id: this.lastID });
        }
    );
});

// =========================================================================
// НАШ СОБСТВЕННЫЙ АВТОНОМНЫЙ ВИДЖЕТ (NATIVE SEATING WIDGET)
// =========================================================================

// 1. Получение данных сеанса и схемы для виджета
app.get('/api/widget/session/:id', (req, res) => {
    const sessionId = req.params.id;
    db.get(`
        SELECT s.*, e.title as event_title, e.age_restriction, e.duration_minutes,
               v.name as venue_name, v.pier_address, v.scheme_file, v.ship_model
        FROM sessions s
        JOIN events e ON s.event_id = e.id
        LEFT JOIN venues v ON s.venue_id = v.id
        WHERE s.id = ?
    `, [sessionId], (err, session) => {
        if (err || !session) {
            return res.status(404).json({ error: 'Сеанс не найден' });
        }

        // Determine SVG Scheme URL
        let schemeSvg = '/ships_schemes/rock_hit_neva_scheme.svg';
        const modelStr = ((session.ship_model || '') + ' ' + (session.scheme_file || '') + ' ' + (session.venue_name || '')).toLowerCase();
        if (modelStr.includes('125')) schemeSvg = '/ships_schemes/moskva_125_styled_scheme.svg';
        else if (modelStr.includes('177')) schemeSvg = '/ships_schemes/moskva_177_scheme.svg';
        else if (modelStr.includes('201')) schemeSvg = '/ships_schemes/moskva_201_scheme.svg';
        else if (modelStr.includes('солярис') || modelStr.includes('solaris')) schemeSvg = '/ships_schemes/solaris_scheme.svg';

        // Get zone prices for this session
        db.all(`SELECT section_id, price FROM ticket_tiers WHERE session_id = ?`, [sessionId], (tErr, tiers) => {
            const zonePrices = {};
            (tiers || []).forEach(t => {
                if (t.section_id) zonePrices[String(t.section_id)] = parseFloat(t.price);
            });

            // Get occupied seats from active locks & orders
            const nowIso = new Date().toISOString();
            db.all(`
                SELECT place_id FROM tl_locked_tickets lt
                JOIN tl_baskets b ON lt.basket_id = b.id
                WHERE lt.performance_id = ? AND b.expires_at > ?
                UNION
                SELECT place_id FROM tl_order_tickets ot
                JOIN tl_orders o ON ot.order_id = o.id
                WHERE ot.performance_id = ? AND ot.status IN ('ordered', 'confirmed') AND (o.status = 'confirmed' OR o.expires_at > ?)
            `, [sessionId, nowIso, sessionId, nowIso], (oErr, occ) => {
                const occupied = (occ || []).map(r => String(r.place_id));

                const formattedDate = new Date(session.start_time).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                res.json({
                    id: session.id,
                    event_title: session.event_title,
                    start_time: session.start_time,
                    formatted_date: formattedDate,
                    venue_name: session.venue_name || 'Теплоход «Рок Хит Нева»',
                    pier_address: session.pier_address || 'Набережная Макарова, 34',
                    base_price: session.min_price || 1750,
                    scheme_svg_url: schemeSvg,
                    zone_prices: zonePrices,
                    occupied_seats: occupied
                });
            });
        });
    });
});

// 2. Бронирование и оплата заказа через наш виджет
app.post('/api/widget/book', (req, res) => {
    const rawSessionId = req.body.sessionId || req.body.session_id;
    const rawSeats = req.body.seats || [];
    const customer = req.body.customer || {
        name: req.body.customer_name || req.body.name || 'Гость',
        phone: req.body.customer_phone || req.body.phone || '',
        email: req.body.customer_email || req.body.email || ''
    };

    if (!rawSessionId || !rawSeats || !rawSeats.length || !customer || !customer.phone) {
        return res.status(400).json({ success: false, message: 'Заполните обязательные поля и выберите места' });
    }

    const sessionId = String(rawSessionId);
    const orderId = String(Date.now()).slice(-8) + Math.floor(Math.random() * 90 + 10);
    const nowIso = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 172800 * 1000).toISOString();

    db.run(`INSERT INTO tl_orders (
        id, customer_name, customer_phone, customer_email, status, confirmed_at, expires_at
    ) VALUES (?, ?, ?, ?, 'confirmed', ?, ?)`,
    [orderId, customer.name || 'Гость', customer.phone, customer.email || '', nowIso, expiresAt],
    (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const stmt = db.prepare(`
            INSERT INTO tl_order_tickets (
                order_id, performance_id, place_id, price, barcode, spectator_name, status
            ) VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
        `);

        let totalPrice = 0;
        let mainBarcode = '';
        rawSeats.forEach((s, idx) => {
            const placeId = String(s.id || s.place_id || (idx + 1));
            const p = parseFloat(s.price) || 1750;
            const barcode = '293' + Date.now().toString().slice(-9) + placeId.padStart(2, '0');
            if (!mainBarcode) mainBarcode = barcode;
            totalPrice += p;
            stmt.run([orderId, sessionId, placeId, p, barcode, customer.name || 'Гость']);
        });

        stmt.finalize(() => {
            res.json({
                success: true,
                orderId: orderId,
                barcode: mainBarcode,
                totalPrice: totalPrice,
                message: 'Заказ успешно оформлен'
            });
        });
    });
});

// 3. Страница автономного предпросмотра и встраивания виджета
app.get('/widget/embed', (req, res) => {
    const sessionId = req.query.session_id || '1';
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Выбор мест на теплоходе</title>
            <link rel="stylesheet" href="/css/ship_widget.css">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
            <style>
                body { margin: 0; padding: 20px; background: #0b1120; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
            </style>
        </head>
        <body>
            <div class="ship-ticket-widget" data-session-id="${sessionId}"></div>
            <script src="/js/ship_widget.js"></script>
        </body>
        </html>
    `);
});

// 4. API быстрого встраивания нашего нативного виджета в любую страницу CMS
app.post('/api/widget/embed-into-page', requireAuth, (req, res) => {
    const { page_id, session_id, domain_id } = req.body;
    if (!page_id || !session_id) {
        return res.status(400).json({ success: false, message: 'page_id and session_id required' });
    }

    const nativeWidgetHtml = `
<!-- НАШ НАВЫЙ ИНТЕРАКТИВНЫЙ ВИДЖЕТ ТЕПЛОХОДА -->
<link rel="stylesheet" href="/static/css/ship_widget.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<div class="ship-ticket-widget" data-session-id="${session_id}"></div>
<script src="/static/js/ship_widget.js"></script>
`.trim();

    db.run("UPDATE pages SET iframe_code = ? WHERE id = ?", [nativeWidgetHtml, page_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        
        // Rebuild page
        db.get("SELECT * FROM pages WHERE id = ?", [page_id], (pErr, page) => {
            if (!pErr && page) {
                builder.buildPage(page).catch(e => console.error("Error rebuilding page:", e));
            }
            res.redirect(`/?domain_id=${domain_id || ''}&tab=widget&msg=embedded`);
        });
    });
});

// 5. API массового переключения всех страниц и мероприятий домена на наш SVG-виджет или Ticketland
app.post('/api/domain/switch-all-widgets', requireAuth, async (req, res) => {
    const { domain_id, mode } = req.body;
    if (!domain_id) return res.redirect('/?tab=widget&error=no_domain');

    const redirectUrl = req.headers.referer || `/?domain_id=${domain_id}&tab=widget`;

    try {
        const events = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM events WHERE domain_id = ?", [domain_id], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        });

        const pages = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM pages WHERE domain_id = ?", [domain_id], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        });

        if (mode === 'native') {
            const sessions = await new Promise((resolve, reject) => {
                db.all("SELECT * FROM sessions WHERE event_id IN (SELECT id FROM events WHERE domain_id = ?) AND status = 'active' ORDER BY start_time ASC", [domain_id], (err, rows) => {
                    if (err) reject(err); else resolve(rows || []);
                });
            });

            const eventSessionMap = {};
            sessions.forEach(s => {
                if (!eventSessionMap[s.event_id]) eventSessionMap[s.event_id] = s.id;
            });
            const defaultSessionId = sessions.length > 0 ? sessions[0].id : 1;

            // Update all events to use our native widget
            for (let ev of events) {
                const sId = eventSessionMap[ev.id] || defaultSessionId;
                const widgetHtml = `<div class="ship-ticket-widget" data-session-id="${sId}"></div>\n<link rel="stylesheet" href="/static/css/ship_widget.css">\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">\n<script src="/static/js/ship_widget.js"></script>`;
                await new Promise((resolve) => {
                    db.run("UPDATE events SET iframe_code = ? WHERE id = ?", [widgetHtml, ev.id], resolve);
                });
            }

            // Update all pages to use our native widget
            for (let page of pages) {
                // If it is a legal document like /pr or /oferta, do not overwrite iframe_code if it doesn't contain a widget
                if (page.slug === 'pr' || page.slug === 'oferta' || page.slug === 'оферта' || page.slug === 'правила-заказа-билетов') {
                    continue;
                }
                let sId = defaultSessionId;
                const matchedEvent = events.find(e => e.slug === page.slug || ('/' + e.slug) === page.slug);
                if (matchedEvent && eventSessionMap[matchedEvent.id]) {
                    sId = eventSessionMap[matchedEvent.id];
                }
                const widgetHtml = `<div class="ship-ticket-widget" data-session-id="${sId}"></div>\n<link rel="stylesheet" href="/static/css/ship_widget.css">\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">\n<script src="/static/js/ship_widget.js"></script>`;
                await new Promise((resolve) => {
                    db.run("UPDATE pages SET iframe_code = ? WHERE id = ?", [widgetHtml, page.id], resolve);
                });
            }

            await builder.rebuildDomain(domain_id);
            return res.redirect(redirectUrl);
        } else {
            // Restore Ticketland standard containers
            const defaultTlCode = `<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/JHgCdar1f2RgfwwTnasWr9ScZXK_hHlR/"></div>`;
            for (let ev of events) {
                await new Promise((resolve) => {
                    db.run("UPDATE events SET iframe_code = ? WHERE id = ?", [defaultTlCode, ev.id], resolve);
                });
            }
            for (let page of pages) {
                if (page.slug === 'pr' || page.slug === 'oferta' || page.slug === 'оферта' || page.slug === 'правила-заказа-билетов') {
                    continue;
                }
                await new Promise((resolve) => {
                    db.run("UPDATE pages SET iframe_code = ? WHERE id = ?", [defaultTlCode, page.id], resolve);
                });
            }

            await builder.rebuildDomain(domain_id);
            return res.redirect(redirectUrl);
        }
    } catch(err) {
        console.error("Error in switch-all-widgets:", err);
        return res.redirect(redirectUrl);
    }
});

app.listen(PORT, () => {
    console.log(`B2B CMS работает на http://localhost:${PORT}`);
});

