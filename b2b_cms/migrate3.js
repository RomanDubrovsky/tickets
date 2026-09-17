const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("ALTER TABLE domains ADD COLUMN gateways_json TEXT DEFAULT '[]'", (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error(err);
        } else {
            console.log("Column gateways_json added or already exists");
        }
        
        // Populate existing domains with their current script_1 and script_2 as default gateways
        db.all("SELECT id, script_1_name, script_1_code, script_2_name, script_2_code, gateways_json FROM domains", (err, rows) => {
            if (err) return console.error(err);
            rows.forEach(row => {
                let gateways = [];
                try {
                    gateways = JSON.parse(row.gateways_json || '[]');
                } catch(e) {}
                
                if (!gateways || gateways.length === 0) {
                    gateways = [
                        { id: 1, name: row.script_1_name || 'Юрлицо 1', code: row.script_1_code || '' },
                        { id: 2, name: row.script_2_name || 'Юрлицо 2', code: row.script_2_code || '' }
                    ];
                    
                    // If aquasound.club (id: 1), let's ensure 3 gateways can be present or ready
                    if (row.id === 1) {
                        gateways.push({
                            id: 3,
                            name: 'Кассовый шлюз 3',
                            code: ''
                        });
                    }
                    
                    db.run("UPDATE domains SET gateways_json = ? WHERE id = ?", [JSON.stringify(gateways), row.id], (err) => {
                        if (err) console.error("Update error:", err);
                        else console.log(`Populated gateways for domain ${row.id}`);
                    });
                }
            });
        });
    });
});
