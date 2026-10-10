const builder = require('./builder');
const db = require('./db');

db.all("SELECT id, name FROM domains", async (err, domains) => {
    if (err) {
        console.error('Error fetching domains:', err);
        process.exit(1);
    }
    try {
        for (const d of domains) {
            console.log(`Rebuilding domain ${d.id}: ${d.name}...`);
            await builder.rebuildDomain(d.id);
            console.log(`✓ Domain ${d.name} built successfully.`);
        }
        console.log('All domains built OK!');
        process.exit(0);
    } catch (e) {
        console.error('Build error:', e);
        process.exit(1);
    }
});
