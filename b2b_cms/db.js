const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Таблица доменов
    db.run(`CREATE TABLE IF NOT EXISTS domains (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        global_scripts TEXT DEFAULT ''
    )`);

    // Таблица страниц
    db.run(`CREATE TABLE IF NOT EXISTS pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        iframe_code TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id)
    )`);
    
    // Таблица площадок (теплоходы, причалы)
    db.run(`CREATE TABLE IF NOT EXISTS venues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        pier_address TEXT DEFAULT '',
        capacity INTEGER DEFAULT 100,
        description TEXT DEFAULT '',
        FOREIGN KEY (domain_id) REFERENCES domains(id)
    )`);

    // Таблица программ / мероприятий
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        short_desc TEXT DEFAULT '',
        full_desc TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        age_restriction TEXT DEFAULT '18+',
        duration_minutes INTEGER DEFAULT 120,
        music_genre TEXT DEFAULT '',
        is_featured INTEGER DEFAULT 0,
        iframe_code TEXT DEFAULT '',
        default_gateway_id INTEGER DEFAULT 1,
        min_price INTEGER DEFAULT 1500,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id)
    )`);

    // Таблица сеансов / рейсов
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        venue_id INTEGER,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        status TEXT DEFAULT 'active',
        gateway_id INTEGER DEFAULT 1,
        ticket_url TEXT DEFAULT '',
        min_price INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (venue_id) REFERENCES venues(id)
    )`);

    // Таблица категорий билетов и цен
    db.run(`CREATE TABLE IF NOT EXISTS ticket_tiers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        capacity INTEGER DEFAULT 0,
        available INTEGER DEFAULT 0,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )`);

    // Таблица партнеров / агентов / промоутеров
    db.run(`CREATE TABLE IF NOT EXISTS agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain_id INTEGER,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'agent',
        promo_code TEXT UNIQUE NOT NULL,
        commission_rate REAL DEFAULT 0.15,
        discount_rate REAL DEFAULT 0.05,
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id)
    )`);

    // Таблица продаж по агентской сети
    db.run(`CREATE TABLE IF NOT EXISTS agent_sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id INTEGER NOT NULL,
        session_id INTEGER,
        event_title TEXT DEFAULT '',
        customer_name TEXT DEFAULT '',
        amount REAL NOT NULL,
        commission_amount REAL NOT NULL,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
    )`);

    // Автоматическое заполнение площадок по умолчанию
    db.get("SELECT COUNT(*) AS count FROM venues", (err, row) => {
        if (!err && row.count === 0) {
            db.get("SELECT id FROM domains WHERE name = 'rockhitneva.ru'", (e, rDom) => {
                if (rDom) {
                    db.run("INSERT INTO venues (domain_id, name, pier_address, capacity, description) VALUES (?, ?, ?, ?, ?)",
                        [rDom.id, 'Теплоход «Рок Хит Нева»', 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34', 120, 'Двухпалубный комфортабельный рок-теплоход']);
                }
            });
            db.get("SELECT id FROM domains WHERE name = 'aquasound.club'", (e, aDom) => {
                if (aDom) {
                    db.run("INSERT INTO venues (domain_id, name, pier_address, capacity, description) VALUES (?, ?, ?, ?, ?)",
                        [aDom.id, 'Теплоход «Акватория Звука»', 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34', 100, 'Музыкальный клуб-теплоход']);
                }
            });
        }
    });

    // Автоматическое заполнение тестовых агентов и продаж
    db.get("SELECT COUNT(*) AS count FROM agents", (err, row) => {
        if (!err && row.count === 0) {
            db.run(`INSERT INTO agents (domain_id, name, role, promo_code, commission_rate, discount_rate, phone, email, notes) VALUES 
                (2, 'Отель «Астория» (Консьерж)', 'Отель / Дилер', 'ASTORIA10', 0.12, 0.05, '+7 (812) 494-57-57', 'concierge@astoria-hotel.ru', 'Стойка информации и ресепшен отеля'),
                (2, 'Алексей Рок-Гид (Промоутер)', 'Промоутер', 'ALEXROCK', 0.15, 0.10, '+7 (911) 234-56-78', 'alex@rockspb.ru', 'Распространение в рок-клубах и соцсетях'),
                (1, 'Гид по рекам и каналам СПб', 'Турагентство', 'SPBGUIDE', 0.10, 0.05, '+7 (921) 987-65-43', 'info@spbguide.tours', 'Турагент по водным экскурсиям')
            `, function(e) {
                if (!e) {
                    // Добавим примеры продаж для отображения статистики
                    db.run(`INSERT INTO agent_sales (agent_id, event_title, customer_name, amount, commission_amount) VALUES
                        (1, 'Концерт «Цой, Горшок, Егор и Хой» на Неве!', 'Иван Смирнов', 6000, 720),
                        (1, 'Рок и мосты', 'Елена Ковалева', 3000, 360),
                        (2, 'Концерт «Цой, Горшок, Егор и Хой» на Неве!', 'Дмитрий Петров', 4500, 675),
                        (2, 'Smoke on the water', 'Михаил Соколов', 3000, 450),
                        (3, 'Большое петербургское кольцо', 'Ольга Васильева', 3000, 300)
                    `);
                }
            });
        }
    });
});

module.exports = db;
