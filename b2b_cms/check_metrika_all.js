const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'cms.db'));

db.all('SELECT id, name, global_scripts FROM domains', (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('--- ALL DOMAINS YANDEX METRIKA COUNTERS ---');
    rows.forEach(r => {
        const script = r.global_scripts || '';
        const matches = script.match(/ym\(\s*(\d+)/g);
        const counterIds = matches ? matches.map(m => m.replace(/[^\d]/g, '')) : [];
        console.log(`Domain ID ${r.id}: ${r.name}`);
        if (counterIds.length > 0) {
            console.log(`  Counter ID(s): ${counterIds.join(', ')}`);
        } else {
            console.log(`  Counter ID(s): NONE / NO METRIKA SCRIPT`);
        }
    });
});
