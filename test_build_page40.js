const builder = require('/home/opc/b2b_cms/builder');
const db = require('/home/opc/b2b_cms/db');

db.get("SELECT * FROM pages WHERE id = 40", async (err, p) => {
    if (err) {
        console.error("DB error:", err);
        process.exit(1);
    }
    console.log("Building page 40:", p);
    try {
        const res = await builder.buildPage(p);
        console.log("BUILD SUCCESS:", res);
        process.exit(0);
    } catch(e) {
        console.error("BUILD ERROR:", e);
        process.exit(1);
    }
});
