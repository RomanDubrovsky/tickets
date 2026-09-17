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
    
    // Предзаполним таблицу тестовыми доменами, если она пуста
    db.get("SELECT COUNT(*) AS count FROM domains", (err, row) => {
        if (!err && row.count === 0) {
            const stmt = db.prepare("INSERT INTO domains (name) VALUES (?)");
            ['site1.ru', 'site2.ru', 'site3.ru', 'site4.ru', 'site5.ru'].forEach(domain => {
                stmt.run(domain);
            });
            stmt.finalize();
        }
    });
});

module.exports = db;
