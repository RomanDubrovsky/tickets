const db = require('./db');

db.serialize(() => {
    // 1. Add venues
    db.get('SELECT id FROM domains WHERE name = ?', ['rockhitneva.ru'], (err, rDomain) => {
        if (rDomain) {
            db.get('SELECT id FROM venues WHERE domain_id = ?', [rDomain.id], (err, row) => {
                if (!row) {
                    db.run(
                        'INSERT INTO venues (domain_id, name, pier_address, capacity, description) VALUES (?, ?, ?, ?, ?)',
                        [rDomain.id, 'Теплоход «Рок Хит Нева»', 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34', 120, 'Двухпалубный комфортабельный теплоход с живым рок-звуком']
                    );
                }
            });
        }
    });

    db.get('SELECT id FROM domains WHERE name = ?', ['aquasound.club'], (err, aDomain) => {
        if (aDomain) {
            db.get('SELECT id FROM venues WHERE domain_id = ?', [aDomain.id], (err, row) => {
                if (!row) {
                    db.run(
                        'INSERT INTO venues (domain_id, name, pier_address, capacity, description) VALUES (?, ?, ?, ?, ?)',
                        [aDomain.id, 'Теплоход «Акватория Звука»', 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34', 100, 'Музыкальный теплоход-клуб с баром и панорамным обзором']
                    );
                }
            });
        }
    });

    // 2. Populate events from pages
    db.all('SELECT * FROM pages WHERE slug != " /\ AND slug != \\', [], (err, pages) => {
 if (err) return console.error(err);
 
 pages.forEach(p => {
 db.get('SELECT id FROM events WHERE domain_id = ? AND slug = ?', [p.domain_id, p.slug], (err, ev) => {
 if (!ev) {
 db.run(
 'INSERT INTO events (domain_id, title, slug, iframe_code, short_desc, duration_minutes, age_restriction, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
 [
 p.domain_id,
 p.title,
 p.slug,
 p.iframe_code,
 Музыкальная прогулка по Неве с видом на разводные мосты и живым концертом: ,
 120,
 '18+',
 1
 ]
 );
 }
 });
 });
 console.log(Processed events from existing pages);
 });
});
