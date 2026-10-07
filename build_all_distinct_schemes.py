import sys, os, re
sys.stdout.reconfigure(encoding='utf-8')

# Read base SVG to retain header, defs, deck hull curves, and teak textures
with open('public/ships_schemes/rock_hit_neva_scheme.svg', 'r', encoding='utf-8') as f:
    base_svg = f.read()

# Extract defs
defs_match = re.search(r'<defs>.*?</defs>', base_svg, re.DOTALL)
defs_str = defs_match.group(0) if defs_match else ''

# Extract styles
style_match = re.search(r'<style>.*?</style>', base_svg, re.DOTALL)
style_str = style_match.group(0) if style_match else ''

# Hull contours
# Lower deck hull (left):
HULL_LOWER = '''
  <path d="M117.8 128.5C108.5 128.5 73.2 135.2 55.4 171.1C44.6 193 42.8 221.4 42.8 250.2V730.5C42.8 775 52.4 805 78.5 818.5C92.2 825.5 111.5 827.5 117.8 827.5C124.1 827.5 143.4 825.5 157.1 818.5C183.2 805 192.8 775 192.8 730.5V250.2C192.8 221.4 191 193 180.2 171.1C162.4 135.2 127.1 128.5 117.8 128.5Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.5" stroke-miterlimit="10"/>
  <!-- Teak lines on lower deck -->
  <g opacity="0.35" stroke="#94A3B8" stroke-width="0.5">
    <line x1="60" y1="200" x2="60" y2="780" stroke-dasharray="8 6"/>
    <line x1="80" y1="180" x2="80" y2="800" stroke-dasharray="8 6"/>
    <line x1="100" y1="160" x2="100" y2="810" stroke-dasharray="8 6"/>
    <line x1="120" y1="145" x2="120" y2="815" stroke-dasharray="8 6"/>
    <line x1="140" y1="160" x2="140" y2="810" stroke-dasharray="8 6"/>
    <line x1="160" y1="180" x2="160" y2="800" stroke-dasharray="8 6"/>
    <line x1="175" y1="200" x2="175" y2="780" stroke-dasharray="8 6"/>
  </g>
  <!-- Outer window rails -->
  <path d="M47 240V720M188 240V720" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
'''

# Upper deck hull (right):
HULL_UPPER = '''
  <path d="M338.2 142.5C330.5 142.5 301.2 148.2 286.4 178.1C277.6 196 275.8 220 275.8 245.2V720.5C275.8 760 283.4 788 305.5 800.5C317.2 807 333.5 808.5 338.2 808.5C342.9 808.5 359.2 807 370.9 800.5C393 788 400.6 760 400.6 720.5V245.2C400.6 220 398.8 196 390 178.1C375.2 148.2 345.9 142.5 338.2 142.5Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.5" stroke-miterlimit="10"/>
  <!-- Teak lines on upper deck -->
  <g opacity="0.35" stroke="#94A3B8" stroke-width="0.5">
    <line x1="290" y1="200" x2="290" y2="770" stroke-dasharray="8 6"/>
    <line x1="308" y1="180" x2="308" y2="790" stroke-dasharray="8 6"/>
    <line x1="324" y1="160" x2="324" y2="800" stroke-dasharray="8 6"/>
    <line x1="338" y1="150" x2="338" y2="802" stroke-dasharray="8 6"/>
    <line x1="352" y1="160" x2="352" y2="800" stroke-dasharray="8 6"/>
    <line x1="368" y1="180" x2="368" y2="790" stroke-dasharray="8 6"/>
    <line x1="386" y1="200" x2="386" y2="770" stroke-dasharray="8 6"/>
  </g>
  <!-- Panoramic canopy / railings -->
  <path d="M280 230V710M396 230V710" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
'''

def render_chair(x, y, num, direction='down', cat_id='standard', cat_name='Стандарт', table_label='Салон', price=1500, size=14):
    """Generates an authentic armchair with rounded backrest, armrests and centered number."""
    # Chair dimensions
    w, h = size, size
    hw, hh = w/2, h/2
    
    # Rotation angle based on direction
    rot = 0
    if direction == 'up': rot = 180
    elif direction == 'left': rot = 90
    elif direction == 'right': rot = -90
    
    fill_color = '#dbeafe' if cat_id == 'standard' else '#fef3c7' if 'vip' in cat_id else '#e0e7ff'
    stroke_color = '#1e3a8a' if cat_id == 'standard' else '#b45309' if 'vip' in cat_id else '#3730a3'
    
    # Path of an armchair with armrests
    # Drawn locally centered at (0,0) facing down
    path_d = f"M{-hw+2} {-hh} C{-hw+2} {-hh-2} {hw-2} {-hh-2} {hw-2} {-hh} L{hw} {-hh+4} L{hw} {hh-2} C{hw} {hh} {hw-2} {hh} {hw-4} {hh} L{hw-4} {hh-4} L{-hw+4} {hh-4} L{-hw+4} {hh} C{-hw+2} {hh} {-hw} {hh} {-hw} {hh-2} L{-hw} {-hh+4} Z"
    
    return f'''
    <g class="vessel-seat" data-seat-number="{num}" data-table-label="{table_label}" data-category-id="{cat_id}" data-category-name="{cat_name}" data-price="{price}" style="cursor:pointer;">
      <g transform="translate({x}, {y}) rotate({rot})">
        <path d="{path_d}" fill="{fill_color}" stroke="{stroke_color}" stroke-width="0.8" stroke-linejoin="round"/>
        <!-- Armrests -->
        <rect x="{-hw}" y="{-hh+3}" width="2.5" height="{h-6}" rx="1" fill="#94a3b8"/>
        <rect x="{hw-2.5}" y="{-hh+3}" width="2.5" height="{h-6}" rx="1" fill="#94a3b8"/>
      </g>
      <text x="{x}" y="{y+2.5}" font-family="system-ui, -apple-system, sans-serif" font-size="7" font-weight="700" fill="#0f172a" text-anchor="middle" pointer-events="none">{num}</text>
    </g>'''

def render_rect_table(x, y, w, h, label=''):
    return f'''
    <g>
      <rect x="{x - w/2}" y="{y - h/2}" width="{w}" height="{h}" rx="3" fill="#ffffff" stroke="#334155" stroke-width="1.2" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"/>
      {f'<text x="{x}" y="{y+3}" font-family="system-ui, sans-serif" font-size="7" font-weight="bold" fill="#475569" text-anchor="middle">{label}</text>' if label else ''}
    </g>'''

def render_round_table(x, y, r, label=''):
    return f'''
    <g>
      <circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" stroke="#334155" stroke-width="1.2"/>
      {f'<text x="{x}" y="{y+2.5}" font-family="system-ui, sans-serif" font-size="6.5" font-weight="bold" fill="#475569" text-anchor="middle">{label}</text>' if label else ''}
    </g>'''

def render_vip_sofa(x, y, w, h, label, seat_nums, cat_id='vip_sofa', cat_name='VIP Диван', price=2500):
    """Generates a luxury semicircular / curved VIP sofa with individual seats."""
    sofa_bg = f'''
    <g>
      <rect x="{x - w/2}" y="{y - h/2}" width="{w}" height="{h}" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.2"/>
      <text x="{x}" y="{y-h/2-3}" font-family="system-ui, sans-serif" font-size="7.5" font-weight="bold" fill="#b45309" text-anchor="middle">{label}</text>
    </g>'''
    # Distribute seats inside sofa
    seats_html = []
    n = len(seat_nums)
    dx = (w - 16) / max(1, (n - 1)) if n > 1 else 0
    start_x = x - (w - 16)/2 if n > 1 else x
    for idx, snum in enumerate(seat_nums):
        sx = start_x + idx * dx
        sy = y
        seats_html.append(render_chair(sx, sy, snum, 'down', cat_id, cat_name, label, price, size=13))
    return sofa_bg + ''.join(seats_html)

def make_svg_wrapper(title, subtitle, lower_content, upper_content):
    return f'''<svg width="456" height="908" viewBox="0 0 456 908" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/>
    </filter>
  </defs>
  <style>
    .vessel-seat:hover path {{ filter: brightness(0.92); stroke: #2563eb !important; stroke-width: 1.5 !important; }}
    .vessel-seat.is-selected path {{ fill: #10b981 !important; stroke: #047857 !important; stroke-width: 1.5 !important; }}
    .vessel-seat.is-selected rect {{ fill: #059669 !important; }}
    .vessel-seat.is-selected text {{ fill: #ffffff !important; font-weight: bold; }}
  </style>

  <!-- Title & Headers -->
  <g id="header">
    <text x="228" y="42" font-family="'Gotham Pro', system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="#0F172A" text-anchor="middle" letter-spacing="0.05em">{title}</text>
    <text x="228" y="60" font-family="'Gotham Pro', system-ui, -apple-system, sans-serif" font-size="10" font-weight="500" fill="#64748B" text-anchor="middle">{subtitle}</text>
    <!-- Deck labels -->
    <rect x="55" y="80" width="125" height="24" rx="12" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="117.5" y="96" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#1E293B" text-anchor="middle">Нижняя палуба</text>

    <rect x="275" y="80" width="125" height="24" rx="12" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="337.5" y="96" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#1E293B" text-anchor="middle">Верхняя палуба</text>
  </g>

  <!-- Lower Deck Group (Left) -->
  <g id="bottom">
    {HULL_LOWER}
    {lower_content}
  </g>

  <!-- Upper Deck Group (Right) -->
  <g id="top">
    {HULL_UPPER}
    {upper_content}
  </g>

  <!-- Legend at Bottom -->
  <g id="legend" transform="translate(35, 848)">
    <rect x="0" y="0" width="386" height="42" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
    <circle cx="25" cy="21" r="7" fill="#dbeafe" stroke="#1e3a8a" stroke-width="0.8"/>
    <text x="38" y="25" font-family="system-ui, sans-serif" font-size="8" fill="#334155">Стандарт</text>
    
    <circle cx="110" cy="21" r="7" fill="#fef3c7" stroke="#b45309" stroke-width="0.8"/>
    <text x="123" y="25" font-family="system-ui, sans-serif" font-size="8" fill="#334155">VIP / Панорама</text>
    
    <circle cx="215" cy="21" r="7" fill="#10b981" stroke="#047857" stroke-width="0.8"/>
    <text x="228" y="25" font-family="system-ui, sans-serif" font-size="8" fill="#334155">Выбранное место</text>
    
    <circle cx="320" cy="21" r="7" fill="#94a3b8" stroke="#475569" stroke-width="0.8"/>
    <text x="333" y="25" font-family="system-ui, sans-serif" font-size="8" fill="#334155">Занято</text>
  </g>
</svg>'''

# -----------------------------------------------------------------------------
# 1. МОСКВА-201 (VIP ДИВАНЫ)
# -----------------------------------------------------------------------------
def build_moskva_201():
    lower = []
    # Bow VIP Salon: 6 VIP sofas
    lower.append('<text x="118" y="160" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">VIP НОСОВОЙ САЛОН (ДИВАНЫ)</text>')
    # VIP 1, 2, 3, 4, 5, 6
    lower.append(render_vip_sofa(85, 185, 45, 24, 'VIP 1', [1, 2, 3, 4], 'vip_sofa', 'VIP Диван 1', 2500))
    lower.append(render_vip_sofa(150, 185, 45, 24, 'VIP 2', [5, 6, 7, 8], 'vip_sofa', 'VIP Диван 2', 2500))
    lower.append(render_vip_sofa(80, 230, 42, 24, 'VIP 3', [9, 10, 11, 12], 'vip_sofa', 'VIP Диван 3', 2500))
    lower.append(render_vip_sofa(155, 230, 42, 24, 'VIP 4', [13, 14, 15, 16], 'vip_sofa', 'VIP Диван 4', 2500))
    lower.append(render_vip_sofa(80, 275, 42, 24, 'VIP 5', [17, 18, 19, 20], 'vip_sofa', 'VIP Диван 5', 2500))
    lower.append(render_vip_sofa(155, 275, 42, 24, 'VIP 6', [21, 22, 23, 24], 'vip_sofa', 'VIP Диван 6', 2500))

    # Stage & Dance floor
    lower.append('''
      <rect x="70" y="315" width="95" height="50" rx="4" fill="#ede9fe" stroke="#8b5cf6" stroke-width="1.2"/>
      <text x="118" y="333" font-size="8" font-weight="bold" fill="#6d28d9" text-anchor="middle">🎸 СЦЕНА &amp; ТАНЦПОЛ</text>
      <text x="118" y="347" font-size="7" fill="#7c3aed" text-anchor="middle">Живой звук / Рок-концерт</text>
    ''')

    # Main Salon Tables: 7, 8, 9, 10, 11, 12, 13, 14, 16, 18
    salon_tables = [
        (7, 75, 395, [25, 26, 27, 28]),
        (8, 160, 395, [29, 30, 31, 32]),
        (9, 75, 450, [33, 34, 35, 36]),
        (10, 160, 450, [37, 38, 39, 40]),
        (11, 75, 505, [41, 42, 43, 44]),
        (12, 160, 505, [45, 46, 47, 48]),
        (13, 75, 560, [49, 50, 51, 52]),
        (14, 160, 560, [53, 54, 55, 56]),
        (16, 75, 615, [57, 58, 59, 60]),
        (18, 160, 615, [61, 62, 63, 64])
    ]
    for tnum, tx, ty, snums in salon_tables:
        lower.append(render_rect_table(tx, ty, 32, 20, f'№{tnum}'))
        # 4 chairs around
        lower.append(render_chair(tx - 11, ty - 16, snums[0], 'down', 'standard', 'Салон', f'Стол №{tnum}', 1500))
        lower.append(render_chair(tx + 11, ty - 16, snums[1], 'down', 'standard', 'Салон', f'Стол №{tnum}', 1500))
        lower.append(render_chair(tx - 11, ty + 16, snums[2], 'up', 'standard', 'Салон', f'Стол №{tnum}', 1500))
        lower.append(render_chair(tx + 11, ty + 16, snums[3], 'up', 'standard', 'Салон', f'Стол №{tnum}', 1500))

    # Bar & Galley
    lower.append('''
      <rect x="52" y="650" width="132" height="42" rx="4" fill="#f8fafc" stroke="#64748b" stroke-width="1.2"/>
      <text x="90" y="675" font-size="8.5" font-weight="bold" fill="#334155" text-anchor="middle">🍸 БАР &amp; НАПИТКИ</text>
      <line x1="130" y1="650" x2="130" y2="692" stroke="#cbd5e1"/>
      <text x="157" y="675" font-size="8.5" font-weight="bold" fill="#334155" text-anchor="middle">КАМБУЗ</text>
    ''')

    # Stern Grill & Open deck
    lower.append('''
      <rect x="55" y="705" width="126" height="52" rx="4" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2" stroke-dasharray="4 2"/>
      <text x="118" y="725" font-size="9" font-weight="bold" fill="#c2410c" text-anchor="middle">🔥 МАНГАЛЬНАЯ ЗОНА</text>
      <text x="118" y="738" font-size="7.5" fill="#ea580c" text-anchor="middle">Фирменный гриль на углях</text>
      <text x="118" y="750" font-size="7" fill="#64748b" text-anchor="middle">Открытая кормовая площадка · WC</text>
    ''')

    # Upper Deck
    upper = []
    # Captain Bridge
    upper.append('''
      <path d="M310 160 Q338 152 366 160 L360 185 L316 185 Z" fill="#f1f5f9" stroke="#475569" stroke-width="1.2"/>
      <text x="338" y="176" font-size="7" font-weight="bold" fill="#475569" text-anchor="middle">⚓ РУБКА КАПИТАНА</text>
    ''')
    upper.append('<text x="338" y="202" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">ПАНОРАМНЫЙ САЛОН (ДИВАНЫ НА ДВОИХ)</text>')

    # Panoramic Double Sofas VIP 21..33 along right window, Tables 20..32 along left window
    panoramic_rows = [
        (21, 20, 230, [65, 66], [67, 68]),
        (23, 22, 275, [69, 70], [71, 72]),
        (25, 24, 320, [73, 74], [75, 76]),
        (27, 26, 365, [77, 78], [79, 80]),
        (29, 28, 410, [81, 82], [83, 84]),
        (31, 30, 455, [85, 86], [87, 88]),
        (33, 32, 500, [89, 90], [91, 92]),
    ]
    for vip_num, t_num, ry, vip_seats, t_seats in panoramic_rows:
        # Left side: table
        upper.append(render_rect_table(305, ry, 26, 18, f'№{t_num}'))
        upper.append(render_chair(305, ry - 14, t_seats[0], 'down', 'standard', 'Верхняя палуба', f'Стол №{t_num}', 1800, 12))
        upper.append(render_chair(305, ry + 14, t_seats[1], 'up', 'standard', 'Верхняя палуба', f'Стол №{t_num}', 1800, 12))
        # Right side: VIP sofa for two
        upper.append(render_vip_sofa(370, ry, 36, 20, f'VIP {vip_num}', vip_seats, 'vip_front', f'VIP Диван {vip_num}', 2800))

    # Promenade & Open Terrace
    upper.append('''
      <rect x="285" y="530" width="106" height="2" fill="#cbd5e1"/>
      <text x="338" y="546" font-size="8" font-weight="bold" fill="#0369a1" text-anchor="middle">ПРОМЕНАД И ОТКРЫТАЯ ТЕРРАСА</text>
    ''')
    promenade_tables = [
        (34, 305, 575, [93, 94, 95, 96]),
        (35, 370, 575, [97, 98, 99, 100]),
        (36, 305, 630, [101, 102, 103, 104]),
        (37, 370, 630, [105, 106, 107, 108]),
    ]
    for pnum, px, py, ps in promenade_tables:
        upper.append(render_round_table(px, py, 14, f'№{pnum}'))
        upper.append(render_chair(px, py - 18, ps[0], 'down', 'open_deck', 'Открытая терраса', f'Стол №{pnum}', 1600, 11))
        upper.append(render_chair(px + 18, py, ps[1], 'left', 'open_deck', 'Открытая терраса', f'Стол №{pnum}', 1600, 11))
        upper.append(render_chair(px, py + 18, ps[2], 'up', 'open_deck', 'Открытая терраса', f'Стол №{pnum}', 1600, 11))
        upper.append(render_chair(px - 18, py, ps[3], 'right', 'open_deck', 'Открытая терраса', f'Стол №{pnum}', 1600, 11))

    # Aft lounge
    upper.append('''
      <rect x="290" y="675" width="96" height="60" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2" stroke-dasharray="3 2"/>
      <text x="338" y="700" font-size="8" font-weight="bold" fill="#15803d" text-anchor="middle">ВИДОВАЯ ПЛОЩАДКА</text>
      <text x="338" y="715" font-size="7" fill="#166534" text-anchor="middle">Панорамный обзор 360°</text>
      <text x="338" y="728" font-size="6.5" fill="#64748b" text-anchor="middle">Развод мостов и набережные Невы</text>
    ''')

    return make_svg_wrapper(
        '«Москва-201»',
        'двухпалубный лайнер · VIP диваны &amp; мангал',
        ''.join(lower),
        ''.join(upper)
    )

# -----------------------------------------------------------------------------
# 2. МОСКВА-177 (КОНЦЕРТНЫЙ ФЛАГМАН)
# -----------------------------------------------------------------------------
def build_moskva_177():
    lower = []
    # Presidential State Room & Bridge
    lower.append('''
      <path d="M90 145 Q118 138 146 145 L140 165 L96 165 Z" fill="#e0e7ff" stroke="#4338ca" stroke-width="1.2"/>
      <text x="118" y="158" font-size="7" font-weight="bold" fill="#3730a3" text-anchor="middle">⭐ ПРЕЗИДЕНТСКИЙ МОСТИК</text>
    ''')
    lower.append('<text x="118" y="180" font-size="8" font-weight="bold" fill="#1e3a8a" text-anchor="middle">VIP КАЮТ-КОМПАНИЯ ПРЕЗИДЕНТОВ</text>')
    
    # 6 Presidential private boxes (1A, 1B, 2A, 2B, 3A, 3B)
    pres_boxes = [
        ('1A', 80, 205, [1, 2, 3]),
        ('1B', 155, 205, [4, 5, 6]),
        ('2A', 80, 250, [7, 8, 9]),
        ('2B', 155, 250, [10, 11, 12]),
        ('3A', 80, 295, [13, 14, 15]),
        ('3B', 155, 295, [16, 17, 18]),
    ]
    for bname, bx, by, bseats in pres_boxes:
        lower.append(render_vip_sofa(bx, by, 42, 22, f'Ложа {bname}', bseats, 'vip_presidential', f'Президентская ложа {bname}', 3000))

    # Nevsky Bar & Tables 4, 5, 6
    lower.append('''
      <rect x="52" y="335" width="132" height="42" rx="4" fill="#f8fafc" stroke="#0284c7" stroke-width="1.2"/>
      <text x="118" y="358" font-size="8.5" font-weight="bold" fill="#0369a1" text-anchor="middle">🍸 НЕВСКИЙ БАР</text>
    ''')
    lower.append(render_rect_table(80, 405, 34, 20, 'Стол 4'))
    lower.append(render_chair(68, 405, 19, 'right', 'standard', 'Невский бар', 'Стол №4', 1600))
    lower.append(render_chair(92, 405, 20, 'left', 'standard', 'Невский бар', 'Стол №4', 1600))
    
    lower.append(render_rect_table(155, 405, 34, 20, 'Стол 5'))
    lower.append(render_chair(143, 405, 21, 'right', 'standard', 'Невский бар', 'Стол №5', 1600))
    lower.append(render_chair(167, 405, 22, 'left', 'standard', 'Невский бар', 'Стол №5', 1600))
    
    lower.append(render_rect_table(118, 455, 34, 20, 'Стол 6'))
    lower.append(render_chair(106, 455, 23, 'right', 'standard', 'Невский бар', 'Стол №6', 1600))
    lower.append(render_chair(130, 455, 24, 'left', 'standard', 'Невский бар', 'Стол №6', 1600))

    # Service rooms
    lower.append('''
      <rect x="55" y="520" width="126" height="150" rx="4" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
      <text x="118" y="560" font-size="9" font-weight="bold" fill="#475569" text-anchor="middle">ФЛАГМАНСКИЙ КАМБУЗ</text>
      <text x="118" y="600" font-size="8" fill="#64748b" text-anchor="middle">КУРИЛЬНАЯ КОМНАТА</text>
      <text x="118" y="640" font-size="8" fill="#64748b" text-anchor="middle">САНИТАРНАЯ ЗОНА (3 WC)</text>
    ''')

    # Upper Deck (Rock Concert Deck)
    upper = []
    upper.append('<text x="338" y="155" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">VIP ПАРТЕР ПЕРЕД СЦЕНОЙ</text>')
    
    # VIP Parterre 10..15
    vip_parterre = [
        (10, 305, 180, [25, 26, 27]),
        (11, 370, 180, [28, 29, 30]),
        (12, 305, 220, [31, 32, 33]),
        (13, 370, 220, [34, 35, 36]),
        (14, 305, 260, [37, 38, 39]),
        (15, 370, 260, [40, 41, 42]),
    ]
    for pnum, px, py, pseats in vip_parterre:
        upper.append(render_rect_table(px, py, 32, 18, f'VIP {pnum}'))
        upper.append(render_chair(px - 10, py - 13, pseats[0], 'down', 'vip_front', 'VIP Партер', f'Стол VIP №{pnum}', 2600, 11))
        upper.append(render_chair(px + 10, py - 13, pseats[1], 'down', 'vip_front', 'VIP Партер', f'Стол VIP №{pnum}', 2600, 11))
        upper.append(render_chair(px, py + 13, pseats[2], 'up', 'vip_front', 'VIP Партер', f'Стол VIP №{pnum}', 2600, 11))

    # Giant Center Concert Stage & Drums & Dance Floor
    upper.append('''
      <rect x="286" y="295" width="104" height="60" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
      <text x="338" y="315" font-size="9" font-weight="900" fill="#a5b4fc" text-anchor="middle">⚡ РОК-СЦЕНА &amp; БАРАБАНЫ</text>
      <text x="338" y="330" font-size="7.5" fill="#818cf8" text-anchor="middle">КОНЦЕРТНЫЙ ТАНЦПОЛ</text>
      <circle cx="338" cy="342" r="6" fill="#4338ca"/>
      <circle cx="328" cy="340" r="4" fill="#4338ca"/>
      <circle cx="348" cy="340" r="4" fill="#4338ca"/>
    ''')

    # Parterre Rows 20..27 and 30..39
    rows = [
        (20, 21, 385, [43, 44, 45, 46], [47, 48, 49, 50]),
        (22, 23, 430, [51, 52, 53, 54], [55, 56, 57, 58]),
        (24, 25, 475, [59, 60, 61, 62], [63, 64, 65, 66]),
        (26, 27, 520, [67, 68, 69, 70], [71, 72, 73, 74]),
        (30, 31, 565, [75, 76, 77, 78], [79, 80, 81, 82]),
        (32, 33, 610, [83, 84, 85, 86], [87, 88, 89, 90]),
    ]
    for t1, t2, ry, s1, s2 in rows:
        # Left table
        upper.append(render_rect_table(305, ry, 28, 16, f'№{t1}'))
        upper.append(render_chair(305 - 8, ry - 12, s1[0], 'down', 'standard', 'Концертная палуба', f'Стол №{t1}', 1600, 10))
        upper.append(render_chair(305 + 8, ry - 12, s1[1], 'down', 'standard', 'Концертная палуба', f'Стол №{t1}', 1600, 10))
        upper.append(render_chair(305 - 8, ry + 12, s1[2], 'up', 'standard', 'Концертная палуба', f'Стол №{t1}', 1600, 10))
        upper.append(render_chair(305 + 8, ry + 12, s1[3], 'up', 'standard', 'Концертная палуба', f'Стол №{t1}', 1600, 10))
        # Right table
        upper.append(render_rect_table(370, ry, 28, 16, f'№{t2}'))
        upper.append(render_chair(370 - 8, ry - 12, s2[0], 'down', 'standard', 'Концертная палуба', f'Стол №{t2}', 1600, 10))
        upper.append(render_chair(370 + 8, ry - 12, s2[1], 'down', 'standard', 'Концертная палуба', f'Стол №{t2}', 1600, 10))
        upper.append(render_chair(370 - 8, ry + 12, s2[2], 'up', 'standard', 'Концертная палуба', f'Стол №{t2}', 1600, 10))
        upper.append(render_chair(370 + 8, ry + 12, s2[3], 'up', 'standard', 'Концертная палуба', f'Стол №{t2}', 1600, 10))

    # Gallery benches 40, 41, 42, 43 at stern
    upper.append('''
      <rect x="286" y="660" width="104" height="65" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <text x="338" y="678" font-size="8" font-weight="bold" fill="#1d4ed8" text-anchor="middle">ГАЛЕРКА НА ЛАВКАХ</text>
      <text x="338" y="690" font-size="7" fill="#2563eb" text-anchor="middle">«Лучший вид на разводные мосты»</text>
    ''')
    benches = [
        (40, 305, 715, [91, 92]),
        (41, 338, 715, [93, 94]),
        (42, 370, 715, [95, 96]),
    ]
    for bnum, bx, by, bseats in benches:
        upper.append(render_rect_table(bx, by, 22, 12, f'№{bnum}'))
        upper.append(render_chair(bx - 6, by - 10, bseats[0], 'down', 'open_deck', 'Галерка', f'Место №{bnum}', 1400, 9))
        upper.append(render_chair(bx + 6, by - 10, bseats[1], 'down', 'open_deck', 'Галерка', f'Место №{bnum}', 1400, 9))

    return make_svg_wrapper(
        '«Москва-177»',
        'концертный флагман «Рок Хит Нева»',
        ''.join(lower),
        ''.join(upper)
    )

# -----------------------------------------------------------------------------
# 3. СОЛЯРИС (ПРЕМИУМ-КЛАСС)
# -----------------------------------------------------------------------------
def build_solaris():
    lower = []
    # Captain's VIP Front Stalls
    lower.append('<text x="118" y="160" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">КАПИТАНСКИЙ VIP ПАРТЕР</text>')
    
    # Tables 1..5
    vips = [
        (1, 118, 185, [1, 2, 3, 4]),
        (2, 75, 230, [5, 6, 7, 8]),
        (3, 160, 230, [9, 10, 11, 12]),
        (4, 75, 275, [13, 14, 15, 16]),
        (5, 160, 275, [17, 18, 19, 20]),
    ]
    for vnum, vx, vy, vseats in vips:
        lower.append(render_rect_table(vx, vy, 32, 18, f'VIP {vnum}'))
        lower.append(render_chair(vx - 10, vy - 14, vseats[0], 'down', 'vip_front', 'Капитанский партер', f'Стол №{vnum}', 2500, 11))
        lower.append(render_chair(vx + 10, vy - 14, vseats[1], 'down', 'vip_front', 'Капитанский партер', f'Стол №{vnum}', 2500, 11))
        lower.append(render_chair(vx - 10, vy + 14, vseats[2], 'up', 'vip_front', 'Капитанский партер', f'Стол №{vnum}', 2500, 11))
        lower.append(render_chair(vx + 10, vy + 14, vseats[3], 'up', 'vip_front', 'Капитанский партер', f'Стол №{vnum}', 2500, 11))

    # Center Acoustic stage & Salon
    lower.append('''
      <rect x="70" y="315" width="95" height="35" rx="4" fill="#f0fdfa" stroke="#0d9488" stroke-width="1.2"/>
      <text x="118" y="332" font-size="8" font-weight="bold" fill="#0f766e" text-anchor="middle">🎹 АКУСТИЧЕСКАЯ СЦЕНА</text>
      <text x="118" y="344" font-size="7" fill="#14b8a6" text-anchor="middle">Рояль / Вокал</text>
    ''')

    # Salon tables 6..15
    solaris_salon = [
        (6, 75, 380, [21, 22, 23, 24]),
        (7, 160, 380, [25, 26, 27, 28]),
        (8, 75, 430, [29, 30, 31, 32]),
        (9, 160, 430, [33, 34, 35, 36]),
        (10, 75, 480, [37, 38, 39, 40]),
        (11, 160, 480, [41, 42, 43, 44]),
        (12, 75, 530, [45, 46, 47, 48]),
        (13, 160, 530, [49, 50, 51, 52]),
        (15, 118, 580, [53, 54, 55, 56]),
    ]
    for snum, sx, sy, sseats in solaris_salon:
        lower.append(render_rect_table(sx, sy, 30, 18, f'№{snum}'))
        lower.append(render_chair(sx - 9, sy - 13, sseats[0], 'down', 'standard', 'Салон Солярис', f'Стол №{snum}', 1700, 11))
        lower.append(render_chair(sx + 9, sy - 13, sseats[1], 'down', 'standard', 'Салон Солярис', f'Стол №{snum}', 1700, 11))
        lower.append(render_chair(sx - 9, sy + 13, sseats[2], 'up', 'standard', 'Салон Солярис', f'Стол №{snum}', 1700, 11))
        lower.append(render_chair(sx + 9, sy + 13, sseats[3], 'up', 'standard', 'Салон Солярис', f'Стол №{snum}', 1700, 11))

    # Bar & Spiral staircase & Stern grill
    lower.append('''
      <rect x="52" y="620" width="132" height="38" rx="4" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
      <text x="118" y="643" font-size="8.5" font-weight="bold" fill="#334155" text-anchor="middle">БАРНАЯ ЛИНИЯ СОЛЯРИС</text>
    ''')
    # Spiral staircase indicator
    lower.append('''
      <circle cx="160" cy="690" r="16" fill="#f1f5f9" stroke="#0284c7" stroke-width="1.5"/>
      <path d="M148 690 A12 12 0 1 1 172 690 A12 12 0 1 1 148 690" fill="none" stroke="#0284c7" stroke-width="1" stroke-dasharray="2 2"/>
      <text x="160" y="693" font-size="6" font-weight="bold" fill="#0369a1" text-anchor="middle">ЛЕСТНИЦА</text>
    ''')
    # Stern Grill & Tables 20, 21, 22, 23
    lower.append('''
      <rect x="55" y="680" width="85" height="60" rx="4" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <text x="97" y="700" font-size="7.5" font-weight="bold" fill="#c2410c" text-anchor="middle">МАНГАЛ</text>
      <text x="97" y="715" font-size="6.5" fill="#ea580c" text-anchor="middle">Столы 20-23</text>
    ''')
    lower.append(render_chair(75, 730, 57, 'up', 'open_deck', 'Мангальная зона', 'Стол №20', 1500, 11))
    lower.append(render_chair(95, 730, 58, 'up', 'open_deck', 'Мангальная зона', 'Стол №21', 1500, 11))
    lower.append(render_chair(115, 730, 59, 'up', 'open_deck', 'Мангальная зона', 'Стол №22', 1500, 11))

    # Upper Deck (Panoramic open terrace)
    upper = []
    upper.append('''
      <path d="M305 160 Q338 145 371 160 L365 190 L311 190 Z" fill="#0284c7" stroke="#0369a1" stroke-width="1.2"/>
      <text x="338" y="178" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">РУБКА СОЛЯРИС</text>
    ''')
    upper.append('<text x="338" y="215" font-size="8" font-weight="bold" fill="#0369a1" text-anchor="middle">ОТКРЫТАЯ ВИДОВАЯ ПАЛУБА</text>')

    # Upper tables 21..25
    solar_upper_tables = [
        (21, 305, 260, [60, 61, 62, 63]),
        (22, 370, 260, [64, 65, 66, 67]),
        (23, 305, 330, [68, 69, 70, 71]),
        (24, 370, 330, [72, 73, 74, 75]),
        (25, 338, 400, [76, 77, 78, 79]),
        (26, 305, 470, [80, 81, 82, 83]),
        (27, 370, 470, [84, 85, 86, 87]),
    ]
    for utnum, ux, uy, useats in solar_upper_tables:
        upper.append(render_round_table(ux, uy, 16, f'№{utnum}'))
        upper.append(render_chair(ux, uy - 18, useats[0], 'down', 'open_deck', 'Верхняя терраса', f'Стол №{utnum}', 1800, 11))
        upper.append(render_chair(ux + 18, uy, useats[1], 'left', 'open_deck', 'Верхняя терраса', f'Стол №{utnum}', 1800, 11))
        upper.append(render_chair(ux, uy + 18, useats[2], 'up', 'open_deck', 'Верхняя терраса', f'Стол №{utnum}', 1800, 11))
        upper.append(render_chair(ux - 18, uy, useats[3], 'right', 'open_deck', 'Верхняя терраса', f'Стол №{utnum}', 1800, 11))

    # Upper spiral staircase & Stern solarium
    upper.append('''
      <circle cx="370" cy="550" r="16" fill="#f1f5f9" stroke="#0284c7" stroke-width="1.5"/>
      <path d="M358 550 A12 12 0 1 1 382 550 A12 12 0 1 1 358 550" fill="none" stroke="#0284c7" stroke-width="1" stroke-dasharray="2 2"/>
      <text x="370" y="553" font-size="6" font-weight="bold" fill="#0369a1" text-anchor="middle">ВИНТОВАЯ</text>
      
      <rect x="290" y="600" width="96" height="110" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="338" y="630" font-size="8.5" font-weight="bold" fill="#15803d" text-anchor="middle">ЛАУНДЖ-ЗОНА</text>
      <text x="338" y="648" font-size="7" fill="#166534" text-anchor="middle">Шезлонги &amp; Коктейли</text>
      <text x="338" y="665" font-size="6.5" fill="#64748b" text-anchor="middle">Панорама ночного Петербурга</text>
    ''')

    return make_svg_wrapper(
        '«Солярис»',
        'премиум-класс · капитанский VIP партер',
        ''.join(lower),
        ''.join(upper)
    )

# -----------------------------------------------------------------------------
# 4. МОСКВА-125 (КЛАССИЧЕСКАЯ / ИНЖЕНЕРНАЯ)
# -----------------------------------------------------------------------------
def build_moskva_125():
    lower = []
    # Bow VIP Salon
    lower.append('<text x="118" y="160" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">VIP ЗОНА В НОСУ (СТОЛЫ 1-5)</text>')
    
    # VIP 1..5
    vips = [
        (1, 118, 185, [1, 2, 3, 4]),
        (2, 75, 230, [5, 6, 7, 8]),
        (3, 160, 230, [9, 10, 11, 12]),
        (4, 75, 275, [13, 14, 15, 16]),
        (5, 160, 275, [17, 18, 19, 20]),
    ]
    for vnum, vx, vy, vseats in vips:
        lower.append(render_rect_table(vx, vy, 32, 18, f'VIP {vnum}'))
        lower.append(render_chair(vx - 10, vy - 14, vseats[0], 'down', 'vip_front', 'VIP Нос', f'Стол №{vnum}', 2400, 11))
        lower.append(render_chair(vx + 10, vy - 14, vseats[1], 'down', 'vip_front', 'VIP Нос', f'Стол №{vnum}', 2400, 11))
        lower.append(render_chair(vx - 10, vy + 14, vseats[2], 'up', 'vip_front', 'VIP Нос', f'Стол №{vnum}', 2400, 11))
        lower.append(render_chair(vx + 10, vy + 14, vseats[3], 'up', 'vip_front', 'VIP Нос', f'Стол №{vnum}', 2400, 11))

    # Live Music & Dance Floor
    lower.append('''
      <rect x="68" y="315" width="100" height="40" rx="4" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.2"/>
      <text x="118" y="333" font-size="8" font-weight="bold" fill="#6d28d9" text-anchor="middle">🎷 ЖИВАЯ МУЗЫКА</text>
      <text x="118" y="347" font-size="7" fill="#8b5cf6" text-anchor="middle">Сцена &amp; Танцпол</text>
    ''')

    # Salon tables 6..16
    m125_tables = [
        (6, 75, 385, [21, 22, 23, 24]),
        (7, 160, 385, [25, 26, 27, 28]),
        (8, 75, 435, [29, 30, 31, 32]),
        (9, 160, 435, [33, 34, 35, 36]),
        (10, 75, 485, [37, 38, 39, 40]),
        (11, 160, 485, [41, 42, 43, 44]),
        (12, 75, 535, [45, 46, 47, 48]),
        (13, 160, 535, [49, 50, 51, 52]),
        (14, 75, 585, [53, 54, 55, 56]),
        (16, 160, 585, [57, 58, 59, 60]),
    ]
    for tnum, tx, ty, snums in m125_tables:
        lower.append(render_rect_table(tx, ty, 30, 18, f'№{tnum}'))
        lower.append(render_chair(tx - 9, ty - 13, snums[0], 'down', 'standard', 'Главный салон', f'Стол №{tnum}', 1500, 11))
        lower.append(render_chair(tx + 9, ty - 13, snums[1], 'down', 'standard', 'Главный салон', f'Стол №{tnum}', 1500, 11))
        lower.append(render_chair(tx - 9, ty + 13, snums[2], 'up', 'standard', 'Главный салон', f'Стол №{tnum}', 1500, 11))
        lower.append(render_chair(tx + 9, ty + 13, snums[3], 'up', 'standard', 'Главный салон', f'Стол №{tnum}', 1500, 11))

    # Bar & Grill "Smoke on the Water"
    lower.append('''
      <rect x="52" y="625" width="132" height="35" rx="4" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
      <text x="118" y="646" font-size="8.5" font-weight="bold" fill="#334155" text-anchor="middle">БАР &amp; КАМБУЗ</text>
      
      <rect x="55" y="675" width="126" height="60" rx="4" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2" stroke-dasharray="3 2"/>
      <text x="118" y="698" font-size="8.5" font-weight="bold" fill="#c2410c" text-anchor="middle">🔥 SMOKE ON THE WATER</text>
      <text x="118" y="712" font-size="7.5" fill="#ea580c" text-anchor="middle">Кормовой мангал и терраса</text>
      <text x="118" y="725" font-size="6.5" fill="#64748b" text-anchor="middle">Открытая площадка</text>
    ''')

    # Upper Deck
    upper = []
    upper.append('''
      <path d="M305 160 Q338 150 371 160 L365 185 L311 185 Z" fill="#f1f5f9" stroke="#475569" stroke-width="1.2"/>
      <text x="338" y="176" font-size="7" font-weight="bold" fill="#475569" text-anchor="middle">РУБКА (DECK OFFICE)</text>
    ''')
    upper.append('<text x="338" y="205" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">ЗАКРЫТЫЙ ТЕПЛЫЙ САЛОН (СТОЛЫ 20-31)</text>')

    # Tables 20..31
    m125_upper = [
        (20, 305, 235, [61, 62]),
        (21, 370, 235, [63, 64]),
        (22, 305, 280, [65, 66]),
        (23, 370, 280, [67, 68]),
        (24, 305, 325, [69, 70]),
        (25, 370, 325, [71, 72]),
        (26, 305, 370, [73, 74]),
        (27, 370, 370, [75, 76]),
        (28, 305, 415, [77, 78]),
        (29, 370, 415, [79, 80]),
        (30, 305, 460, [81, 82]),
        (31, 370, 460, [83, 84]),
    ]
    for utnum, ux, uy, useats in m125_upper:
        upper.append(render_rect_table(ux, uy, 28, 16, f'№{utnum}'))
        upper.append(render_chair(ux, uy - 12, useats[0], 'down', 'standard', 'Верхний салон', f'Стол №{utnum}', 1600, 10))
        upper.append(render_chair(ux, uy + 12, useats[1], 'up', 'standard', 'Верхний салон', f'Стол №{utnum}', 1600, 10))

    # DJ Booth & Upper dance floor
    upper.append('''
      <rect x="286" y="495" width="104" height="45" rx="4" fill="#faf5ff" stroke="#a855f7" stroke-width="1.2"/>
      <text x="338" y="515" font-size="8" font-weight="bold" fill="#9333ea" text-anchor="middle">🎧 DJ ГИД &amp; ТАНЦПОЛ</text>
      <text x="338" y="528" font-size="7" fill="#a855f7" text-anchor="middle">Звук &amp; Экскурсионный пульт</text>
    ''')

    # Upper open stern with tables
    upper.append('<text x="338" y="565" font-size="8" font-weight="bold" fill="#0369a1" text-anchor="middle">ОТКРЫТАЯ КОРМА</text>')
    upper_open_tables = [
        (34, 305, 600, [85, 86, 87, 88]),
        (35, 370, 600, [89, 90, 91, 92]),
        (36, 305, 660, [93, 94, 95, 96]),
        (37, 370, 660, [97, 98, 99, 100]),
    ]
    for opnum, opx, opy, opseats in upper_open_tables:
        upper.append(render_round_table(opx, opy, 14, f'№{opnum}'))
        upper.append(render_chair(opx, opy - 16, opseats[0], 'down', 'open_deck', 'Открытая корма', f'Стол №{opnum}', 1500, 10))
        upper.append(render_chair(opx + 16, opy, opseats[1], 'left', 'open_deck', 'Открытая корма', f'Стол №{opnum}', 1500, 10))
        upper.append(render_chair(opx, opy + 16, opseats[2], 'up', 'open_deck', 'Открытая корма', f'Стол №{opnum}', 1500, 10))
        upper.append(render_chair(opx - 16, opy, opseats[3], 'right', 'open_deck', 'Открытая корма', f'Стол №{opnum}', 1500, 10))

    return make_svg_wrapper(
        '«Москва-125»',
        'двухпалубный салон · живая музыка',
        ''.join(lower),
        ''.join(upper)
    )

# -----------------------------------------------------------------------------
# 5. МОСКВА-177 (ТАНЦЕВАЛЬНАЯ КОНФИГУРАЦИЯ)
# -----------------------------------------------------------------------------
def build_moskva_177_dance():
    lower = []
    # Presidential State Room & Lounge
    lower.append('<text x="118" y="160" font-size="8" font-weight="bold" fill="#1e3a8a" text-anchor="middle">ЛАУНДЖ-ЗОНА &amp; КАЮТ-КОМПАНИЯ</text>')
    lower.append(render_vip_sofa(85, 195, 45, 24, 'VIP 1', [1, 2, 3, 4], 'vip_sofa', 'VIP Лаундж 1', 2800))
    lower.append(render_vip_sofa(150, 195, 45, 24, 'VIP 2', [5, 6, 7, 8], 'vip_sofa', 'VIP Лаундж 2', 2800))
    lower.append(render_vip_sofa(85, 245, 45, 24, 'VIP 3', [9, 10, 11, 12], 'vip_sofa', 'VIP Лаундж 3', 2800))
    lower.append(render_vip_sofa(150, 245, 45, 24, 'VIP 4', [13, 14, 15, 16], 'vip_sofa', 'VIP Лаундж 4', 2800))
    
    # Extended Cocktail Bar
    lower.append('''
      <rect x="52" y="300" width="132" height="60" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="118" y="325" font-size="9" font-weight="bold" fill="#38bdf8" text-anchor="middle">🍸 КЛУБНЫЙ КОКТЕЙЛЬ-БАР</text>
      <text x="118" y="342" font-size="7.5" fill="#bae6fd" text-anchor="middle">Премиальная барная карта</text>
    ''')

    # Lower lounge tables
    dance_low_tables = [
        (5, 75, 400, [17, 18, 19, 20]),
        (6, 160, 400, [21, 22, 23, 24]),
        (7, 75, 460, [25, 26, 27, 28]),
        (8, 160, 460, [29, 30, 31, 32]),
    ]
    for dtnum, dtx, dty, dtseats in dance_low_tables:
        lower.append(render_rect_table(dtx, dty, 32, 20, f'№{dtnum}'))
        lower.append(render_chair(dtx - 11, dty - 15, dtseats[0], 'down', 'standard', 'Лаундж', f'Стол №{dtnum}', 1600, 11))
        lower.append(render_chair(dtx + 11, dty - 15, dtseats[1], 'down', 'standard', 'Лаундж', f'Стол №{dtnum}', 1600, 11))
        lower.append(render_chair(dtx - 11, dty + 15, dtseats[2], 'up', 'standard', 'Лаундж', f'Стол №{dtnum}', 1600, 11))
        lower.append(render_chair(dtx + 11, dty + 15, dtseats[3], 'up', 'standard', 'Лаундж', f'Стол №{dtnum}', 1600, 11))

    # Upper Deck: Massive Dance Floor
    upper = []
    upper.append('''
      <rect x="280" y="150" width="116" height="50" rx="6" fill="#312e81" stroke="#818cf8" stroke-width="1.5"/>
      <text x="338" y="172" font-size="9" font-weight="900" fill="#e0e7ff" text-anchor="middle">🎧 DJ STAGE &amp; LIGHT SHOW</text>
      <text x="338" y="188" font-size="7.5" fill="#a5b4fc" text-anchor="middle">Мощный клубный звук</text>
    ''')

    # Massive Center Dance Floor
    upper.append('''
      <rect x="280" y="215" width="116" height="240" rx="8" fill="#1e1b4b" stroke="#c084fc" stroke-width="2"/>
      <text x="338" y="325" font-size="12" font-weight="900" fill="#f472b6" text-anchor="middle">💃 БОЛЬШОЙ ТАНЦПОЛ 🕺</text>
      <text x="338" y="345" font-size="8.5" fill="#e879f9" text-anchor="middle">Вместимость до 150 гостей</text>
      <line x1="290" y1="360" x2="386" y2="360" stroke="#a855f7" stroke-dasharray="4 4"/>
      <text x="338" y="378" font-size="7.5" fill="#c084fc" text-anchor="middle">Световые фермы и лазерное шоу</text>
    ''')

    # Side VIP lounges along upper deck
    upper.append(render_vip_sofa(305, 490, 36, 20, 'VIP 11', [33, 34, 35], 'vip_front', 'VIP Диван 11', 2800))
    upper.append(render_vip_sofa(370, 490, 36, 20, 'VIP 12', [36, 37, 38], 'vip_front', 'VIP Диван 12', 2800))
    upper.append(render_vip_sofa(305, 540, 36, 20, 'VIP 13', [39, 40, 41], 'vip_front', 'VIP Диван 13', 2800))
    upper.append(render_vip_sofa(370, 540, 36, 20, 'VIP 14', [42, 43, 44], 'vip_front', 'VIP Диван 14', 2800))

    # Upper Aft Cocktail Bar & View Deck
    upper.append('''
      <rect x="286" y="585" width="104" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
      <text x="338" y="615" font-size="9" font-weight="bold" fill="#38bdf8" text-anchor="middle">КОРМОВОЙ БАР</text>
      <text x="338" y="635" font-size="7.5" fill="#bae6fd" text-anchor="middle">Открытая видовая терраса</text>
      <text x="338" y="655" font-size="7" fill="#94a3b8" text-anchor="middle">Панорамный вид на ночной город</text>
    ''')

    return make_svg_wrapper(
        '«Москва-177»',
        'клубная танцевальная конфигурация',
        ''.join(lower),
        ''.join(upper)
    )

# -----------------------------------------------------------------------------
# Generate and save all files
# -----------------------------------------------------------------------------
schemes_to_build = {
    'moskva_201_scheme.svg': build_moskva_201(),
    'moskva_177_scheme.svg': build_moskva_177(),
    'solaris_scheme.svg': build_solaris(),
    'moskva_125_classic_scheme.svg': build_moskva_125(),
    'moskva_125_styled_scheme.svg': build_moskva_125(),
    'moskva_177_dance_scheme.svg': build_moskva_177_dance(),
}

output_dir = 'public/ships_schemes'
for fname, content in schemes_to_build.items():
    out_path = os.path.join(output_dir, fname)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Saved distinct authentic scheme: {out_path} ({len(content)} bytes)')

print('All distinct ship schemes generated successfully.')

