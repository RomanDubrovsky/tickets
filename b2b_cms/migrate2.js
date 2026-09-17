const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("ALTER TABLE domains ADD COLUMN script_1_name TEXT DEFAULT 'Юрлицо 1'");
    db.run("ALTER TABLE domains ADD COLUMN script_1_code TEXT DEFAULT ''");
    db.run("ALTER TABLE domains ADD COLUMN script_2_name TEXT DEFAULT 'Юрлицо 2'");
    db.run("ALTER TABLE domains ADD COLUMN script_2_code TEXT DEFAULT ''");
    db.run("ALTER TABLE domains ADD COLUMN footer_text TEXT DEFAULT ''"); // For footer legal info
    
    db.run("ALTER TABLE pages ADD COLUMN script_choice INTEGER DEFAULT 1");
    
    console.log("Migration 2 complete");
});
