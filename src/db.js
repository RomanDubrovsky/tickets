// Browser-safe data layer with local resilience and Yandex API gateway support

// Default seeds (Ships, Agents, Halls, Events)
const defaultShips = [
  {
    id: 'a26084cb-626a-4638-b769-d4ff5a772da0',
    name: 'Рок Хит Нева',
    description: 'Комфортабельный теплоход с живой рок-музыкой, баром и отличным обзором на Неву.',
    capacity: 80,
    image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 59.9402, lng: 30.3152 }
  },
  {
    id: 'b51b3f7f-e7cb-4b36-9a29-b632fa5a7751',
    name: 'Чайка',
    description: 'Современный теплоход-ресторан премиум класса с панорамным остеклением.',
    capacity: 120,
    image_url: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 59.9312, lng: 30.3601 }
  }
];

const defaultAgents = [
  {
    id: 'c38b2512-108b-4b13-88bc-4672e8111223',
    name: 'Алексей (Промоутер Центр)',
    promo_code: 'ALEXROCK',
    commission_rate: 0.15
  },
  {
    id: 'd48b2512-208b-4b13-88bc-4672e8111224',
    name: 'Отель Астория (Дилер)',
    promo_code: 'ASTORIA10',
    commission_rate: 0.10
  }
];

const defaultCategories = [
  { id: 'vip_window', name: 'VIP у окна / Панорама', color: '#f59e0b', price: 2500 },
  { id: 'stage_front', name: 'У сцены / Премиум', color: '#ec4899', price: 3000 },
  { id: 'standard', name: 'Стандартный стол', color: '#3b82f6', price: 1500 },
  { id: 'entry_dance', name: 'Танцпол / Входной билет', color: '#8b5cf6', price: 1200 },
  { id: 'bar', name: 'Барная зона', color: '#10b981', price: 1000 }
];

const defaultHalls = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    name: 'Теплоход «Рок Хит Нева» (Столы + Танцпол)',
    type: 'custom_svg',
    width: 860,
    height: 520,
    elementsScale: 1.0,
    categories: defaultCategories,
    zones: [
      {
        id: 'Z1',
        label: 'Танцпол у сцены',
        x: 80,
        y: 190,
        width: 100,
        height: 140,
        capacity: 20,
        categoryId: 'entry_dance'
      }
    ],
    tables: [
      {
        id: 'T1',
        label: 'Стол 1',
        type: 'round',
        x: 230,
        y: 110,
        seatsCount: 4,
        categoryId: 'stage_front',
        seats: [
          { id: 'T1-1', seatNumber: 1, categoryId: 'stage_front', price: 3000 },
          { id: 'T1-2', seatNumber: 2, categoryId: 'stage_front', price: 3000 },
          { id: 'T1-3', seatNumber: 3, categoryId: 'stage_front', price: 3000 },
          { id: 'T1-4', seatNumber: 4, categoryId: 'stage_front', price: 3000 }
        ]
      },
      {
        id: 'T2',
        label: 'Стол 2',
        type: 'round',
        x: 230,
        y: 410,
        seatsCount: 4,
        categoryId: 'stage_front',
        seats: [
          { id: 'T2-1', seatNumber: 1, categoryId: 'stage_front', price: 3000 },
          { id: 'T2-2', seatNumber: 2, categoryId: 'stage_front', price: 3000 },
          { id: 'T2-3', seatNumber: 3, categoryId: 'stage_front', price: 3000 },
          { id: 'T2-4', seatNumber: 4, categoryId: 'stage_front', price: 3000 }
        ]
      },
      {
        id: 'T3',
        label: 'Стол 3 (У окна)',
        type: 'rect',
        x: 410,
        y: 90,
        seatsCount: 6,
        categoryId: 'vip_window',
        seats: [
          { id: 'T3-1', seatNumber: 1, categoryId: 'vip_window', price: 2500 },
          { id: 'T3-2', seatNumber: 2, categoryId: 'vip_window', price: 2500 },
          { id: 'T3-3', seatNumber: 3, categoryId: 'vip_window', price: 2500 },
          { id: 'T3-4', seatNumber: 4, categoryId: 'vip_window', price: 2500 },
          { id: 'T3-5', seatNumber: 5, categoryId: 'vip_window', price: 2500 },
          { id: 'T3-6', seatNumber: 6, categoryId: 'vip_window', price: 2500 }
        ]
      },
      {
        id: 'T4',
        label: 'Стол 4 (У окна)',
        type: 'rect',
        x: 410,
        y: 430,
        seatsCount: 6,
        categoryId: 'vip_window',
        seats: [
          { id: 'T4-1', seatNumber: 1, categoryId: 'vip_window', price: 2500 },
          { id: 'T4-2', seatNumber: 2, categoryId: 'vip_window', price: 2500 },
          { id: 'T4-3', seatNumber: 3, categoryId: 'vip_window', price: 2500 },
          { id: 'T4-4', seatNumber: 4, categoryId: 'vip_window', price: 2500 },
          { id: 'T4-5', seatNumber: 5, categoryId: 'vip_window', price: 2500 },
          { id: 'T4-6', seatNumber: 6, categoryId: 'vip_window', price: 2500 }
        ]
      },
      {
        id: 'T5',
        label: 'Стол 5 (Центр)',
        type: 'round',
        x: 580,
        y: 200,
        seatsCount: 4,
        categoryId: 'standard',
        seats: [
          { id: 'T5-1', seatNumber: 1, categoryId: 'standard', price: 1500 },
          { id: 'T5-2', seatNumber: 2, categoryId: 'standard', price: 1500 },
          { id: 'T5-3', seatNumber: 3, categoryId: 'standard', price: 1500 },
          { id: 'T5-4', seatNumber: 4, categoryId: 'standard', price: 1500 }
        ]
      },
      {
        id: 'T6',
        label: 'Стол 6 (Центр)',
        type: 'round',
        x: 580,
        y: 320,
        seatsCount: 4,
        categoryId: 'standard',
        seats: [
          { id: 'T6-1', seatNumber: 1, categoryId: 'standard', price: 1500 },
          { id: 'T6-2', seatNumber: 2, categoryId: 'standard', price: 1500 },
          { id: 'T6-3', seatNumber: 3, categoryId: 'standard', price: 1500 },
          { id: 'T6-4', seatNumber: 4, categoryId: 'standard', price: 1500 }
        ]
      },
      {
        id: 'T7',
        label: 'Стол 7 (Корма)',
        type: 'rect',
        x: 730,
        y: 260,
        seatsCount: 6,
        categoryId: 'standard',
        seats: [
          { id: 'T7-1', seatNumber: 1, categoryId: 'standard', price: 1500 },
          { id: 'T7-2', seatNumber: 2, categoryId: 'standard', price: 1500 },
          { id: 'T7-3', seatNumber: 3, categoryId: 'standard', price: 1500 },
          { id: 'T7-4', seatNumber: 4, categoryId: 'standard', price: 1500 },
          { id: 'T7-5', seatNumber: 5, categoryId: 'standard', price: 1500 },
          { id: 'T7-6', seatNumber: 6, categoryId: 'standard', price: 1500 }
        ]
      }
    ]
  },
  {
    id: 'entry-only-hall-id',
    name: 'Вечеринка (Только входные билеты / Танцпол)',
    type: 'only_entry',
    capacity: 100,
    categories: [
      { id: 'entry_standard', name: 'Входной билет (Танцпол)', color: '#8b5cf6', price: 1200 },
      { id: 'entry_vip_deck', name: 'Входной VIP (с выходом на верхнюю палубу)', color: '#f59e0b', price: 2200 }
    ]
  },
  {
    id: 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab',
    name: 'Театральный партер (Ряды)',
    type: 'grid',
    rows: 10,
    seats_per_row: 16,
    categories: defaultCategories
  }
];

const defaultEvents = [
  {
    id: 'e18c6501-c852-47e2-8951-b844f2d3d991',
    ship_id: 'a26084cb-626a-4638-b769-d4ff5a772da0',
    hall_id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    name: 'Вечерний Рок-Круиз (Столы + Танцпол)',
    description: 'Хиты мирового рока на Неве под разводные мосты. Столики с панорамой и танцевальная зона у сцены.',
    date: new Date().toISOString().split('T')[0],
    time: '20:00:00',
    price_standard: 1500,
    price_vip: 2500,
    status: 'active'
  },
  {
    id: 'e18c6501-c852-47e2-8951-b844f2d3d992',
    ship_id: 'a26084cb-626a-4638-b769-d4ff5a772da0',
    hall_id: 'entry-only-hall-id',
    name: 'Ночной Рок-Рейв (Только входные билеты)',
    description: 'Драйвовая вечеринка без фиксированных столов: весь теплоход — единый танцпол и открытая палуба.',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '23:30:00',
    price_standard: 1200,
    price_vip: 2200,
    status: 'active'
  },
  {
    id: 'e18c6501-c852-47e2-8951-b844f2d3d993',
    ship_id: 'b51b3f7f-e7cb-4b36-9a29-b632fa5a7751',
    hall_id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    name: 'Гастрономический круиз "Панорама"',
    description: 'Изысканный ужин от шеф-повара во время прогулки по Неве.',
    date: new Date().toISOString().split('T')[0],
    time: '18:00:00',
    price_standard: 2000,
    price_vip: 4500,
    status: 'active'
  }
];

// LocalStorage initialization
function initLocalStorage() {
  if (!localStorage.getItem('ships')) localStorage.setItem('ships', JSON.stringify(defaultShips));
  if (!localStorage.getItem('agents')) localStorage.setItem('agents', JSON.stringify(defaultAgents));
  
  const existingHalls = localStorage.getItem('halls');
  if (!existingHalls || !existingHalls.includes('zones') || !existingHalls.includes('only_entry')) {
    localStorage.setItem('halls', JSON.stringify(defaultHalls));
  }
  
  const existingEvents = localStorage.getItem('events');
  if (!existingEvents || !existingEvents.includes('entry-only-hall-id')) {
    localStorage.setItem('events', JSON.stringify(defaultEvents));
  }
  
  if (!localStorage.getItem('bookings')) localStorage.setItem('bookings', JSON.stringify([]));
}
initLocalStorage();

// Public API
const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api/v1' 
  : null;

export async function getShips() {
  return JSON.parse(localStorage.getItem('ships')) || defaultShips;
}

export async function getAgents() {
  return JSON.parse(localStorage.getItem('agents')) || defaultAgents;
}

export async function getHalls() {
  return JSON.parse(localStorage.getItem('halls')) || defaultHalls;
}

export async function getHallById(id) {
  const halls = await getHalls();
  return halls.find(h => h.id === id) || null;
}

export async function getEvents() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API Gateway unreachable, fallback to local storage');
    }
  }
  return JSON.parse(localStorage.getItem('events')) || defaultEvents;
}

export async function getBookings() {
  return JSON.parse(localStorage.getItem('bookings')) || [];
}

export async function createBooking(bookingData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/tickets/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: bookingData.event_id,
          seatId: bookingData.seat_number,
          holdId: bookingData.holdId || crypto.randomUUID(),
          customerInfo: {
            name: bookingData.customer_name,
            email: bookingData.customer_email,
            phone: bookingData.customer_phone
          },
          promoCode: bookingData.promoCode
        })
      });
      if (res.ok) {
        const data = await res.json();
        return { id: data.data?.bookingId || crypto.randomUUID(), ...bookingData };
      }
    } catch (e) {
      console.warn('API Gateway offline, saving booking locally');
    }
  }

  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const newBooking = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...bookingData
  };
  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  return newBooking;
}

export async function createEvent(eventData) {
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  const newEvent = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...eventData
  };
  events.push(newEvent);
  localStorage.setItem('events', JSON.stringify(events));
  return newEvent;
}

export async function verifyPromoCode(code) {
  const cleaned = code.trim().toUpperCase();
  const agents = await getAgents();
  return agents.find(a => a.promo_code === cleaned) || null;
}
