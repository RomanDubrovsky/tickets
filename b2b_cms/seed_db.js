const db = require('./db');

db.serialize(async () => {
    console.log("Checking DB seeding...");

    // 1. Ensure Venues
    db.all("SELECT * FROM domains", (err, domains) => {
        if (err || !domains) return console.error(err);

        domains.forEach(d => {
            db.get("SELECT COUNT(*) as count FROM venues WHERE domain_id = ?", [d.id], (e, row) => {
                if (row && row.count === 0) {
                    const venueName = d.name.includes('rockhit') ? 'Теплоход «Рок Хит Нева»' : 'Клуб-теплоход «Акватория Звука»';
                    const desc = d.name.includes('rockhit') ? 'Двухпалубный рок-теплоход с концертным звуком и рестораном' : 'Музыкальный клуб-теплоход с панорамной палубой';
                    db.run("INSERT INTO venues (domain_id, name, pier_address, capacity, description) VALUES (?, ?, ?, ?, ?)",
                        [d.id, venueName, 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34', 120, desc],
                        function(err2) {
                            if (!err2) console.log(`Created default venue for domain ${d.name}, id=${this.lastID}`);
                        }
                    );
                }
            });
        });

        // 2. Sync events from pages
        db.all("SELECT * FROM pages WHERE slug != '/' AND slug != ''", (err2, pages) => {
            if (err2 || !pages) return;

            pages.forEach(p => {
                db.get("SELECT id FROM events WHERE domain_id = ? AND slug = ?", [p.domain_id, p.slug], (e3, ev) => {
                    if (!ev) {
                        const isFeatured = (p.slug.includes('tsoy') || p.slug.includes('pankonneva') || p.slug.includes('gromyka') || p.slug.includes('bridges')) ? 1 : 0;
                        const shortDesc = 'Музыкальный круиз по Неве с панорамным видом на разводные мосты, живым звуком и баром на борту.';
                        db.run(
                            `INSERT INTO events (domain_id, title, slug, iframe_code, short_desc, duration_minutes, age_restriction, is_featured, min_price) 
                             VALUES (?, ?, ?, ?, ?, 120, '18+', ?, 1500)`,
                            [p.domain_id, p.title, p.slug, p.iframe_code, shortDesc, isFeatured],
                            function(err4) {
                                if (!err4) console.log(`Synced event: ${p.title} (${p.slug})`);
                            }
                        );
                    }
                });
            });

            // 3. Generate sample sessions for events
            setTimeout(() => {
                db.all("SELECT events.*, venues.id as venue_id FROM events LEFT JOIN venues ON events.domain_id = venues.domain_id", (e4, eventList) => {
                    if (e4 || !eventList) return;
                    
                    eventList.forEach(ev => {
                        db.get("SELECT COUNT(*) as count FROM sessions WHERE event_id = ?", [ev.id], (e5, sRow) => {
                            if (sRow && sRow.count === 0) {
                                // Create upcoming sessions for this event
                                const dates = [
                                    '2026-05-15 19:00',
                                    '2026-05-15 21:30',
                                    '2026-05-16 19:00',
                                    '2026-05-16 21:30',
                                    '2026-05-22 19:00',
                                    '2026-05-23 21:30'
                                ];
                                dates.forEach(dt => {
                                    db.run(
                                        `INSERT INTO sessions (event_id, venue_id, start_time, status, gateway_id, min_price) 
                                         VALUES (?, ?, ?, 'active', 1, ?)`,
                                        [ev.id, ev.venue_id || 1, dt, ev.min_price || 1500],
                                        function(err6) {
                                            if (!err6) {
                                                const sessId = this.lastID;
                                                db.run("INSERT INTO ticket_tiers (session_id, name, price, capacity, available) VALUES (?, 'Входной билет', ?, 80, 80)", [sessId, ev.min_price || 1500]);
                                                db.run("INSERT INTO ticket_tiers (session_id, name, price, capacity, available) VALUES (?, 'VIP столик с обслуживанием', ?, 20, 20)", [sessId, (ev.min_price || 1500) + 1000]);
                                            }
                                        }
                                    );
                                });
                                console.log(`Created sample sessions for event: ${ev.title}`);
                            }
                        });
                    });
                });
            }, 1000);
        });
    });
});
