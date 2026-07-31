-- SQL Schema for Ship Cruise Ticket Platform ("Платформа")
-- Run this script in the Supabase SQL Editor for your project

-- 1. Enable UUID generation if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ships table
CREATE TABLE IF NOT EXISTS ships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    capacity INT DEFAULT 100,
    image_url TEXT,
    coordinates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Agents table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    promo_code TEXT UNIQUE NOT NULL,
    commission_rate NUMERIC(4,2) DEFAULT 0.10 NOT NULL, -- e.g. 0.10 for 10%
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Halls table (grid or custom SVG)
CREATE TABLE IF NOT EXISTS halls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('grid','custom_svg')),
    rows INT,                -- used when type = 'grid'
    seats_per_row INT,       -- used when type = 'grid'
    svg_path TEXT,           -- path to SVG for custom layouts
    seats_json JSONB,        -- optional seat coordinates for custom_svg
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Events (Cruises) table – now references a hall
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship_id UUID REFERENCES ships(id) ON DELETE CASCADE NOT NULL,
    hall_id UUID REFERENCES halls(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME WITHOUT TIME ZONE NOT NULL,
    price_standard NUMERIC(10,2) NOT NULL,
    price_vip NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    seat_number TEXT NOT NULL,
    seat_category TEXT CHECK (seat_category IN ('standard', 'vip')) NOT NULL,
    price_paid NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Insert initial mock data (ships, agents, events)
INSERT INTO ships (id, name, description, capacity, image_url, coordinates)
VALUES 
('a26084cb-626a-4638-b769-d4ff5a772da0', 'Рок Хит Нева', 'Комфортабельный теплоход с живой рок-музыкой, баром и отличным обзором на Неву.', 80, 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80', '{"lat": 59.9402, "lng": 30.3152}'),
('b51b3f7f-e7cb-4b36-9a29-b632fa5a7751', 'Чайка', 'Современный теплоход-ресторан премиум класса с панорамным остеклением.', 120, 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80', '{"lat": 59.9312, "lng": 30.3601}');

INSERT INTO agents (id, name, promo_code, commission_rate)
VALUES 
('c38b2512-108b-4b13-88bc-4672e8111223', 'Алексей (Промоутер Центр)', 'ALEXROCK', 0.15),
('d48b2512-208b-4b13-88bc-4672e8111224', 'Отель Астория (Дилер)', 'ASTORIA10', 0.10);

-- Example grid hall (concert hall)
INSERT INTO halls (id, name, type, rows, seats_per_row)
VALUES (
    'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab',
    'Концертный зал',
    'grid',
    15,
    20
);

-- Example custom SVG hall (ship deck)
INSERT INTO halls (id, name, type, svg_path, seats_json)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    'Теплоход «Рок Хит Нева»',
    'custom_svg',
    '/assets/ship_deck.svg',
    '[
        {"id":"S1","x":120,"y":45,"category":"standard"},
        {"id":"V1","x":300,"y":90,"category":"vip"}
        -- … add all seats here …
    ]'::jsonb
);

-- Events now reference a hall (using the grid hall above)
INSERT INTO events (id, ship_id, hall_id, name, description, date, time, price_standard, price_vip, status)
VALUES 
('e18c6501-c852-47e2-8951-b844f2d3d991', 'a26084cb-626a-4638-b769-d4ff5a772da0', 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab', 'Вечерний Рок-Круиз', 'Хиты мирового рока на Неве под разводные мосты. Живой звук и ресторан на борту.', CURRENT_DATE, '20:00:00', 1200.00, 2500.00, 'active'),
('e18c6501-c852-47e2-8951-b844f2d3d992', 'a26084cb-626a-4638-b769-d4ff5a772da0', 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab', 'Ночной Джаз на Неве', 'Спокойная джазовая музыка и великолепные ночные виды Петербурга.', CURRENT_DATE + INTERVAL '1 day', '22:30:00', 1500.00, 3000.00, 'active'),
('e18c6501-c852-47e2-8951-b844f2d3d993', 'b51b3f7f-e7cb-4b36-9a29-b632fa5a7751', 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab', 'Гастрономический круиз "Панорама"', 'Изысканный ужин от шеф-повара во время прогулки по Неве.', CURRENT_DATE, '18:00:00', 2000.00, 4500.00, 'active');
