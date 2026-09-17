import json

with open('extracted_events.json', 'r', encoding='utf-8') as f:
    events = json.load(f)

for e in events:
    title_bytes = e['title'].encode('utf-8')
    print(f\"Slug: {e['slug']:<25} | Title: {e['title']}\")
