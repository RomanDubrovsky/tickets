import json
import sqlite3
import os

with open('extracted_events_aqua.json', 'r', encoding='utf-8') as f:
    events = json.load(f)

db_path = os.path.join('b2b_cms', 'cms.db')
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Find or insert aquasound.club
cur.execute("SELECT id FROM domains WHERE name = 'aquasound.club'")
row = cur.fetchone()
if row:
    domain_id = row[0]
else:
    cur.execute("INSERT INTO domains (name, primary_color, logo_url, script_1_name, script_1_code, script_2_name, script_2_code, footer_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ('aquasound.club', '#26a69a', 'https://aquasound.club/wp-content/uploads/2024/04/cropped-logo-aqua.png', 
                 'Основное юрлицо (8c8d43b735f10cc868462481cd0b51d5)', 
                 '<script type=\"text/javascript\">\n    var TLConf = {\n        accessHash: \"8c8d43b735f10cc868462481cd0b51d5\",\n        version: 1,\n    };\n</script>\n<script async src=\"https://www.ticketland.ru/iframe/loaderJs/\"></script>',
                 'Второе юрлицо',
                 '',
                 'ООО "Акватория Звука"\nОГРН: 1234567890123\nИНН: 7800000000'))
    domain_id = cur.lastrowid

# Clear old pages for aquasound.club
cur.execute("DELETE FROM pages WHERE domain_id = ?", (domain_id,))

# Insert all pages
for e in events:
    cur.execute(
        "INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice) VALUES (?, ?, ?, ?, ?)",
        (domain_id, e['title'], e['slug'], e['widget_code'], 1)
    )

conn.commit()
print('Successfully inserted', len(events), 'pages for aquasound.club in local DB')
conn.close()
