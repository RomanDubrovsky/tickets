-- SQL Schema for Ship Cruise Ticket Platform ("Платформа")
-- Run this script in the Supabase SQL Editor for your project

-- 1. Built-in UUID generation is used (gen_random_uuid())

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

-- 3.5. Staff table (Guides, Musicians, Captains)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('captain', 'guide', 'musician', 'manager')) NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    details TEXT, -- Used for rider links or availability notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.6. Programs table (Show programs)
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
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

-- 5. Events (Cruises) table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship_id UUID REFERENCES ships(id) ON DELETE CASCADE NOT NULL,
    hall_id UUID REFERENCES halls(id) ON DELETE SET NULL,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME WITHOUT TIME ZONE NOT NULL,
    price_standard NUMERIC(10,2) NOT NULL,
    price_vip NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5.5. Event Staff (Many-to-many relationship)
CREATE TABLE IF NOT EXISTS event_staff (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    role_assigned TEXT,
    PRIMARY KEY (event_id, staff_id)
);

-- 5.6. Time Logs (Clock-in / Clock-out)
CREATE TABLE IF NOT EXISTS time_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    clock_in TIMESTAMP WITH TIME ZONE,
    clock_out TIMESTAMP WITH TIME ZONE,
    hours_worked NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    seat_number TEXT,
    seat_category TEXT CHECK (seat_category IN ('standard', 'vip')),
    price_paid NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    tickets_count INT DEFAULT 1, -- Added to track batch sales
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Insert initial mock data (ships, agents, events, staff, programs)
INSERT INTO ships (id, name, description, capacity, image_url, coordinates)
VALUES 
('a26084cb-626a-4638-b769-d4ff5a772da0', 'Рок Хит Нева (М-177)', 'Комфортабельный теплоход с живой рок-музыкой.', 100, 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80', '{"lat": 59.9402, "lng": 30.3152}'),
('b51b3f7f-e7cb-4b36-9a29-b632fa5a7751', 'Соларис', 'Современный теплоход-ресторан премиум класса.', 120, 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80', '{"lat": 59.9312, "lng": 30.3601}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO agents (id, name, promo_code, commission_rate)
VALUES 
('c38b2512-108b-4b13-88bc-4672e8111223', 'Горбилет', 'GORBILET', 0.15),
('d48b2512-208b-4b13-88bc-4672e8111224', 'Биглион', 'BIGLION', 0.10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO halls (id, name, type, rows, seats_per_row)
VALUES (
    'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab',
    'Концертный зал',
    'grid',
    15,
    20
)
ON CONFLICT (id) DO NOTHING;

-- 8. Expenses table (fixed and variable costs)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT CHECK (type IN ('fixed', 'variable')) NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    date DATE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Transactions table (Cash flow)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC(10,2) NOT NULL,
    type TEXT CHECK (type IN ('in', 'out')) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    description TEXT,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Alerts table (System alarms)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT CHECK (level IN ('info', 'warning', 'critical')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
