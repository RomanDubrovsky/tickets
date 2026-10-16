const db = require('./db');
const builder = require('./builder');

const nativeSnippet = '<div class="ship-ticket-widget" data-session-id="1"></div><link rel="stylesheet" href="/static/css/ship_widget.css"><script src="/static/js/ship_widget.js"></script>';

db.all('SELECT id, name FROM domains', [], async (err, domains) => {
  if (err) {
    console.error('Error fetching domains:', err);
    process.exit(1);
  }
  console.log('Found domains:', domains);

  for (const d of domains) {
    console.log(`Processing domain ${d.id} (${d.name})...`);
    
    await new Promise((resolve) => {
      db.run("UPDATE events SET iframe_code = ? WHERE domain_id = ?", [nativeSnippet, d.id], resolve);
    });

    await new Promise((resolve) => {
      db.run("UPDATE pages SET iframe_code = ? WHERE domain_id = ? AND slug NOT IN ('pr', 'oferta', 'contacts')", [nativeSnippet, d.id], resolve);
    });

    try {
      await builder.rebuildDomain(d.id);
      console.log(`Rebuilt domain ${d.name} successfully!`);
    } catch (e) {
      console.error(`Error rebuilding domain ${d.name}:`, e.message);
    }
  }

  console.log('All domains successfully updated and rebuilt with native SVG widget!');
  process.exit(0);
});
