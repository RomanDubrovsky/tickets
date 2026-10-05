// Preset deck configurations for ships imported from schemes
// Sources: 'Москва 125', 'Москва 177', 'Москва 201', 'Солярис'

export const SHIP_BLUEPRINTS = [
  {
    id: 'bp_m125_classic',
    shipName: 'Москва 125 (Схема А — Инженерная/Чертеж)',
    shipModel: 'Москва-125',
    previewUrl: '/ships_schemes/Москва 125.jpg',
    width: 1200,
    height: 560,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/Москва 125.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    capacity: 130,
    description: 'Теплоход типа «Москва-125» — двухпалубный салон (Главная палуба со сценой и VIP, Верхняя палуба с открытой зоной и DJ)'
  },
  {
    id: 'bp_m125_stylized',
    shipName: 'Москва 125 (Схема Б — Стиль Rock Hit Neva)',
    shipModel: 'Москва-125',
    previewUrl: '/ships_schemes/Москва 125 - она же.jpg',
    width: 1200,
    height: 560,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/Москва 125 - она же.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    capacity: 130,
    description: 'Теплоход «Москва-125» в фирменной графической стилизации Rock Hit Neva с четкой нумерацией столов'
  },
  {
    id: 'bp_m177',
    shipName: 'Москва 177 (Концертный флагман «Рок Хит Нева»)',
    shipModel: 'Москва-177',
    previewUrl: '/ships_schemes/Москва 177.png',
    width: 1200,
    height: 850,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/Москва 177.png',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    capacity: 140,
    description: 'Теплоход «Москва-177» — Главная палуба (Невский бар, Кают-компания Президентов) и Верхняя концертная палуба (Сцена, Партер VIP, Танцпол)'
  },
  {
    id: 'bp_m201',
    shipName: 'Москва 201 (Двухпалубный лайнер с мангальной зоной)',
    shipModel: 'Москва-201',
    previewUrl: '/ships_schemes/Москвар 201.png',
    width: 1200,
    height: 850,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/Москвар 201.png',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    capacity: 130,
    description: 'Теплоход «Москва-201» — Главная палуба (Концертный зал, VIP зал диванов, Бар, Мангал) и Верхняя палуба (Панорамный зал диванов на двоих, Променад)'
  },
  {
    id: 'bp_solaris',
    shipName: 'Теплоход «Солярис» (Премиум-класс с капитанским VIP)',
    shipModel: 'Солярис',
    previewUrl: '/ships_schemes/Солярис.png',
    width: 1200,
    height: 850,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/Солярис.png',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    capacity: 110,
    description: 'Теплоход «Солярис» — Нижняя закрытая палуба с Капитанским VIP партером у сцены, Бар, Открытая корма с мангалом, Верхняя палуба'
  },
  {
    id: 'bp_m177_dance',
    shipName: 'Москва 177 (Танцевальная конфигурация)',
    shipModel: 'Москва-177',
    previewUrl: '/ships_schemes/Москва 177 танцевальная.jpg',
    width: 1200,
    height: 560,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/Москва 177 танцевальная.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    capacity: 150,
    description: 'Теплоход «Москва-177» в танцевальной клубной компоновке: увеличенный танцпол у сцены, боковые VIP-диваны и барная стойка'
  },
  {
    id: 'bp_mts_hall_1',
    shipName: 'МТС Live Холл (Партер, Сцена и VIP-ложи)',
    shipModel: 'МТС Live Холл (Основной зал)',
    previewUrl: '/ships_schemes/МТС Холла_web.jpg',
    width: 1200,
    height: 1600,
    elementsScale: 1.1,
    bg_image: '/ships_schemes/МТС Холла_web.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    capacity: 2500,
    description: 'МТС Live Холл — концертная площадка: Сцена, VIP-партер, танцевальный партер, амфитеатр и боковые VIP-ложи'
  },
  {
    id: 'bp_mts_hall_2',
    shipName: 'МТС Live Холл (Балкон и бельэтаж)',
    shipModel: 'МТС Live Холл (Балкон)',
    previewUrl: '/ships_schemes/МТС Холла 2_web.jpg',
    width: 1200,
    height: 1500,
    elementsScale: 1.1,
    bg_image: '/ships_schemes/МТС Холла 2_web.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    capacity: 1800,
    description: 'МТС Live Холл — Схема ярусов балкона и бельэтажа с панорамным обзором сцены'
  }
];

// Default categories palette
export const DEFAULT_DECK_CATEGORIES = [
  { id: 'vip_front', name: 'VIP Партер / У сцены / Панорама', color: '#f59e0b', price: 2500 },
  { id: 'standard_table', name: 'Столики в салоне (Стандарт)', color: '#3b82f6', price: 1800 },
  { id: 'open_deck', name: 'Открытая палуба / Променад', color: '#06b6d4', price: 1600 },
  { id: 'entry_dance', name: 'Танцпол / Входной билет', color: '#8b5cf6', price: 1200 },
  { id: 'bar_zone', name: 'Барная зона', color: '#10b981', price: 1400 }
];

// Presets with ready-to-use tables and zones matching the blueprints
export const PRESET_SHIP_DECKS = {
  // 1. Москва 125
  bp_m125_classic: {
    width: 1200,
    height: 560,
    elementsScale: 0.9,
    bg_image: '/ships_schemes/Москва 125.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance', label: 'Танцпол Главной палубы', x: 570, y: 190, width: 90, height: 110, capacity: 25, categoryId: 'entry_dance', price: 1200 },
      { id: 'Z_open_upper', label: 'Открытая корма (Верхняя)', x: 120, y: 400, width: 140, height: 100, capacity: 20, categoryId: 'open_deck', price: 1600 }
    ],
    tables: [
      // VIP зона нос
      { id: 'T1', label: 'Стол 1 (VIP нос)', type: 'rect', x: 1040, y: 220, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T2', label: 'Стол 2 (VIP)', type: 'rect', x: 990, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T3', label: 'Стол 3 (VIP)', type: 'rect', x: 990, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T4', label: 'Стол 4 (VIP)', type: 'rect', x: 935, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T5', label: 'Стол 5 (VIP)', type: 'rect', x: 935, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      // Главная палуба
      { id: 'T6', label: 'Стол 6', type: 'rect', x: 775, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T7', label: 'Стол 7', type: 'rect', x: 815, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T8', label: 'Стол 8 (Диван VIP)', type: 'rect', x: 720, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T9', label: 'Стол 9', type: 'rect', x: 770, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T10', label: 'Стол 10 (Диван VIP)', type: 'rect', x: 670, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T11', label: 'Стол 11', type: 'rect', x: 620, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12', type: 'rect', x: 625, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T13', label: 'Стол 13', type: 'rect', x: 575, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T14', label: 'Стол 14', type: 'rect', x: 580, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T16', label: 'Стол 16', type: 'rect', x: 535, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      // Верхняя палуба
      { id: 'T20', label: 'Стол 20', type: 'rect', x: 765, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T21', label: 'Стол 21', type: 'rect', x: 765, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T22', label: 'Стол 22', type: 'rect', x: 730, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T23', label: 'Стол 23', type: 'rect', x: 730, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T24', label: 'Стол 24', type: 'rect', x: 695, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T25', label: 'Стол 25', type: 'rect', x: 695, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T26', label: 'Стол 26', type: 'rect', x: 660, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T27', label: 'Стол 27', type: 'rect', x: 660, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T28', label: 'Стол 28', type: 'rect', x: 625, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T29', label: 'Стол 29', type: 'rect', x: 625, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T30', label: 'Стол 30', type: 'rect', x: 590, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T31', label: 'Стол 31', type: 'rect', x: 590, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      // Открытая площадка столы
      { id: 'T34', label: 'Стол 34 (Открытая)', type: 'round', x: 295, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T35', label: 'Стол 35 (Открытая)', type: 'round', x: 295, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T36', label: 'Стол 36 (Открытая)', type: 'round', x: 225, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T37', label: 'Стол 37 (Открытая)', type: 'round', x: 225, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T38', label: 'Стол 38 (Открытая)', type: 'round', x: 155, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' }
    ]
  },

  // Москва 125 стилизованная
  bp_m125_stylized: {
    width: 1200,
    height: 560,
    elementsScale: 0.9,
    bg_image: '/ships_schemes/Москва 125 - она же.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_main', label: 'Танцпол Главной палубы', x: 520, y: 195, width: 100, height: 80, capacity: 25, categoryId: 'entry_dance', price: 1200 },
      { id: 'Z_dance_upper', label: 'Танцпол Верхней палубы', x: 380, y: 400, width: 80, height: 90, capacity: 15, categoryId: 'entry_dance', price: 1200 }
    ],
    tables: [
      { id: 'T1', label: 'Стол 1 (VIP нос)', type: 'rect', x: 990, y: 220, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T2', label: 'Стол 2 (VIP)', type: 'rect', x: 930, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T3', label: 'Стол 3 (VIP)', type: 'rect', x: 930, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T4', label: 'Стол 4 (VIP)', type: 'rect', x: 880, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T5', label: 'Стол 5 (VIP)', type: 'rect', x: 880, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T6', label: 'Стол 6', type: 'rect', x: 745, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T7', label: 'Стол 7', type: 'rect', x: 785, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T8', label: 'Стол 8 (VIP)', type: 'rect', x: 690, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T9', label: 'Стол 9', type: 'rect', x: 740, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T10', label: 'Стол 10 (VIP)', type: 'rect', x: 635, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T11', label: 'Стол 11', type: 'rect', x: 590, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12', type: 'rect', x: 590, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T13', label: 'Стол 13', type: 'rect', x: 540, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T14', label: 'Стол 14', type: 'rect', x: 540, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T16', label: 'Стол 16', type: 'rect', x: 485, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      // Верхняя палуба
      { id: 'T20', label: 'Стол 20', type: 'rect', x: 780, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T21', label: 'Стол 21', type: 'rect', x: 780, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T22', label: 'Стол 22', type: 'rect', x: 740, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T23', label: 'Стол 23', type: 'rect', x: 740, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T24', label: 'Стол 24', type: 'rect', x: 700, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T25', label: 'Стол 25', type: 'rect', x: 700, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T26', label: 'Стол 26', type: 'rect', x: 660, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T27', label: 'Стол 27', type: 'rect', x: 660, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T28', label: 'Стол 28', type: 'rect', x: 620, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T29', label: 'Стол 29', type: 'rect', x: 620, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T30', label: 'Стол 30', type: 'rect', x: 580, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T31', label: 'Стол 31', type: 'rect', x: 580, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T34', label: 'Стол 34', type: 'round', x: 295, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T35', label: 'Стол 35', type: 'round', x: 295, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T36', label: 'Стол 36', type: 'round', x: 235, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T37', label: 'Стол 37', type: 'round', x: 235, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T38', label: 'Стол 38', type: 'round', x: 165, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' }
    ]
  },

  // 2. Москва 177
  bp_m177: {
    width: 1200,
    height: 850,
    elementsScale: 0.95,
    bg_image: '/ships_schemes/Москва 177.png',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_177', label: 'Танцпол у сцены (Верхняя)', x: 560, y: 640, width: 120, height: 80, capacity: 30, categoryId: 'entry_dance', price: 1200 }
    ],
    tables: [
      // Нижняя палуба - Президентский мостик
      { id: 'T1A', label: '1A Президентский VIP', type: 'rect', x: 145, y: 320, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T1B', label: '1B Президентский VIP', type: 'rect', x: 145, y: 240, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T2A', label: '2A Президентский VIP', type: 'rect', x: 195, y: 320, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T2B', label: '2B Президентский VIP', type: 'rect', x: 195, y: 240, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T3A', label: '3A Президентский VIP', type: 'rect', x: 255, y: 320, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T3B', label: '3B Президентский VIP', type: 'rect', x: 255, y: 240, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T4', label: 'Стол 4 (Невский бар)', type: 'rect', x: 380, y: 330, seatsCount: 6, categoryId: 'bar_zone' },
      { id: 'T5', label: 'Стол 5 (Невский бар)', type: 'rect', x: 445, y: 330, seatsCount: 6, categoryId: 'bar_zone' },
      { id: 'T6', label: 'Стол 6 (Невский бар)', type: 'rect', x: 510, y: 330, seatsCount: 6, categoryId: 'bar_zone' },
      // Верхняя Концертная палуба
      { id: 'T7', label: 'Стол 7', type: 'rect', x: 260, y: 590, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T8', label: 'Стол 8', type: 'rect', x: 305, y: 590, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T9', label: 'Стол 9', type: 'rect', x: 350, y: 590, seatsCount: 4, categoryId: 'standard_table' },
      // Партер VIP диваны
      { id: 'T10', label: '10 VIP Партер', type: 'rect', x: 415, y: 600, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T11', label: '11 VIP Партер', type: 'rect', x: 460, y: 600, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T12', label: '12 Партер', type: 'rect', x: 510, y: 600, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T13', label: '13 Партер', type: 'rect', x: 560, y: 600, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T14', label: '14 VIP Партер', type: 'rect', x: 615, y: 600, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T15', label: '15 VIP Партер', type: 'rect', x: 665, y: 600, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T16', label: 'Стол 16', type: 'rect', x: 730, y: 590, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T17', label: 'Стол 17', type: 'rect', x: 775, y: 590, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T18', label: 'Стол 18', type: 'rect', x: 820, y: 590, seatsCount: 4, categoryId: 'standard_table' },
      // Ряд столов около сцены
      { id: 'T20', label: 'Стол 20', type: 'round', x: 260, y: 645, radius: 20, seatsCount: 2, categoryId: 'standard_table' },
      { id: 'T21', label: 'Стол 21', type: 'round', x: 305, y: 645, radius: 20, seatsCount: 2, categoryId: 'standard_table' },
      { id: 'T22', label: 'Стол 22', type: 'round', x: 350, y: 645, radius: 20, seatsCount: 2, categoryId: 'standard_table' },
      { id: 'T23', label: 'Стол 23', type: 'round', x: 395, y: 645, radius: 20, seatsCount: 2, categoryId: 'standard_table' },
      { id: 'T24', label: 'Стол 24', type: 'round', x: 675, y: 645, radius: 20, seatsCount: 2, categoryId: 'standard_table' },
      { id: 'T25', label: 'Стол 25', type: 'round', x: 720, y: 645, radius: 20, seatsCount: 2, categoryId: 'standard_table' },
      { id: 'T26', label: 'Стол 26', type: 'round', x: 765, y: 645, radius: 20, seatsCount: 2, categoryId: 'standard_table' },
      { id: 'T27', label: 'Стол 27', type: 'round', x: 810, y: 645, radius: 20, seatsCount: 2, categoryId: 'standard_table' },
      // Нижний ряд столов
      { id: 'T30', label: 'Стол 30', type: 'rect', x: 260, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T31', label: 'Стол 31', type: 'rect', x: 305, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T32', label: 'Стол 32', type: 'rect', x: 350, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T33', label: 'Стол 33', type: 'rect', x: 395, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T34', label: 'Стол 34', type: 'rect', x: 440, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T35', label: 'Стол 35', type: 'rect', x: 635, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T36', label: 'Стол 36', type: 'rect', x: 680, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T37', label: 'Стол 37', type: 'rect', x: 725, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T38', label: 'Стол 38', type: 'rect', x: 770, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T39', label: 'Стол 39', type: 'rect', x: 815, y: 700, seatsCount: 4, categoryId: 'standard_table' },
      // Галерка на лавках
      { id: 'T40', label: '40 Галерка', type: 'round', x: 970, y: 700, radius: 18, seatsCount: 2, categoryId: 'open_deck' },
      { id: 'T41', label: '41 Галерка', type: 'round', x: 1010, y: 700, radius: 18, seatsCount: 2, categoryId: 'open_deck' },
      { id: 'T42', label: '42 Галерка', type: 'round', x: 1035, y: 660, radius: 18, seatsCount: 2, categoryId: 'open_deck' },
      { id: 'T43', label: '43 Галерка', type: 'round', x: 1035, y: 625, radius: 18, seatsCount: 2, categoryId: 'open_deck' }
    ]
  },

  // 3. Москва 201
  bp_m201: {
    width: 1200,
    height: 850,
    elementsScale: 0.95,
    bg_image: '/ships_schemes/Москвар 201.png',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_201', label: 'Танцпол Главной палубы', x: 670, y: 350, width: 110, height: 75, capacity: 25, categoryId: 'entry_dance', price: 1200 },
      { id: 'Z_open_201', label: 'Открытая палуба (Корма)', x: 150, y: 640, width: 180, height: 110, capacity: 30, categoryId: 'open_deck', price: 1600 }
    ],
    tables: [
      // V.I.P зал нос
      { id: 'VIP1', label: 'VIP 1 (Диван нос)', type: 'rect', x: 990, y: 335, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP2', label: 'VIP 2 (Диван нос)', type: 'rect', x: 990, y: 410, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP3', label: 'VIP 3 (Диван)', type: 'rect', x: 940, y: 335, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP4', label: 'VIP 4 (Диван)', type: 'rect', x: 940, y: 410, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP5', label: 'VIP 5 (Диван)', type: 'rect', x: 890, y: 335, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP6', label: 'VIP 6 (Диван)', type: 'rect', x: 890, y: 410, seatsCount: 4, categoryId: 'vip_front' },
      // Главная палуба столы
      { id: 'T7', label: 'Стол 7', type: 'rect', x: 800, y: 310, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T8', label: 'Стол 8', type: 'rect', x: 800, y: 435, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T9', label: 'Стол 9', type: 'rect', x: 760, y: 310, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T10', label: 'Стол 10', type: 'rect', x: 760, y: 435, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T11', label: 'Стол 11', type: 'rect', x: 610, y: 310, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12', type: 'rect', x: 720, y: 435, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T13', label: 'Стол 13', type: 'rect', x: 570, y: 310, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T14', label: 'Стол 14', type: 'rect', x: 680, y: 435, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T16', label: 'Стол 16', type: 'rect', x: 640, y: 435, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T18', label: 'Стол 18', type: 'rect', x: 600, y: 435, seatsCount: 4, categoryId: 'standard_table' },
      // Верхняя палуба
      { id: 'T20', label: 'Стол 20', type: 'rect', x: 755, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'VIP21', label: 'VIP 21 (Место для двоих)', type: 'round', x: 730, y: 610, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T22', label: 'Стол 22', type: 'rect', x: 720, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'VIP23', label: 'VIP 23 (Место для двоих)', type: 'round', x: 695, y: 610, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T24', label: 'Стол 24', type: 'rect', x: 685, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'VIP25', label: 'VIP 25 (Место для двоих)', type: 'round', x: 660, y: 610, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T26', label: 'Стол 26', type: 'rect', x: 650, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'VIP27', label: 'VIP 27 (Место для двоих)', type: 'round', x: 625, y: 610, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T28', label: 'Стол 28', type: 'rect', x: 615, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'VIP29', label: 'VIP 29 (Место для двоих)', type: 'round', x: 590, y: 610, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T30', label: 'Стол 30', type: 'rect', x: 580, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'VIP31', label: 'VIP 31 (Место для двоих)', type: 'round', x: 555, y: 610, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'T32', label: 'Стол 32', type: 'rect', x: 545, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'VIP33', label: 'VIP 33 (Место для двоих)', type: 'round', x: 520, y: 610, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      // Променад столы
      { id: 'T34', label: 'Стол 34', type: 'rect', x: 440, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T35', label: 'Стол 35', type: 'rect', x: 440, y: 615, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T36', label: 'Стол 36', type: 'rect', x: 395, y: 690, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T37', label: 'Стол 37', type: 'rect', x: 395, y: 615, seatsCount: 4, categoryId: 'standard_table' }
    ]
  },

  // 4. Солярис
  bp_solaris: {
    width: 1200,
    height: 850,
    elementsScale: 0.95,
    bg_image: '/ships_schemes/Солярис.png',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_sol', label: 'Танцпол у сцены', x: 790, y: 490, width: 80, height: 75, capacity: 20, categoryId: 'entry_dance', price: 1200 },
      { id: 'Z_open_lower', label: 'Открытая корма (Нижняя)', x: 250, y: 500, width: 120, height: 75, capacity: 20, categoryId: 'open_deck', price: 1600 },
      { id: 'Z_open_upper_sol', label: 'Открытая верхняя палуба', x: 250, y: 770, width: 180, height: 75, capacity: 25, categoryId: 'open_deck', price: 1600 }
    ],
    tables: [
      // Капитанский партер VIP (синий сектор)
      { id: 'VIP1', label: '1 VIP Капитанский', type: 'rect', x: 880, y: 450, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP2', label: '2 VIP Капитанский', type: 'rect', x: 880, y: 545, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP3', label: '3 VIP Капитанский', type: 'rect', x: 835, y: 450, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP4', label: '4 VIP Капитанский', type: 'rect', x: 835, y: 545, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP5', label: '5 VIP Капитанский', type: 'rect', x: 790, y: 450, seatsCount: 4, categoryId: 'vip_front' },
      // Нижняя палуба столы
      { id: 'T6', label: 'Стол 6', type: 'rect', x: 745, y: 545, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T7', label: 'Стол 7', type: 'rect', x: 745, y: 450, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T8', label: 'Стол 8', type: 'rect', x: 700, y: 545, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T9', label: 'Стол 9', type: 'rect', x: 700, y: 450, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T10', label: 'Стол 10', type: 'rect', x: 655, y: 545, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T11', label: 'Стол 11', type: 'rect', x: 655, y: 450, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12', type: 'rect', x: 610, y: 545, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T13', label: 'Стол 13', type: 'rect', x: 610, y: 450, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T15', label: 'Стол 15 (у бара)', type: 'rect', x: 550, y: 480, seatsCount: 4, categoryId: 'bar_zone' },
      // Кормовые столы (Нижняя открытая)
      { id: 'T20', label: 'Стол 20', type: 'rect', x: 330, y: 480, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T21', label: 'Стол 21', type: 'rect', x: 330, y: 540, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T22', label: 'Стол 22', type: 'rect', x: 275, y: 480, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T23', label: 'Стол 23', type: 'rect', x: 275, y: 540, seatsCount: 4, categoryId: 'open_deck' },
      // Верхняя палуба столы
      { id: 'T21_UP', label: '21 Верхняя', type: 'rect', x: 440, y: 740, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T22_UP', label: '22 Верхняя', type: 'rect', x: 440, y: 800, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T23_UP', label: '23 Верхняя', type: 'rect', x: 300, y: 740, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T24_UP', label: '24 Верхняя', type: 'rect', x: 300, y: 800, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T25_UP', label: '25 Верхняя (Корма)', type: 'rect', x: 230, y: 770, seatsCount: 4, categoryId: 'open_deck' }
    ]
  },

  // 5. Москва 177 Танцевальная
  bp_m177_dance: {
    width: 1200,
    height: 560,
    elementsScale: 0.95,
    bg_image: '/ships_schemes/Москва 177 танцевальная.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_m177', label: 'Центральный клубный танцпол', x: 480, y: 220, width: 240, height: 160, capacity: 60, categoryId: 'entry_dance', price: 1200 },
      { id: 'Z_bar_m177', label: 'Барная зона', x: 260, y: 220, width: 100, height: 150, capacity: 25, categoryId: 'bar_zone', price: 1400 },
      { id: 'Z_open_m177', label: 'Открытая смотровая корма', x: 100, y: 220, width: 100, height: 150, capacity: 30, categoryId: 'open_deck', price: 1600 }
    ],
    tables: [
      // Левый борт VIP
      { id: 'VIP1', label: 'VIP Диван 1', type: 'rect', x: 780, y: 130, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP2', label: 'VIP Диван 2', type: 'rect', x: 700, y: 130, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP3', label: 'VIP Диван 3', type: 'rect', x: 620, y: 130, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP4', label: 'VIP Диван 4', type: 'rect', x: 540, y: 130, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T5', label: 'Стол 5', type: 'rect', x: 440, y: 130, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T6', label: 'Стол 6', type: 'rect', x: 360, y: 130, seatsCount: 4, categoryId: 'standard_table' },
      // Правый борт VIP
      { id: 'VIP7', label: 'VIP Диван 7', type: 'rect', x: 780, y: 390, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP8', label: 'VIP Диван 8', type: 'rect', x: 700, y: 390, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP9', label: 'VIP Диван 9', type: 'rect', x: 620, y: 390, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP10', label: 'VIP Диван 10', type: 'rect', x: 540, y: 390, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'T11', label: 'Стол 11', type: 'rect', x: 440, y: 390, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12', type: 'rect', x: 360, y: 390, seatsCount: 4, categoryId: 'standard_table' },
      // Носовые VIP у сцены
      { id: 'VIP_N1', label: 'VIP 13 (У сцены)', type: 'round', x: 860, y: 180, radius: 20, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP_N2', label: 'VIP 14 (У сцены)', type: 'round', x: 860, y: 340, radius: 20, seatsCount: 4, categoryId: 'vip_front' }
    ]
  },

  // 6. МТС Live Холл — Партер и VIP-ложи
  bp_mts_hall_1: {
    width: 1200,
    height: 1600,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/МТС Холла_web.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: [
      { id: 'vip_box', name: 'VIP Ложи / Премиум лаунж', color: '#e11d48', price: 6500 },
      { id: 'vip_parter', name: 'VIP Партер (Ряды 1-5)', color: '#f59e0b', price: 4500 },
      { id: 'parter_std', name: 'Партер стандарт', color: '#3b82f6', price: 2800 },
      { id: 'fan_dance', name: 'Танцевальный партер / Фан-зона', color: '#8b5cf6', price: 2200 }
    ],
    zones: [
      { id: 'Z_mts_fan', label: 'Фан-зона и Танцпол перед сценой', x: 380, y: 380, width: 440, height: 260, capacity: 1200, categoryId: 'fan_dance', price: 2200 },
      { id: 'Z_mts_parter', label: 'Партер сидячие ряды', x: 350, y: 680, width: 500, height: 320, capacity: 800, categoryId: 'parter_std', price: 2800 }
    ],
    tables: [
      // Левая линия VIP лож
      { id: 'BOX_L1', label: 'VIP Ложа 1', type: 'rect', x: 160, y: 450, seatsCount: 6, categoryId: 'vip_box' },
      { id: 'BOX_L2', label: 'VIP Ложа 2', type: 'rect', x: 160, y: 560, seatsCount: 6, categoryId: 'vip_box' },
      { id: 'BOX_L3', label: 'VIP Ложа 3', type: 'rect', x: 160, y: 670, seatsCount: 6, categoryId: 'vip_box' },
      { id: 'BOX_L4', label: 'VIP Ложа 4', type: 'rect', x: 160, y: 780, seatsCount: 6, categoryId: 'vip_box' },
      // Правая линия VIP лож
      { id: 'BOX_R1', label: 'VIP Ложа 5', type: 'rect', x: 970, y: 450, seatsCount: 6, categoryId: 'vip_box' },
      { id: 'BOX_R2', label: 'VIP Ложа 6', type: 'rect', x: 970, y: 560, seatsCount: 6, categoryId: 'vip_box' },
      { id: 'BOX_R3', label: 'VIP Ложа 7', type: 'rect', x: 970, y: 670, seatsCount: 6, categoryId: 'vip_box' },
      { id: 'BOX_R4', label: 'VIP Ложа 8', type: 'rect', x: 970, y: 780, seatsCount: 6, categoryId: 'vip_box' }
    ]
  },

  // 7. МТС Live Холл — Балкон и ярусы
  bp_mts_hall_2: {
    width: 1200,
    height: 1500,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/МТС Холла 2_web.jpg',
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: [
      { id: 'balcony_vip', name: 'Балкон VIP (Центр 1 ряд)', color: '#f59e0b', price: 3800 },
      { id: 'balcony_std', name: 'Балкон (Ряды 2-10)', color: '#3b82f6', price: 2400 },
      { id: 'amphitheatre', name: 'Бельэтаж и амфитеатр', color: '#06b6d4', price: 2900 }
    ],
    zones: [
      { id: 'Z_mts_balcony_c', label: 'Балкон Центральный сектор', x: 360, y: 420, width: 480, height: 350, capacity: 650, categoryId: 'balcony_std', price: 2400 },
      { id: 'Z_mts_balcony_l', label: 'Балкон Левый сектор', x: 180, y: 500, width: 160, height: 400, capacity: 350, categoryId: 'balcony_std', price: 2400 },
      { id: 'Z_mts_balcony_r', label: 'Балкон Правый сектор', x: 860, y: 500, width: 160, height: 400, capacity: 350, categoryId: 'balcony_std', price: 2400 }
    ],
    tables: [
      { id: 'B_VIP1', label: 'Балкон VIP Стол 1', type: 'round', x: 460, y: 360, radius: 20, seatsCount: 4, categoryId: 'balcony_vip' },
      { id: 'B_VIP2', label: 'Балкон VIP Стол 2', type: 'round', x: 550, y: 360, radius: 20, seatsCount: 4, categoryId: 'balcony_vip' },
      { id: 'B_VIP3', label: 'Балкон VIP Стол 3', type: 'round', x: 640, y: 360, radius: 20, seatsCount: 4, categoryId: 'balcony_vip' },
      { id: 'B_VIP4', label: 'Балкон VIP Стол 4', type: 'round', x: 730, y: 360, radius: 20, seatsCount: 4, categoryId: 'balcony_vip' }
    ]
  }
};
