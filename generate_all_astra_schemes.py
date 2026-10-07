import sys, re

sys.stdout.reconfigure(encoding='utf-8')

# Read pristine rock hit neva scheme as our architectural base
with open('public/ships_schemes/rock_hit_neva_scheme.svg', 'r', encoding='utf-8') as f:
    base_svg = f.read()

schemes_config = {
    'moskva_201_scheme.svg': {
        'title': '«Москва-201»',
        'subtitle': 'двухпалубный теплоход · VIP диваны',
        'replacements': {
            'Места категории стандарт': 'VIP диваны и столики салона',
            'Вип салон': 'VIP носовой салон',
        }
    },
    'moskva_177_scheme.svg': {
        'title': '«Москва-177»',
        'subtitle': 'двухпалубный теплоход · Флагман',
        'replacements': {
            'Основной салон': 'Флагманский салон',
            'Открытая палуба': 'Открытая терраса',
        }
    },
    'moskva_125_classic_scheme.svg': {
        'title': '«Москва-125»',
        'subtitle': 'двухпалубный теплоход · Инженерная рассадка',
        'replacements': {
            'Основной салон': 'Главный салон',
        }
    },
    'moskva_125_styled_scheme.svg': {
        'title': '«Москва-125»',
        'subtitle': 'двухпалубный теплоход · Стилизованная рассадка',
        'replacements': {
            'Фотозона': 'Танцпол',
        }
    },
    'solaris_scheme.svg': {
        'title': '«Солярис»',
        'subtitle': 'двухпалубный теплоход · Премиум-класс',
        'replacements': {
            'Основной салон': 'Панорамный салон',
            'Вип салон': 'Премиум лаундж',
        }
    },
    'moskva_177_dance_scheme.svg': {
        'title': '«Москва-177»',
        'subtitle': 'двухпалубный теплоход · Танцевальная палуба',
        'replacements': {
            'Фотозона': 'Танцпол',
            'Места категории стандарт': 'Танцпол и столики',
        }
    }
}

for filename, cfg in schemes_config.items():
    svg = base_svg
    # Replace title
    svg = svg.replace('«Рок Хит Нева»', cfg['title'])
    # Replace subtitle
    svg = svg.replace('двухпалубный теплоход', cfg['subtitle'])
    
    # Custom zone replacements
    for old_txt, new_txt in cfg.get('replacements', {}).items():
        svg = svg.replace(old_txt, new_txt)
        
    out_path = f'public/ships_schemes/{filename}'
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(svg)
    print(f"Generated {out_path} successfully for {cfg['title']}")

print("All Astra Marine architectural SVGs generated successfully!")
