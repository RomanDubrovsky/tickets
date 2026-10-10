const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'cms.db'));

db.serialize(() => {
    db.all('SELECT * FROM domains', (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        rows.forEach(d => {
            let gateways = [];
            try { 
                gateways = typeof d.gateways_json === 'string' ? JSON.parse(d.gateways_json) : (d.gateways_json || []); 
            } catch(e) {}
            if (!Array.isArray(gateways) || gateways.length === 0) {
                gateways = [
                    { id: 1, name: d.script_1_name || 'Юрлицо 1', code: d.script_1_code || '' },
                    { id: 2, name: d.script_2_name || 'Юрлицо 2', code: d.script_2_code || '' }
                ];
            }
            gateways.forEach(g => {
                if (g.id === 2 && (!g.code || g.code.trim() === '')) {
                    if (d.name.includes('rockhitneva')) {
                        g.name = 'ИП Юницына (Резерв)';
                        g.code = '<script>var TLConf = { accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>';
                    } else if (d.name.includes('aquasound')) {
                        g.name = 'ООО Морские Корабли (Резерв)';
                        g.code = '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>';
                    }
                }
            });
            const script_2_name = gateways[1] ? gateways[1].name : d.script_2_name;
            const script_2_code = gateways[1] ? gateways[1].code : d.script_2_code;
            db.run(
                'UPDATE domains SET script_2_name = ?, script_2_code = ?, gateways_json = ? WHERE id = ?', 
                [script_2_name, script_2_code, JSON.stringify(gateways), d.id],
                (err2) => {
                    if (err2) console.error(err2);
                    else console.log(`Updated domain ${d.name} (${d.id})`);
                }
            );
        });
    });
});
