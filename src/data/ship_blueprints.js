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
    bg_image: '/ships_schemes/moskva_125_clean.png',
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
    previewUrl: '/ships_schemes/moskva_125_clean.png',
    width: 1200,
    height: 560,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/moskva_125_clean.png',
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
    previewUrl: '/ships_schemes/moskva_177_blue.svg',
    width: 1200,
    height: 850,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/moskva_177_blue.svg',
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
    previewUrl: '/ships_schemes/moskva_201_blue.svg',
    width: 1200,
    height: 850,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/moskva_201_blue.svg',
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
    previewUrl: '/ships_schemes/solaris_blue.svg',
    width: 1200,
    height: 850,
    elementsScale: 1.0,
    bg_image: '/ships_schemes/solaris_blue.svg',
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

// Helper to auto-populate seats for tables in preset blueprints
const attachSeatsToTables = (tables) => {
  if (!tables || !Array.isArray(tables)) return [];
  return tables.map(t => {
    const sCount = t.seatsCount || (t.seats ? t.seats.length : 4);
    const existingSeats = t.seats && Array.isArray(t.seats) ? t.seats : null;
    const seats = existingSeats || Array.from({ length: sCount }, (_, i) => ({
      id: `${t.id}-${i + 1}`,
      seatNumber: i + 1,
      categoryId: t.categoryId || 'standard_table'
    }));
    return {
      ...t,
      seatsCount: sCount,
      seats: seats
    };
  });
};

// Raw presets
const RAW_PRESET_SHIP_DECKS = {
  // 1. Москва 125
  bp_m125_classic: {
    width: 1200,
    height: 560,
    elementsScale: 0.9,
    bg_image: null,
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
    bg_image: null,
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

  // 2. Москва 177 (Концертный флагман)
  bp_m177: {
    width: 1200,
    height: 560,
    elementsScale: 0.9,
    bg_image: null,
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_177', label: 'Танцпол перед сценой', x: 500, y: 185, width: 100, height: 90, capacity: 25, categoryId: 'entry_dance', price: 1200 }
    ],
    tables: [
      // VIP зона носовая панорама
      { id: 'VIP1', label: 'VIP 1 (Нос)', type: 'rect', x: 1040, y: 220, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP2', label: 'VIP 2', type: 'rect', x: 990, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP3', label: 'VIP 3', type: 'rect', x: 990, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP4', label: 'VIP 4', type: 'rect', x: 935, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP5', label: 'VIP 5', type: 'rect', x: 935, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      // Главная палуба — Салон у сцены
      { id: 'T6', label: 'Стол 6', type: 'rect', x: 820, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T7', label: 'Стол 7', type: 'rect', x: 820, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T8', label: 'Стол 8', type: 'rect', x: 770, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T9', label: 'Стол 9', type: 'rect', x: 770, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T10', label: 'Стол 10', type: 'rect', x: 720, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T11', label: 'Стол 11', type: 'rect', x: 720, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12', type: 'rect', x: 670, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T13', label: 'Стол 13', type: 'rect', x: 670, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T14', label: 'Стол 14', type: 'rect', x: 620, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T15', label: 'Стол 15', type: 'rect', x: 620, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      // Верхняя Концертная палуба
      { id: 'T20', label: 'Стол 20 (Верхняя)', type: 'rect', x: 820, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T21', label: 'Стол 21 (Верхняя)', type: 'rect', x: 820, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T22', label: 'Стол 22 (Верхняя)', type: 'rect', x: 770, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T23', label: 'Стол 23 (Верхняя)', type: 'rect', x: 770, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T24', label: 'Стол 24 (Верхняя)', type: 'rect', x: 720, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T25', label: 'Стол 25 (Верхняя)', type: 'rect', x: 720, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T26', label: 'Стол 26 (Верхняя)', type: 'rect', x: 670, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T27', label: 'Стол 27 (Верхняя)', type: 'rect', x: 670, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T28', label: 'Стол 28 (Верхняя)', type: 'rect', x: 620, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T29', label: 'Стол 29 (Верхняя)', type: 'rect', x: 620, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T30', label: 'Стол 30 (Верхняя)', type: 'rect', x: 570, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T31', label: 'Стол 31 (Верхняя)', type: 'rect', x: 570, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      // Открытая видовая корма
      { id: 'T34', label: 'Стол 34 (Корма)', type: 'round', x: 295, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T35', label: 'Стол 35 (Корма)', type: 'round', x: 295, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T36', label: 'Стол 36 (Корма)', type: 'round', x: 235, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T37', label: 'Стол 37 (Корма)', type: 'round', x: 235, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T38', label: 'Стол 38 (Корма)', type: 'round', x: 175, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' }
    ]
  },

  // 3. Москва 201 (VIP диваны)
  bp_m201: {
    width: 1200,
    height: 560,
    elementsScale: 0.9,
    bg_image: null,
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_201', label: 'Танцпол Главной палубы', x: 500, y: 185, width: 95, height: 90, capacity: 20, categoryId: 'entry_dance', price: 1200 }
    ],
    tables: [
      // Главная палуба — VIP диваны (носовая панорама)
      { id: 'VIP1', label: 'VIP 1 (Диван нос)', type: 'rect', x: 1040, y: 220, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP2', label: 'VIP 2 (Диван)', type: 'rect', x: 990, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP3', label: 'VIP 3 (Диван)', type: 'rect', x: 990, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP4', label: 'VIP 4 (Диван)', type: 'rect', x: 935, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP5', label: 'VIP 5 (Диван)', type: 'rect', x: 935, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP6', label: 'VIP 6 (Диван)', type: 'rect', x: 880, y: 220, seatsCount: 4, categoryId: 'vip_front' },
      // Главная палуба — Салон
      { id: 'T7', label: 'Стол 7', type: 'rect', x: 820, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T8', label: 'Стол 8', type: 'rect', x: 820, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T9', label: 'Стол 9', type: 'rect', x: 770, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T10', label: 'Стол 10', type: 'rect', x: 770, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T11', label: 'Стол 11', type: 'rect', x: 720, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12', type: 'rect', x: 720, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T13', label: 'Стол 13', type: 'rect', x: 670, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T14', label: 'Стол 14', type: 'rect', x: 670, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T16', label: 'Стол 16', type: 'rect', x: 620, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T18', label: 'Стол 18', type: 'rect', x: 620, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      // Верхняя палуба — VIP диваны на двоих
      { id: 'VIP21', label: 'VIP 21 (Для двоих)', type: 'round', x: 780, y: 360, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'VIP23', label: 'VIP 23 (Для двоих)', type: 'round', x: 730, y: 360, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'VIP25', label: 'VIP 25 (Для двоих)', type: 'round', x: 680, y: 360, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'VIP27', label: 'VIP 27 (Для двоих)', type: 'round', x: 630, y: 360, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'VIP29', label: 'VIP 29 (Для двоих)', type: 'round', x: 580, y: 360, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'VIP31', label: 'VIP 31 (Для двоих)', type: 'round', x: 530, y: 360, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      { id: 'VIP33', label: 'VIP 33 (Для двоих)', type: 'round', x: 480, y: 360, radius: 18, seatsCount: 2, categoryId: 'vip_front' },
      // Верхняя палуба — Столики
      { id: 'T20', label: 'Стол 20', type: 'rect', x: 780, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T22', label: 'Стол 22', type: 'rect', x: 730, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T24', label: 'Стол 24', type: 'rect', x: 680, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T26', label: 'Стол 26', type: 'rect', x: 630, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T28', label: 'Стол 28', type: 'rect', x: 580, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T30', label: 'Стол 30', type: 'rect', x: 530, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T32', label: 'Стол 32', type: 'rect', x: 480, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      // Променад / Корма
      { id: 'T34', label: 'Стол 34', type: 'round', x: 300, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T35', label: 'Стол 35', type: 'round', x: 300, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T36', label: 'Стол 36', type: 'round', x: 230, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T37', label: 'Стол 37', type: 'round', x: 230, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' }
    ]
  },

  // 4. Солярис (Премиум-класс)
  bp_solaris: {
    width: 1200,
    height: 560,
    elementsScale: 0.9,
    bg_image: null,
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_sol', label: 'Танцпол у сцены', x: 510, y: 185, width: 90, height: 90, capacity: 20, categoryId: 'entry_dance', price: 1200 }
    ],
    tables: [
      // Капитанский VIP партер
      { id: 'VIP1', label: 'VIP 1 Капитанский', type: 'rect', x: 1040, y: 220, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP2', label: 'VIP 2 Капитанский', type: 'rect', x: 990, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP3', label: 'VIP 3 Капитанский', type: 'rect', x: 990, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP4', label: 'VIP 4 Капитанский', type: 'rect', x: 935, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP5', label: 'VIP 5 Капитанский', type: 'rect', x: 935, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      // Нижняя палуба столики
      { id: 'T6', label: 'Стол 6', type: 'rect', x: 820, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T7', label: 'Стол 7', type: 'rect', x: 820, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T8', label: 'Стол 8', type: 'rect', x: 770, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T9', label: 'Стол 9', type: 'rect', x: 770, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T10', label: 'Стол 10', type: 'rect', x: 720, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T11', label: 'Стол 11', type: 'rect', x: 720, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12', type: 'rect', x: 670, y: 275, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T13', label: 'Стол 13', type: 'rect', x: 670, y: 165, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T15', label: 'Стол 15 (у бара)', type: 'rect', x: 620, y: 220, seatsCount: 4, categoryId: 'bar_zone' },
      // Нижняя открытая корма
      { id: 'T20', label: 'Стол 20', type: 'round', x: 310, y: 220, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T21', label: 'Стол 21', type: 'round', x: 250, y: 220, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T22', label: 'Стол 22', type: 'round', x: 190, y: 220, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      // Верхняя открытая палуба
      { id: 'T21_UP', label: '21 Верхняя', type: 'rect', x: 780, y: 440, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T22_UP', label: '22 Верхняя', type: 'rect', x: 780, y: 360, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T23_UP', label: '23 Верхняя', type: 'rect', x: 720, y: 440, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T24_UP', label: '24 Верхняя', type: 'rect', x: 720, y: 360, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T25_UP', label: '25 Верхняя (Корма)', type: 'round', x: 660, y: 400, radius: 22, seatsCount: 4, categoryId: 'open_deck' }
    ]
  },

  // 5. Москва 177 Танцевальная
  bp_m177_dance: {
    width: 1200,
    height: 560,
    elementsScale: 0.9,
    bg_image: null,
    bg_scale: 1.0,
    bg_offset_x: 0,
    bg_offset_y: 0,
    categories: DEFAULT_DECK_CATEGORIES,
    zones: [
      { id: 'Z_dance_m177', label: 'Большой клубный танцпол', x: 480, y: 160, width: 200, height: 130, capacity: 50, categoryId: 'entry_dance', price: 1200 }
    ],
    tables: [
      // VIP Носовые диваны
      { id: 'VIP1', label: 'VIP Диван 1', type: 'rect', x: 1040, y: 220, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP2', label: 'VIP Диван 2', type: 'rect', x: 990, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP3', label: 'VIP Диван 3', type: 'rect', x: 990, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP4', label: 'VIP Диван 4', type: 'rect', x: 935, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP5', label: 'VIP Диван 5', type: 'rect', x: 935, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      // Боковые VIP-диваны
      { id: 'VIP6', label: 'VIP Диван 6', type: 'rect', x: 860, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP7', label: 'VIP Диван 7', type: 'rect', x: 860, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP8', label: 'VIP Диван 8', type: 'rect', x: 790, y: 275, seatsCount: 4, categoryId: 'vip_front' },
      { id: 'VIP9', label: 'VIP Диван 9', type: 'rect', x: 790, y: 165, seatsCount: 4, categoryId: 'vip_front' },
      // Верхняя палуба столики
      { id: 'T10', label: 'Стол 10 (Верхняя)', type: 'rect', x: 780, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T11', label: 'Стол 11 (Верхняя)', type: 'rect', x: 780, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T12', label: 'Стол 12 (Верхняя)', type: 'rect', x: 720, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T13', label: 'Стол 13 (Верхняя)', type: 'rect', x: 720, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T14', label: 'Стол 14 (Верхняя)', type: 'rect', x: 660, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T15', label: 'Стол 15 (Верхняя)', type: 'rect', x: 660, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T16', label: 'Стол 16 (Верхняя)', type: 'rect', x: 600, y: 440, seatsCount: 4, categoryId: 'standard_table' },
      { id: 'T17', label: 'Стол 17 (Верхняя)', type: 'rect', x: 600, y: 360, seatsCount: 4, categoryId: 'standard_table' },
      // Открытая корма
      { id: 'T34', label: 'Стол 34', type: 'round', x: 300, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T35', label: 'Стол 35', type: 'round', x: 300, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T36', label: 'Стол 36', type: 'round', x: 230, y: 440, radius: 22, seatsCount: 4, categoryId: 'open_deck' },
      { id: 'T37', label: 'Стол 37', type: 'round', x: 230, y: 360, radius: 22, seatsCount: 4, categoryId: 'open_deck' }
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

// Export normalized presets with seats guaranteed on all tables
export const PRESET_SHIP_DECKS = Object.entries(RAW_PRESET_SHIP_DECKS).reduce((acc, [key, deck]) => {
  acc[key] = {
    ...deck,
    tables: attachSeatsToTables(deck.tables)
  };
  return acc;
}, {});

// Compatibility alias for styled preset
if (PRESET_SHIP_DECKS.bp_m125_stylized) {
  PRESET_SHIP_DECKS.bp_m125_styled = PRESET_SHIP_DECKS.bp_m125_stylized;
}

