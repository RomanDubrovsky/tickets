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

// Helper to parse gateways for domains
function parseDomainGateways(domains) {
    if (!domains) return;
    domains.forEach(d => {
        try {
            d.gateways = typeof d.gateways_json === 'string' ? JSON.parse(d.gateways_json) : (d.gateways_json || []);
        } catch(e) {
            d.gateways = [];
        }
        if (!Array.isArray(d.gateways) || d.gateways.length === 0) {
            d.gateways = [
                { id: 1, name: d.script_1_name || 'Юрлицо 1', code: d.script_1_code || '' },
                { id: 2, name: d.script_2_name || 'Юрлицо 2', code: d.script_2_code || '' }
            ];
        }
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
                                        activeTab
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

app.listen(PORT, () => {
    console.log(`B2B CMS работает на http://localhost:${PORT}`);
});
