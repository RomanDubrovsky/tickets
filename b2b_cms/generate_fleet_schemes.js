// Generator for Fleet Seating Schemes:
// 1. Москва 125 (Рок Хит Нева) - 140 seats, 5 zones
// 2. Москва 177 (Концертный флагман) - 150 seats, 5 zones
// 3. Москва 201 (Двухпалубный лайнер) - 168 seats, 5 zones
// 4. Входные 60 (Однопалубный катер) - 60 general admission seats

const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'schemes');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Helper to create table
function createTableSeats(startId, sectionId, sectionName, deck, tableNum, centerX, centerY) {
    const offsets = [
        { dx: -12, dy: -12, seat: '1' },
        { dx: 12, dy: -12, seat: '2' },
        { dx: -12, dy: 12, seat: '3' },
        { dx: 12, dy: 12, seat: '4' }
    ];
    const seats = [];
    let curId = startId;
    offsets.forEach(off => {
        seats.push({
            id: String(curId++),
            sectionId: String(sectionId),
            sectionName: sectionName,
            deck: deck,
            row: `Стол ${tableNum}`,
            rowMetric: 'Стол',
            seat: String(off.seat),
            seatMetric: 'Место',
            coordinate: {
                x: Math.round(centerX + off.dx),
                y: Math.round(centerY + off.dy)
            }
        });
    });
    return { seats, nextId: curId };
}

// -------------------------------------------------------------
// 1. МОСКВА 125 (140 мест)
// -------------------------------------------------------------
function buildMoskva125() {
    let seats = [];
    let curId = 1;

    // Зона 1: VIP Нос (Столы 1-5 = 20 мест)
    [1, 2, 3, 4, 5].forEach((tNum, idx) => {
        const x = idx === 0 ? 790 : (idx <= 2 ? 740 : 700);
        const y = idx === 0 ? 200 : (idx % 2 === 1 ? 240 : 160);
        const res = createTableSeats(curId, '1', 'Главная палуба — VIP Нос (Панорама)', 'main', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 2: VIP Салон у сцены (Столы 6-10 = 20 мест)
    [6, 8, 10, 7, 9].forEach((tNum, idx) => {
        const x = idx < 3 ? 610 - (idx * 50) : 630 - ((idx - 3) * 50);
        const y = idx < 3 ? 240 : 160;
        const res = createTableSeats(curId, '2', 'Главная палуба — VIP Салон у сцены', 'main', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 3: Главный салон (Бар и танцпол, Столы 11, 12, 13, 14, 16 = 20 мест)
    [12, 14, 16, 11, 13].forEach((tNum, idx) => {
        const x = idx < 3 ? 460 - (idx * 50) : 460 - ((idx - 3) * 50);
        const y = idx < 3 ? 240 : 160;
        const res = createTableSeats(curId, '3', 'Главная палуба — Салон (Танцпол и Бар)', 'main', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 4: Верхняя закрытая палуба (Столы 20-31 = 48 мест)
    [20, 22, 24, 26, 28, 30].forEach((tNum, idx) => {
        const res = createTableSeats(curId, '4', 'Верхняя палуба — Закрытый салон', 'upper', tNum, 630 - (idx * 50), 590);
        seats.push(...res.seats);
        curId = res.nextId;
    });
    [21, 23, 25, 27, 29, 31].forEach((tNum, idx) => {
        const res = createTableSeats(curId, '4', 'Верхняя палуба — Закрытый салон', 'upper', tNum, 630 - (idx * 50), 510);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 5: Верхняя открытая палуба (Столы 34-38 = 20 мест + 12 прогулочных = 32 места)
    [34, 35, 36, 37, 38].forEach((tNum, idx) => {
        const x = idx < 2 ? 280 : (idx < 4 ? 220 : 140);
        const y = idx % 2 === 0 ? 590 : 510;
        const res = createTableSeats(curId, '5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    for (let w = 1; w <= 12; w++) {
        seats.push({
            id: String(curId++),
            sectionId: '5',
            sectionName: 'Верхняя палуба — Открытая палуба (Корма)',
            deck: 'upper',
            row: 'Открытая палуба',
            rowMetric: 'Сектор',
            seat: `Прогулочное ${w}`,
            seatMetric: 'Место',
            coordinate: { x: 70 + (w * 18), y: 550 }
        });
    }

    return seats;
}

// -------------------------------------------------------------
// 2. МОСКВА 177 (150 мест)
// -------------------------------------------------------------
function buildMoskva177() {
    let seats = [];
    let curId = 1;

    // Зона 1: VIP Носовая панорама (Столы VIP 1-5 = 20 мест)
    [1, 2, 3, 4, 5].forEach((tNum, idx) => {
        const x = idx === 0 ? 800 : (idx <= 2 ? 750 : 700);
        const y = idx === 0 ? 200 : (idx % 2 === 1 ? 240 : 160);
        const res = createTableSeats(curId, '1', 'Главная палуба — VIP Нос (Панорама)', 'main', `VIP ${tNum}`, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 2: Салон у сцены (Столы 6-11 = 24 места)
    [6, 8, 10, 7, 9, 11].forEach((tNum, idx) => {
        const x = idx < 3 ? 620 - (idx * 50) : 620 - ((idx - 3) * 50);
        const y = idx < 3 ? 240 : 160;
        const res = createTableSeats(curId, '2', 'Главная палуба — VIP Салон у сцены', 'main', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 3: Главный салон (Столы 12-16 = 20 мест)
    [12, 14, 16, 13, 15].forEach((tNum, idx) => {
        const x = idx < 3 ? 470 - (idx * 50) : 470 - ((idx - 3) * 50);
        const y = idx < 3 ? 240 : 160;
        const res = createTableSeats(curId, '3', 'Главная палуба — Салон (Танцпол и Бар)', 'main', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 4: Верхняя закрытая концертная палуба (Столы 20-31 = 48 мест)
    [20, 22, 24, 26, 28, 30].forEach((tNum, idx) => {
        const res = createTableSeats(curId, '4', 'Верхняя палуба — Закрытый салон', 'upper', tNum, 630 - (idx * 50), 590);
        seats.push(...res.seats);
        curId = res.nextId;
    });
    [21, 23, 25, 27, 29, 31].forEach((tNum, idx) => {
        const res = createTableSeats(curId, '4', 'Верхняя палуба — Закрытый салон', 'upper', tNum, 630 - (idx * 50), 510);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 5: Верхняя открытая корма (Столы 34-38 = 20 мест + 18 видовых мест = 38 мест)
    [34, 35, 36, 37, 38].forEach((tNum, idx) => {
        const x = idx < 2 ? 280 : (idx < 4 ? 220 : 150);
        const y = idx % 2 === 0 ? 590 : 510;
        const res = createTableSeats(curId, '5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    for (let w = 1; w <= 18; w++) {
        seats.push({
            id: String(curId++),
            sectionId: '5',
            sectionName: 'Верхняя палуба — Открытая палуба (Корма)',
            deck: 'upper',
            row: 'Открытая палуба',
            rowMetric: 'Сектор',
            seat: `Видовое ${w}`,
            seatMetric: 'Место',
            coordinate: { x: 70 + (w * 12), y: 550 }
        });
    }

    return seats;
}

// -------------------------------------------------------------
// 3. МОСКВА 201 (168 мест)
// -------------------------------------------------------------
function buildMoskva201() {
    let seats = [];
    let curId = 1;

    // Зона 1: Главная палуба — VIP Нос Диваны (VIP 1-6 = 24 места)
    [1, 2, 3, 4, 5, 6].forEach((tNum, idx) => {
        const x = idx < 3 ? 800 - (idx * 50) : 800 - ((idx - 3) * 50);
        const y = idx < 3 ? 240 : 160;
        const res = createTableSeats(curId, '1', 'Главная палуба — VIP Нос (Панорама)', 'main', `VIP Диван ${tNum}`, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 2: Главная палуба — Салон у сцены (Столы 7-12 = 24 места)
    [7, 9, 11, 8, 10, 12].forEach((tNum, idx) => {
        const x = idx < 3 ? 630 - (idx * 50) : 630 - ((idx - 3) * 50);
        const y = idx < 3 ? 240 : 160;
        const res = createTableSeats(curId, '2', 'Главная палуба — VIP Салон у сцены', 'main', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 3: Главная палуба — Салон & Бар (Столы 13-18 = 24 места)
    [13, 15, 17, 14, 16, 18].forEach((tNum, idx) => {
        const x = idx < 3 ? 470 - (idx * 50) : 470 - ((idx - 3) * 50);
        const y = idx < 3 ? 240 : 160;
        const res = createTableSeats(curId, '3', 'Главная палуба — Салон (Танцпол и Бар)', 'main', tNum, x, y);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    // Зона 4: Верхняя палуба — Панорамные диваны и столы (52 места)
    // VIP Диваны на двоих (7 диванов по 2 места = 14 мест)
    [21, 23, 25, 27, 29, 31, 33].forEach((tNum, idx) => {
        const cx = 650 - (idx * 35);
        const cy = 520;
        seats.push({
            id: String(curId++),
            sectionId: '4',
            sectionName: 'Верхняя палуба — Закрытый салон',
            deck: 'upper',
            row: `Диван ${tNum} (на двоих)`,
            rowMetric: 'Диван',
            seat: '1',
            seatMetric: 'Место',
            coordinate: { x: cx - 8, y: cy }
        });
        seats.push({
            id: String(curId++),
            sectionId: '4',
            sectionName: 'Верхняя палуба — Закрытый салон',
            deck: 'upper',
            row: `Диван ${tNum} (на двоих)`,
            rowMetric: 'Диван',
            seat: '2',
            seatMetric: 'Место',
            coordinate: { x: cx + 8, y: cy }
        });
    });
    // Столы по 4 места (Столы 20, 22, 24, 26, 28, 30, 32 = 28 мест)
    [20, 22, 24, 26, 28, 30, 32].forEach((tNum, idx) => {
        const res = createTableSeats(curId, '4', 'Верхняя палуба — Закрытый салон', 'upper', tNum, 650 - (idx * 40), 590);
        seats.push(...res.seats);
        curId = res.nextId;
    });
    // Доп столы закрытой палубы (2 стола по 5 мест = 10 мест)
    const extraT1 = createTableSeats(curId, '4', 'Верхняя палуба — Закрытый салон', 'upper', 19, 690, 555);
    seats.push(...extraT1.seats);
    curId = extraT1.nextId;
    const extraT2 = createTableSeats(curId, '4', 'Верхняя палуба — Закрытый салон', 'upper', 35, 360, 555);
    seats.push(...extraT2.seats);
    curId = extraT2.nextId;

    // Зона 5: Верхняя открытая корма (Столы 34-37 = 16 мест + 28 прогулочных = 44 места)
    [34, 36].forEach((tNum, idx) => {
        const res = createTableSeats(curId, '5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', tNum, 280 - (idx * 60), 590);
        seats.push(...res.seats);
        curId = res.nextId;
    });
    [35, 37].forEach((tNum, idx) => {
        const res = createTableSeats(curId, '5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', tNum, 280 - (idx * 60), 510);
        seats.push(...res.seats);
        curId = res.nextId;
    });

    for (let w = 1; w <= 30; w++) {
        seats.push({
            id: String(curId++),
            sectionId: '5',
            sectionName: 'Верхняя палуба — Открытая палуба (Корма)',
            deck: 'upper',
            row: 'Променад',
            rowMetric: 'Сектор',
            seat: `Место ${w}`,
            seatMetric: 'Место',
            coordinate: { x: 50 + (w * 8), y: 550 }
        });
    }

    return seats;
}

// -------------------------------------------------------------
// 4. ВХОДНЫЕ 60 (Однопалубный катер, 60 мест)
// -------------------------------------------------------------
function buildVhodnye60() {
    let seats = [];
    for (let i = 1; i <= 60; i++) {
        const col = (i - 1) % 15;
        const row = Math.floor((i - 1) / 15);
        seats.push({
            id: String(i),
            sectionId: '1',
            sectionName: 'Салон теплохода (Свободная посадка)',
            deck: 'main',
            row: `Ряд ${row + 1}`,
            rowMetric: 'Ряд',
            seat: `Место ${col + 1}`,
            seatMetric: 'Место',
            coordinate: {
                x: 200 + (col * 30),
                y: 180 + (row * 35)
            }
        });
    }
    return seats;
}

// Generate all 4 files
const m125 = buildMoskva125();
const m177 = buildMoskva177();
const m201 = buildMoskva201();
const v60 = buildVhodnye60();

fs.writeFileSync(path.join(targetDir, 'moskva_125.json'), JSON.stringify(m125, null, 2), 'utf8');
fs.writeFileSync(path.join(targetDir, 'moskva_177.json'), JSON.stringify(m177, null, 2), 'utf8');
fs.writeFileSync(path.join(targetDir, 'moskva_201.json'), JSON.stringify(m201, null, 2), 'utf8');
fs.writeFileSync(path.join(targetDir, 'vhodnye_60.json'), JSON.stringify(v60, null, 2), 'utf8');

// Also update main seats_layout.json with moskva_125
fs.writeFileSync(path.join(__dirname, 'seats_layout.json'), JSON.stringify(m125, null, 2), 'utf8');

console.log(`Generated:
- moskva_125: ${m125.length} seats
- moskva_177: ${m177.length} seats
- moskva_201: ${m201.length} seats
- vhodnye_60:  ${v60.length} seats`);
