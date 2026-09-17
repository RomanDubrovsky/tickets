const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("ALTER TABLE domains ADD COLUMN primary_color TEXT DEFAULT '#0d6efd'", (err) => {
        if(err) console.log(err.message);
        else console.log("Added primary_color");
    });
    db.run("ALTER TABLE domains ADD COLUMN logo_url TEXT DEFAULT ''", (err) => {
        if(err) console.log(err.message);
        else console.log("Added logo_url");
    });
    db.run("ALTER TABLE domains ADD COLUMN bg_image_url TEXT DEFAULT ''", (err) => {
        if(err) console.log(err.message);
        else console.log("Added bg_image_url");
    });
});
