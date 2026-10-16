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
        sync_ticketland INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (venue_id) REFERENCES venues(id)
    )`);

    // Таблица категорий билетов и цен (по зонам палубы)
    db.run(`CREATE TABLE IF NOT EXISTS ticket_tiers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        section_id TEXT DEFAULT '1',
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        capacity INTEGER DEFAULT 0,
        available INTEGER DEFAULT 0,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )`);

    // Auto-migrate new columns if table already existed
    db.run("ALTER TABLE sessions ADD COLUMN sync_ticketland INTEGER DEFAULT 0", () => {});
    db.run("ALTER TABLE sessions ADD COLUMN ticketland_quota INTEGER DEFAULT NULL", () => {});
    db.run("ALTER TABLE sessions ADD COLUMN template_id INTEGER DEFAULT NULL", () => {});
    db.run("ALTER TABLE ticket_tiers ADD COLUMN section_id TEXT DEFAULT '1'", () => {});
    db.run("ALTER TABLE venues ADD COLUMN ship_model TEXT DEFAULT 'Москва-125'", () => {});
    db.run("ALTER TABLE venues ADD COLUMN scheme_file TEXT DEFAULT 'moskva_125.json'", () => {});

    // Таблица шаблонов цен и распоясовок
    db.run(`CREATE TABLE IF NOT EXISTS price_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venue_id INTEGER,
        name TEXT NOT NULL,
        ship_model TEXT DEFAULT 'Москва-125',
        price_vip_nose INTEGER DEFAULT 4500,
        price_vip_scene INTEGER DEFAULT 3000,
        price_main_salon INTEGER DEFAULT 2500,
        price_upper_closed INTEGER DEFAULT 1950,
        price_upper_open INTEGER DEFAULT 1750,
        ticketland_quota INTEGER DEFAULT 50,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (venue_id) REFERENCES venues(id)
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

    // Обновление характеристик теплоходов в venues
    db.run("UPDATE venues SET ship_model = 'Москва-125', scheme_file = 'moskva_125.json', capacity = 140 WHERE name LIKE '%Рок Хит%' OR id = 2");
    db.run("UPDATE venues SET ship_model = 'Входные 60', scheme_file = 'vhodnye_60.json', capacity = 60 WHERE name LIKE '%Акватория%' OR id = 1");
    db.run("UPDATE venues SET ship_model = 'Москва-177', scheme_file = 'moskva_177.json', capacity = 150 WHERE name LIKE '%Нева-концерт%' OR id = 3");
    db.run("UPDATE venues SET ship_model = 'Москва-201', scheme_file = 'moskva_201.json', capacity = 168 WHERE name LIKE '%Град%' OR id = 4");

    // Таблица маркетинговых событий и воронки продаж
    db.run(`CREATE TABLE IF NOT EXISTS marketing_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain_id INTEGER,
        event_type TEXT NOT NULL,
        page_url TEXT DEFAULT '',
        source TEXT DEFAULT 'direct',
        medium TEXT DEFAULT 'referral',
        campaign TEXT DEFAULT '',
        device TEXT DEFAULT 'mobile',
        event_title TEXT DEFAULT '',
        zone_name TEXT DEFAULT '',
        amount REAL DEFAULT 0,
        drop_reason TEXT DEFAULT '',
        user_ip TEXT DEFAULT '',
        session_uuid TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id)
    )`);

    // Таблица рекламных кампаний и UTM-ссылок
    db.run(`CREATE TABLE IF NOT EXISTS marketing_campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain_id INTEGER,
        title TEXT NOT NULL,
        utm_source TEXT NOT NULL,
        utm_medium TEXT NOT NULL,
        utm_campaign TEXT NOT NULL,
        utm_term TEXT DEFAULT '',
        utm_content TEXT DEFAULT '',
        promo_code TEXT DEFAULT '',
        target_page TEXT DEFAULT '/',
        budget REAL DEFAULT 0,
        notes TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id)
    )`);

    // Автоматическое заполнение стартовых кампаний
    db.get("SELECT COUNT(*) AS count FROM marketing_campaigns", (err, row) => {
        if (!err && (!row || row.count === 0)) {
            db.run(`INSERT INTO marketing_campaigns (domain_id, title, utm_source, utm_medium, utm_campaign, utm_term, promo_code, target_page, budget, notes) VALUES
                (2, 'Яндекс Директ (Поиск) — Концерты и рок на Неве', 'yandex', 'cpc', 'rock_poisk_spb', 'рок концерт спб теплоход', 'ROCK2026', '/', 45000, 'Горячий спрос по ключевым фразам'),
                (2, 'VK Реклама — Белые Ночи и Разводные мосты', 'vk', 'target', 'white_nights_spb', 'интересы: рок музыка, туризм спб', 'BRIDGES10', '/tours', 30000, 'Таргет на жителей и гостей СПб'),
                (2, 'Отели СПб — Партнерские QR-коды на ресепшен', 'hotels', 'offline_qr', 'hotel_reception_qr', 'astoria, corinthia, grand_europe', 'ASTORIA10', '/', 0, 'Стойки консьержей и буклеты в номерах'),
                (2, 'Telegram каналы СПб — Афиша уикенда', 'telegram', 'cpc', 'spb_afisha_post', 'паблики KudaGo, Питер Live', 'SPBROCK', '/', 18000, 'Посевы в крупных каналах перед выходными'),
                (1, 'Яндекс Директ — Электронная музыка & рейвы на воде', 'yandex', 'cpc', 'aqua_sound_electro', 'электронная музыка теплоход спб', 'AQUA2026', '/', 25000, 'Клубная аудитория Акватории Звука')
            `);
        }
    });

    // Автоматическое заполнение стартовых данных воронки и аналитики
    db.get("SELECT COUNT(*) AS count FROM marketing_events", (err, row) => {
        if (!err && (!row || row.count === 0)) {
            // Заполняем репрезентативную выборку событий воронки для domain_id = 2 и 1
            const seedEvents = [
                // 1. Посещения (Visits)
                { dom: 2, type: 'visit', count: 5200, src: 'yandex', med: 'cpc', camp: 'rock_poisk_spb', dev: 'mobile' },
                { dom: 2, type: 'visit', count: 2800, src: 'yandex', med: 'cpc', camp: 'rock_poisk_spb', dev: 'desktop' },
                { dom: 2, type: 'visit', count: 2400, src: 'vk', med: 'target', camp: 'white_nights_spb', dev: 'mobile' },
                { dom: 2, type: 'visit', count: 1800, src: 'organic', med: 'organic', camp: 'seo', dev: 'mobile' },
                { dom: 2, type: 'visit', count: 900, src: 'direct', med: 'none', camp: 'direct', dev: 'desktop' },
                { dom: 2, type: 'visit', count: 650, src: 'hotels', med: 'offline_qr', camp: 'hotel_reception_qr', dev: 'mobile' },
                { dom: 2, type: 'visit', count: 700, src: 'telegram', med: 'cpc', camp: 'spb_afisha_post', dev: 'mobile' },

                // 2. Просмотр афиши (View Event)
                { dom: 2, type: 'view_event', count: 3100, src: 'yandex', title: 'Концерт «Цой, Горшок, Егор и Хой» на Неве!' },
                { dom: 2, type: 'view_event', count: 2400, src: 'vk', title: 'Рок и мосты' },
                { dom: 2, type: 'view_event', count: 1800, src: 'organic', title: 'Smoke on the water' },
                { dom: 2, type: 'view_event', count: 950, src: 'telegram', title: 'Русский рок под разводными мостами' },

                // 3. Клик Купить / Открытие схемы теплохода (Click Buy)
                { dom: 2, type: 'click_buy', count: 1750, src: 'yandex', dev: 'mobile' },
                { dom: 2, type: 'click_buy', count: 920, src: 'vk', dev: 'mobile' },
                { dom: 2, type: 'click_buy', count: 750, src: 'organic', dev: 'desktop' },
                { dom: 2, type: 'click_buy', count: 380, src: 'hotels', dev: 'mobile' },
                { dom: 2, type: 'click_buy', count: 320, src: 'telegram', dev: 'mobile' },

                // 4. Выбор столика / места на схеме (Select Seat)
                { dom: 2, type: 'select_seat', count: 680, zone: 'Главный салон', dev: 'mobile' },
                { dom: 2, type: 'select_seat', count: 420, zone: 'VIP Нос', dev: 'desktop' },
                { dom: 2, type: 'select_seat', count: 310, zone: 'Открытая корма', dev: 'mobile' },
                { dom: 2, type: 'select_seat', count: 210, zone: 'VIP Сцена', dev: 'mobile' },

                // 5. Успешная покупка (Purchase)
                { dom: 2, type: 'purchase', count: 180, src: 'yandex', zone: 'Главный салон', amount: 2500, dev: 'mobile', title: 'Концерт «Цой, Горшок, Егор и Хой» на Неве!' },
                { dom: 2, type: 'purchase', count: 110, src: 'yandex', zone: 'VIP Нос', amount: 4500, dev: 'desktop', title: 'Рок и мосты' },
                { dom: 2, type: 'purchase', count: 95, src: 'vk', zone: 'VIP Сцена', amount: 3000, dev: 'mobile', title: 'Smoke on the water' },
                { dom: 2, type: 'purchase', count: 75, src: 'hotels', zone: 'Главный салон', amount: 2500, dev: 'mobile', title: 'Концерт «Цой, Горшок, Егор и Хой» на Неве!' },
                { dom: 2, type: 'purchase', count: 60, src: 'organic', zone: 'Открытая корма', amount: 1750, dev: 'desktop', title: 'Русский рок под разводными мостами' },

                // 6. Отказы / Причины ухода без покупки (Drop-off reasons)
                { dom: 2, type: 'drop_off', count: 420, drop_reason: 'price_too_high', dev: 'mobile', notes: 'Высокая цена на VIP/Столики (ушли после просмотра цен)' },
                { dom: 2, type: 'drop_off', count: 290, drop_reason: 'no_seats_together', dev: 'mobile', notes: 'Нет свободных столиков на 4+ чел рядом' },
                { dom: 2, type: 'drop_off', count: 210, drop_reason: 'date_not_suitable', dev: 'desktop', notes: 'Не подошла дата или время отправления' },
                { dom: 2, type: 'drop_off', count: 135, drop_reason: 'mobile_ux', dev: 'mobile', notes: 'Сложность выбора мест на смартфоне (масштабирование SVG)' },
                { dom: 2, type: 'drop_off', count: 65, drop_reason: 'payment_failed', dev: 'mobile', notes: 'Сбой эквайринга или отказ банка' }
            ];

            const stmt = db.prepare(`INSERT INTO marketing_events 
                (domain_id, event_type, source, medium, campaign, device, event_title, zone_name, amount, drop_reason) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

            seedEvents.forEach(e => {
                // Вставим запись с повторением для точной статистики
                // Чтобы не перегружать базу миллионом строк, вставляем представительные записи с весом или пачками
                for (let i = 0; i < Math.min(e.count, 20); i++) {
                    stmt.run(
                        e.dom || 2, 
                        e.type, 
                        e.src || 'direct', 
                        e.med || 'cpc', 
                        e.camp || '', 
                        e.dev || 'mobile', 
                        e.title || 'Рок-концерт на Неве', 
                        e.zone || 'Главный салон', 
                        e.amount || 0, 
                        e.drop_reason || ''
                    );
                }
            });
            stmt.finalize();
        }
    });
});

module.exports = db;
