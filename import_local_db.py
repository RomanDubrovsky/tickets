import json
import sqlite3
import os

with open('extracted_events.json', 'r', encoding='utf-8') as f:
    events = json.load(f)

db_path = os.path.join('b2b_cms', 'cms.db')
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Ensure domains exist with proper names
cur.execute("SELECT id, name FROM domains")
domains = dict(cur.fetchall())
print('Current domains in local DB:', domains)

# Let's find or insert rockhitneva.ru
cur.execute("SELECT id FROM domains WHERE name = 'rockhitneva.ru'")
row = cur.fetchone()
if row:
    domain_id = row[0]
else:
    cur.execute("INSERT INTO domains (name, primary_color, logo_url, script_1_name, script_1_code, script_2_name, script_2_code, footer_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ('rockhitneva.ru', '#d63384', 'https://rockhitneva.ru/wp-content/uploads/2024/03/logo1.png', 
                 'ООО "Акватур" (0b2b641d60f7f9443e566d47c89d208f)', 
                 '<script type=\"text/javascript\">\n    var TLConf = {\n        accessHash: \"0b2b641d60f7f9443e566d47c89d208f\",\n        version: 1,\n    };\n</script>\n<script async src=\"https://www.ticketland.ru/iframe/loaderJs/\"></script>',
                 'ООО "Второе юрлицо" (389069140c1ca808d0da0b0007a4fe33)',
                 '<script type=\"text/javascript\">\n    var TLConf = {\n        accessHash: \"389069140c1ca808d0da0b0007a4fe33\",\n        version: 1,\n    };\n</script>\n<script async src=\"https://www.ticketland.ru/iframe/loaderJs/\"></script>',
                 'ООО "Рок Хит Нева"\nОГРН: 1234567890123\nИНН: 7800000000'))
    domain_id = cur.lastrowid

# Clear old pages for rockhitneva.ru to have fresh sync
cur.execute("DELETE FROM pages WHERE domain_id = ?", (domain_id,))

# Insert all 20 pages
for e in events:
    cur.execute(
        "INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice) VALUES (?, ?, ?, ?, ?)",
        (domain_id, e['title'], e['slug'], e['widget_code'], 1)
    )

conn.commit()
print('Successfully inserted', len(events), 'pages for rockhitneva.ru in local DB')
conn.close()
