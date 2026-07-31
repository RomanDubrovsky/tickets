import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const useSupabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL';
export const supabase = useSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Mock data – ships, agents, halls, events
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

const defaultHalls = [
  // Grid hall – concert hall example
  {
    id: 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab',
    name: 'Концертный зал',
    type: 'grid',
    rows: 15,
    seats_per_row: 20,
    svg_path: null,
    seats_json: null
  },
  // Custom SVG hall – ship deck example
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    name: 'Теплоход «Рок Хит Нева»',
    type: 'custom_svg',
    rows: null,
    seats_per_row: null,
    svg_path: '/assets/ship_deck.svg',
    seats_json: [
      { "id": "S1", "x": 120, "y": 45, "category": "standard" },
      { "id": "V1", "x": 300, "y": 90, "category": "vip" }
      // ... add other seats as needed
    ]
  }
];

const defaultEvents = [
  {
    id: 'e18c6501-c852-47e2-8951-b844f2d3d991',
    ship_id: 'a26084cb-626a-4638-b769-d4ff5a772da0',
    hall_id: 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab',
    name: 'Вечерний Рок-Круиз',
    description: 'Хиты мирового рока на Неве под разводные мосты. Живой звук и ресторан на борту.',
    date: new Date().toISOString().split('T')[0],
    time: '20:00:00',
    price_standard: 1200,
    price_vip: 2500,
    status: 'active'
  },
  {
    id: 'e18c6501-c852-47e2-8951-b844f2d3d992',
    ship_id: 'a26084cb-626a-4638-b769-d4ff5a772da0',
    hall_id: 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab',
    name: 'Ночной Джаз на Неве',
    description: 'Спокойная джазовая музыка и великолепные ночные виды Петербурга.',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    time: '22:30:00',
    price_standard: 1500,
    price_vip: 3000,
    status: 'active'
  },
  {
    id: 'e18c6501-c852-47e2-8951-b844f2d3d993',
    ship_id: 'b51b3f7f-e7cb-4b36-9a29-b632fa5a7751',
    hall_id: 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab',
    name: 'Гастрономический круиз "Панорама"',
    description: 'Изысканный ужин от шеф-повара во время прогулки по Неве.',
    date: new Date().toISOString().split('T')[0],
    time: '18:00:00',
    price_standard: 2000,
    price_vip: 4500,
    status: 'active'
  }
];

// Initialise localStorage for mock DB
function initLocalStorage() {
  if (!localStorage.getItem('ships')) localStorage.setItem('ships', JSON.stringify(defaultShips));
  if (!localStorage.getItem('agents')) localStorage.setItem('agents', JSON.stringify(defaultAgents));
  if (!localStorage.getItem('halls')) localStorage.setItem('halls', JSON.stringify(defaultHalls));
  if (!localStorage.getItem('events')) localStorage.setItem('events', JSON.stringify(defaultEvents));
  if (!localStorage.getItem('bookings')) localStorage.setItem('bookings', JSON.stringify([]));
}
initLocalStorage();

// ---- Public API ----
export async function getShips() {
  if (useSupabase) {
    const { data, error } = await supabase.from('ships').select('*');
    if (!error) return data;
  }
  return JSON.parse(localStorage.getItem('ships'));
}

export async function getAgents() {
  if (useSupabase) {
    const { data, error } = await supabase.from('agents').select('*');
    if (!error) return data;
  }
  return JSON.parse(localStorage.getItem('agents'));
}

export async function getHalls() {
  if (useSupabase) {
    const { data, error } = await supabase.from('halls').select('*');
    if (!error) return data;
  }
  return JSON.parse(localStorage.getItem('halls')) || [];
}

export async function getHallById(id) {
  if (useSupabase) {
    const { data, error } = await supabase.from('halls').select('*').eq('id', id).single();
    if (!error) return data;
  }
  const halls = JSON.parse(localStorage.getItem('halls')) || [];
  return halls.find(h => h.id === id) || null;
}

export async function getEvents() {
  if (useSupabase) {
    const { data, error } = await supabase.from('events').select('*');
    if (!error) return data;
  }
  // localStorage version already contains hall_id column
  return JSON.parse(localStorage.getItem('events'));
}

export async function getBookings() {
  if (useSupabase) {
    const { data, error } = await supabase.from('bookings').select('*, events(name)');
    if (!error) return data;
  }
  return JSON.parse(localStorage.getItem('bookings'));
}

export async function createBooking(bookingData) {
  if (useSupabase) {
    const { data, error } = await supabase.from('bookings').insert([bookingData]).select();
    if (!error) return data[0];
    throw error;
  }
  const bookings = JSON.parse(localStorage.getItem('bookings'));
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
  if (useSupabase) {
    const { data, error } = await supabase.from('events').insert([eventData]).select();
    if (!error) return data[0];
    throw error;
  }
  const events = JSON.parse(localStorage.getItem('events'));
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
  if (useSupabase) {
    const { data, error } = await supabase.from('agents').select('*').eq('promo_code', cleaned).single();
    if (!error) return data;
    return null;
  }
  const agents = JSON.parse(localStorage.getItem('agents'));
  return agents.find(a => a.promo_code === cleaned) || null;
}
