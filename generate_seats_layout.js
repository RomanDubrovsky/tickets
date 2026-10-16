// Script to generate comprehensive two-deck seating layout matching Ticketland "Rock Hit Neva" scheme
const fs = require('fs');
const path = require('path');

const sections = [
    { id: '1', name: 'Главная палуба — VIP Нос (Панорама)', defaultPrice: 4500 },
    { id: '2', name: 'Главная палуба — VIP Салон у сцены', defaultPrice: 3000 },
    { id: '3', name: 'Главная палуба — Салон (Танцпол и Бар)', defaultPrice: 2500 },
    { id: '4', name: 'Верхняя палуба — Закрытый салон (DJ/Гид)', defaultPrice: 1950 },
    { id: '5', name: 'Верхняя палуба — Открытая палуба (Корма)', defaultPrice: 1750 }
];

const seats = [];
let placeId = 1;

// Helper to add table with 4 seats
function addTable(sectionId, sectionName, deck, tableNum, centerX, centerY) {
    const offsets = [
        { dx: -12, dy: -12, seat: '1' },
        { dx: 12, dy: -12, seat: '2' },
        { dx: -12, dy: 12, seat: '3' },
        { dx: 12, dy: 12, seat: '4' }
    ];

    offsets.forEach(off => {
        seats.push({
            id: String(placeId++),
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
}

// -------------------------------------------------------------
// ГЛАВНАЯ ПАЛУБА (deck: 'main', y ~ 100..350)
// Нос справа (X ~ 700..850), Корма слева (X ~ 100..250)
// -------------------------------------------------------------

// Зона 1: VIP Нос (Панорама)
addTable('1', 'Главная палуба — VIP Нос (Панорама)', 'main', 1, 790, 200); // Самый носовой стол №1 (Красный 5000)
addTable('1', 'Главная палуба — VIP Нос (Панорама)', 'main', 2, 740, 240); // Стол 2
addTable('1', 'Главная палуба — VIP Нос (Панорама)', 'main', 3, 740, 160); // Стол 3
addTable('1', 'Главная палуба — VIP Нос (Панорама)', 'main', 4, 700, 240); // Стол 4
addTable('1', 'Главная палуба — VIP Нос (Панорама)', 'main', 5, 700, 160); // Стол 5

// Зона 2: VIP Салон у сцены и живой музыки
addTable('2', 'Главная палуба — VIP Салон у сцены', 'main', 6, 610, 240);  // Стол 6 (правый борт)
addTable('2', 'Главная палуба — VIP Салон у сцены', 'main', 8, 560, 240);  // Стол 8
addTable('2', 'Главная палуба — VIP Салон у сцены', 'main', 10, 510, 240); // Стол 10
addTable('2', 'Главная палуба — VIP Салон у сцены', 'main', 7, 630, 160);  // Стол 7 (у музыкантов)
addTable('2', 'Главная палуба — VIP Салон у сцены', 'main', 9, 580, 160);  // Стол 9 (у музыкантов)

// Зона 3: Главный салон (Танцпол и Бар)
addTable('3', 'Главная палуба — Салон (Танцпол и Бар)', 'main', 12, 460, 240); // Стол 12
addTable('3', 'Главная палуба — Салон (Танцпол и Бар)', 'main', 14, 410, 240); // Стол 14
addTable('3', 'Главная палуба — Салон (Танцпол и Бар)', 'main', 16, 360, 240); // Стол 16
addTable('3', 'Главная палуба — Салон (Танцпол и Бар)', 'main', 11, 460, 160); // Стол 11
addTable('3', 'Главная палуба — Салон (Танцпол и Бар)', 'main', 13, 410, 160); // Стол 13

// -------------------------------------------------------------
// ВЕРХНЯЯ ПАЛУБА (deck: 'upper', y ~ 450..700)
// Нос справа (X ~ 700..850), Корма слева (X ~ 100..250)
// -------------------------------------------------------------

// Зона 4: Верхняя закрытая палуба (Столы 20-31)
const upperRightTables = [20, 22, 24, 26, 28, 30];
upperRightTables.forEach((tNum, idx) => {
    addTable('4', 'Верхняя палуба — Закрытый салон (DJ/Гид)', 'upper', tNum, 630 - (idx * 50), 590);
});

const upperLeftTables = [21, 23, 25, 27, 29, 31];
upperLeftTables.forEach((tNum, idx) => {
    addTable('4', 'Верхняя палуба — Закрытый салон (DJ/Гид)', 'upper', tNum, 630 - (idx * 50), 510);
});

// Зона 5: Верхняя открытая палуба (Корма - столы 34-38 и прогулочные места)
addTable('5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', 34, 280, 590);
addTable('5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', 35, 280, 510);
addTable('5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', 36, 220, 590);
addTable('5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', 37, 220, 510);
addTable('5', 'Верхняя палуба — Открытая палуба (Корма)', 'upper', 38, 140, 510);

// Прогулочные места без столов вдоль фальшборта кормы
for (let walk = 1; walk <= 12; walk++) {
    seats.push({
        id: String(placeId++),
        sectionId: '5',
        sectionName: 'Верхняя палуба — Открытая палуба (Корма)',
        deck: 'upper',
        row: 'Открытая палуба',
        rowMetric: 'Сектор',
        seat: `Место ${walk}`,
        seatMetric: 'Место',
        coordinate: {
            x: 100,
            y: 500 + (walk * 10)
        }
    });
}

const outputPath = path.join(__dirname, 'b2b_cms', 'seats_layout.json');
fs.writeFileSync(outputPath, JSON.stringify(seats, null, 2), 'utf8');
console.log(`Generated ${seats.length} seats across 5 zones matching Ticketland layout!`);
