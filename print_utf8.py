import json

with open('extracted_events.json', 'r', encoding='utf-8') as f:
    events = json.load(f)

for e in events:
    print(f\"Slug: {e['slug']} -> Title: {e['title']}\")
